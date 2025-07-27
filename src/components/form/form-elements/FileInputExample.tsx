"use client";
import React, { useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";
import {  imageCompressor } from '@mbs-dev/react-image-compressor';
// import * as EXIF from 'exifr';
import * as piexifjs from 'piexifjs';


export default function FileInputExample() {
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [compressedFile, setCompressedFile] = useState<File | undefined>();
  const [fileWithExif, setFileWithExif] = useState<File | undefined>();

  // Function to convert image to JPEG if needed
  const convertToJpeg = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

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
    // First, ensure the file is JPEG
    const jpegFile = await convertToJpeg(file);
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          
          // Convert ArrayBuffer to base64 more efficiently
          const uint8Array = new Uint8Array(arrayBuffer);
          let binary = '';
          const chunkSize = 8192; // Process in chunks to avoid stack overflow
          
          for (let i = 0; i < uint8Array.length; i += chunkSize) {
            const chunk = uint8Array.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, Array.from(chunk));
          }
          
          const base64 = btoa(binary);
          const dataUrl = `data:image/jpeg;base64,${base64}`;
          
          // Create EXIF data with GPS coordinates
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
          
          // Convert back to File
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      setImageFile(file);
      
      // Compress the image
      const quality = 0.8;
      try {
        const compressed = await imageCompressor(file, quality);
        setCompressedFile(compressed as File);
        
        // Add geolocation EXIF data (example coordinates: New York City)
        const latitude = 40.7128;
        const longitude = -74.0060;
        const fileWithGeo = await addGeolocationExif(compressed as File, latitude, longitude);
        setFileWithExif(fileWithGeo);
        
        // Optional: Create FormData with compressed image
        const formData = new FormData();
        const imagefileFieldName = 'photo';
        formData.append(imagefileFieldName, fileWithGeo);
        
        console.log("Image compressed and EXIF data added successfully");
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };

  return (
    <ComponentCard title="File Input">
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className="custom-class" />
        {imageFile && <p>Original file: {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)</p>}
        {compressedFile && <p>Compressed file: {compressedFile.name} ({(compressedFile.size / 1024).toFixed(2)} KB)</p>}
        {fileWithExif && <p>File with EXIF: {fileWithExif.name} ({(fileWithExif.size / 1024).toFixed(2)} KB)</p>}
      </div>
    </ComponentCard>
  );
}
