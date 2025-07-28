import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import Label from "../Label";

interface SeoMetadataProps {
    formData: {
        seoTitle: string;
        seoKeywords: string;
        seoDescription: string;
        title: string;
        slug: string;
    };
    handleInputChange: (name: string, value: string) => void;
    errors: {
        seoTitle: string;
        seoKeywords: string;
        seoDescription: string;
        title: string;
        slug: string;
    };
    handleDescriptionChange: (value: string) => void;
}

const SeoMetadata = ({ formData, handleInputChange, errors, handleDescriptionChange }: SeoMetadataProps): React.ReactNode =>{
  return <form className="flex flex-col">
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <div>
        <Label>Seo-Title</Label>
        <Input
          type="text"
          name="seo-title"
          placeholder="ex. Car Wrap "
          required={true}
          value={formData.seoTitle}
          onChange={(e) => handleInputChange("seoTitle", e.target.value)}
          className={errors.seoTitle ? "border-red-500" : ""} />
        {errors.seoTitle && <p className="text-red-500 text-sm mt-1">{errors.seoTitle}</p>}
      </div>
      <div>
        <Label>Seo-Keywords</Label>
        <Input
          type="text"
          name="seo-keywords"
          placeholder="ex. car, wrap, service"
          required={true}
          value={formData.seoKeywords}
          onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
          className={errors.seoKeywords ? "border-red-500" : ""} />
        {errors.seoKeywords && <p className="text-red-500 text-sm mt-1">{errors.seoKeywords}</p>}
      </div>
      {/* Default TextArea */}
      <div>
        <Label>Seo-Description</Label>
        <TextArea
          value={formData.seoDescription}
          onChange={handleDescriptionChange}
          rows={6}
          required={true}
          className={errors.seoDescription ? "border-red-500" : ""} />
        {errors.seoDescription && <p className="text-red-500 text-sm mt-1">{errors.seoDescription}</p>}
      </div>
    </div>
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
      <div>
        <Label>Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="ex. Car Wrap"
          required={true}
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={errors.title ? "border-red-500" : ""} />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          type="text"
          name="slug"
          placeholder="ex. car-wrap"
          required={true}
          value={formData.slug}
          onChange={(e) => handleInputChange("slug", e.target.value)}
          className={errors.slug ? "border-red-500" : ""} />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>
    </div>
  </form>;
}

export default SeoMetadata;
