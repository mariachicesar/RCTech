"use client";
import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";
import { imageCompressor } from '@mbs-dev/react-image-compressor';
import * as piexifjs from 'piexifjs';
import { useS3Upload } from "next-s3-upload";
import Input from "../input/InputField";
import { mutateUpdate } from "../../../hooks/useMutateUpdate";

interface ImageData {
  id: number;
  label: string;
  altText?: string;
  caption?: string;
  original?: File;
  compressed?: File;
  withExif?: File;
  uploadedUrl?: string;
  uploading: boolean;
}

export interface MultipleFileInputRef {
  handleSaveImages: () => Promise<void>;
}

export default forwardRef<MultipleFileInputRef, {
  imageUploadLocation: { table: string; id: number };
  resetTrigger?: number;
  idFieldName?: string;
}>(function MultipleFileInputExample({
  imageUploadLocation,
  resetTrigger,
  idFieldName = 'page_id'
}, ref) {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: ''
  });

  const [images, setImages] = useState<ImageData[]>([
    { id: 1, label: "Image 1", altText: "", caption: "", uploading: false },
    { id: 2, label: "Image 2", altText: "", caption: "", uploading: false },
    { id: 3, label: "Image 3", altText: "", caption: "", uploading: false },
    { id: 4, label: "Image 4", altText: "", caption: "", uploading: false },
    { id: 5, label: "Image 5", altText: "", caption: "", uploading: false },
    { id: 6, label: "Image 6", altText: "", caption: "", uploading: false },
  ]);

  const { uploadToS3 } = useS3Upload();

  const handleSaveImages = useCallback(async () => {
    if (!imageUploadLocation.id) {
      console.error('No page ID provided for image upload');
      return;
    }

    // Filter images that have been uploaded
    const uploadedImages = images.filter(img => img.uploadedUrl);
    
    if (uploadedImages.length === 0) {
      console.log('No images to save');
      return;
    }

    const imagePayload = uploadedImages.map(img => ({
      url: img.uploadedUrl,
      alt_text: img.altText || null,
      caption: img.caption || null,
    }));

    console.log('Attempting to save images:', imagePayload);
    console.log('Image upload location:', imageUploadLocation);
    console.log('ID field name:', idFieldName);

    try {
      // Step 1: Create image entries
      const imageResponse = await mutateUpdate({
        path: "/image",
        method: "POST",
        payload: imagePayload,
        additionalHeaders: {
          Prefer: "return=representation",
        },
      });
      
      console.log("Image creation response:", imageResponse);
      
      if (imageResponse.error) {
        console.error("Error saving images:", imageResponse.error);
        throw new Error(`Failed to create images: ${imageResponse.error}`);
      }
      
      // Step 2: Create page_image relationships
      if (imageResponse.response && Array.isArray(imageResponse.response)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const relationshipPayload = imageResponse.response.map((img: any) => ({
          [idFieldName]: imageUploadLocation.id,
          image_id: img.id,
        }));

        console.log('Creating page-image relationships:', relationshipPayload);

        const relationshipResponse = await mutateUpdate({
          path: imageUploadLocation.table,
          method: "POST",
          payload: relationshipPayload,
        });
        
        console.log("Relationship creation response:", relationshipResponse);
        
        if (relationshipResponse.error) {
          console.error("Error creating relationships:", relationshipResponse.error);
          throw new Error(`Failed to create page-image relationships: ${relationshipResponse.error}`);
        }
        
        console.log('✅ Successfully created images and relationships');
      } else {
        console.error('Unexpected image response format:', imageResponse.response);
        throw new Error('Invalid response format from image creation');
      }
    } catch (error) {
      console.error('Complete image save operation failed:', error);
      // Re-throw to let parent components handle the error
      throw error;
    }
  }, [images, imageUploadLocation, idFieldName]);

  useImperativeHandle(ref, () => ({
    handleSaveImages
  }), [handleSaveImages]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Function to convert image to JPEG if needed
  const convertToJpeg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement("img");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const jpegFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg'
            });
            resolve(jpegFile);
          } else {
            reject(new Error('Failed to convert image to JPEG'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  // Function to add EXIF geolocation data
  const addGeolocationExif = async (file: File, latitude: number, longitude: number): Promise<File> => {
    const jpegFile = await convertToJpeg(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          let binary = '';
          const chunkSize = 8192;

          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(chunk));
          }

          const base64 = btoa(binary);
          const dataUrl = `data:image/jpeg;base64,${base64}`;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const gpsIfd: Record<number | string, any> = {};
          gpsIfd[piexifjs.GPSIFD.GPSLatitude] = piexifjs.GPSHelper.degToDmsRational(Math.abs(latitude));
          gpsIfd[piexifjs.GPSIFD.GPSLatitudeRef] = latitude >= 0 ? 'N' : 'S';
          gpsIfd[piexifjs.GPSIFD.GPSLongitude] = piexifjs.GPSHelper.degToDmsRational(Math.abs(longitude));
          gpsIfd[piexifjs.GPSIFD.GPSLongitudeRef] = longitude >= 0 ? 'E' : 'W';

          const exifDict = {
            'GPS': gpsIfd,
            '0th': {},
            'Exif': {},
            '1st': {},
            'thumbnail': undefined
          };

          const exifBytes = piexifjs.dump(exifDict);
          const newDataUrl = piexifjs.insert(exifBytes, dataUrl);

          fetch(newDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const newFile = new File([blob], jpegFile.name, { type: 'image/jpeg' });
              resolve(newFile);
            })
            .catch(error => reject(error));
        } catch (error) {
          console.error('Error in addGeolocationExif:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(jpegFile);
    });
  };

  // Function to compress image progressively until under target size
  const compressImageUnder1MB = async (file: File): Promise<File> => {
    const targetSize = 500 * 1024; // 500KB in bytes
    const exifOverhead = 50 * 1024; // Reserve ~50KB for EXIF data
    const compressionTarget = targetSize - exifOverhead;

    let quality = 0.8;
    let compressed: File = await imageCompressor(file, quality) as File;

    if (compressed.size <= compressionTarget) {
      return compressed;
    }

    while (compressed.size > compressionTarget && quality > 0.1) {
      const sizeRatio = compressed.size / compressionTarget;
      const qualityStep = sizeRatio > 2 ? 0.2 : 0.1;

      quality = Math.max(0.1, quality - qualityStep);
      compressed = await imageCompressor(file, quality) as File;
    }

    return compressed;
  };

  const handleFileChange = async (imageId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Update uploading state
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, uploading: true, original: file } : img
    ));

    try {
      // Compress the image
      const compressed = await compressImageUnder1MB(file);

      // Add geolocation EXIF data
      const latitude = formData.latitude ? parseFloat(formData.latitude) : 34.0522; // Default to LA
      const longitude = formData.longitude ? parseFloat(formData.longitude) : -118.2437; // Default to LA
      const fileWithGeo = await addGeolocationExif(compressed, latitude, longitude);

      // Upload to S3
      const { url } = await uploadToS3(fileWithGeo);

      // Update image data
      setImages(prev => prev.map(img =>
        img.id === imageId ? {
          ...img,
          compressed,
          withExif: fileWithGeo,
          uploadedUrl: url,
          uploading: false
        } : img
      ));

      console.log(`Image ${imageId} processed and uploaded successfully to:`, url);
    } catch (error) {
      console.error(`Error processing image ${imageId}:`, error);
      // Reset uploading state on error
      setImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, uploading: false } : img
      ));
    }
  };

  useEffect(() => {
    if (resetTrigger) {
      // Reset all state when resetTrigger changes
      setFormData({
        latitude: '',
        longitude: ''
      });
      setImages([
        { id: 1, label: "Image 1", uploading: false },
        { id: 2, label: "Image 2", uploading: false },
        { id: 3, label: "Image 3", uploading: false },
        { id: 4, label: "Image 4", uploading: false },
        { id: 5, label: "Image 5", uploading: false },
        { id: 6, label: "Image 6", uploading: false },
      ]);
    }
  }, [resetTrigger]);

  const handleImageInfoChange = (field: string, value: string, index: number) => {
    setImages(prev => prev.map((img, i) => {
      if (i === index) {
        return { ...img, [field]: value };
      }
      return img;
    }));
  };

  return (
    <ComponentCard title="Multiple Image Upload">
      <div className="space-y-6">
        {/* GPS Coordinates Input */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div>
            <Label>Latitude</Label>
            <Input
              type="text"
              name="latitude"
              placeholder="ex. 34.0522"
              value={formData.latitude}
              onChange={(e) => handleInputChange("latitude", e.target.value)}
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              type="text"
              name="longitude"
              placeholder="ex. -118.2437"
              value={formData.longitude}
              onChange={(e) => handleInputChange("longitude", e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {images.map((image, index) => (
            <div key={image.id} className="border rounded-lg p-4 space-y-3">
              <div>
                <div>
                  <Label>Alt-Text</Label>
                  <Input
                    type="text"
                    name="altText"
                    placeholder="ex. Beautiful sunset"
                    value={images[index].altText || ""}
                    onChange={(e) => handleImageInfoChange("altText", e.target.value, index)}
                  />
                </div>
                <div>
                  <Label>Caption</Label>
                  <Input
                    type="text"
                    name="caption"
                    placeholder="ex. A beautiful sunset"
                    value={images[index].caption || ""}
                    onChange={(e) => handleImageInfoChange("caption", e.target.value, index)}
                  />
                </div>
              </div>
              <FileInput
                onChange={(e) => handleFileChange(image.id, e)}
                className="custom-class"
              />

              {image.uploading && <p className="text-blue-500">Processing and uploading...</p>}

              {image.original && (
                <p className="text-sm">Original: {image.original.name} ({(image.original.size / 1024).toFixed(2)} KB)</p>
              )}

              {image.compressed && (
                <p className="text-sm">Compressed: ({(image.compressed.size / 1024).toFixed(2)} KB)</p>
              )}

              {image.withExif && (
                <p className="text-sm">With EXIF: ({(image.withExif.size / 1024).toFixed(2)} KB)</p>
              )}

              {image.uploadedUrl && (
                <div>
                  <p className="text-green-500 text-sm">✅ Uploaded successfully!</p>
                  <Image
                    src={image.uploadedUrl}
                    alt={`Uploaded ${image.label}`}
                    width={150}
                    height={150}
                    style={{ maxWidth: '150px', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ComponentCard>
  );
});
