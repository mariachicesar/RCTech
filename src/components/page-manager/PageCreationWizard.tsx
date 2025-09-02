import React, { useState } from 'react';
import { PageType, TemplateType, PageCreationData } from '@/types/page';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';

interface PageCreationWizardProps {
  onCreatePage: (data: PageCreationData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const pageTypeOptions = [
  { value: 'main-page', label: 'Main Navigation Page' },
  { value: 'service', label: 'Service Page' },
  { value: 'blog-post', label: 'Blog Post' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'legal', label: 'Legal Page' },
  { value: 'custom', label: 'Custom Page' },
];

const templateTypeOptions: Record<PageType, { value: TemplateType; label: string }[]> = {
  'main-page': [
    { value: 'home', label: 'Homepage Template' },
    { value: 'standard', label: 'Standard Page' },
    { value: 'contact', label: 'Contact Page' },
  ],
  'service': [
    { value: 'service', label: 'Service Template' },
    { value: 'standard', label: 'Standard Template' },
  ],
  'blog-post': [
    { value: 'blog-post', label: 'Blog Post Template' },
  ],
  'blog-category': [
    { value: 'blog-list', label: 'Blog List Template' },
  ],
  'gallery': [
    { value: 'gallery', label: 'Gallery Template' },
  ],
  'landing': [
    { value: 'landing', label: 'Landing Page Template' },
  ],
  'legal': [
    { value: 'standard', label: 'Standard Template' },
  ],
  'custom': [
    { value: 'standard', label: 'Standard Template' },
  ],
};

const PageCreationWizard: React.FC<PageCreationWizardProps> = ({
  onCreatePage,
  onCancel,
  isLoading = false,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<PageCreationData>>({
    page_type: 'main-page',
    template_type: 'standard',
    is_main_nav: false,
  });

  const handleInputChange = (field: keyof PageCreationData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePageTypeChange = (pageType: PageType) => {
    const defaultTemplate = templateTypeOptions[pageType][0]?.value || 'standard';
    setFormData(prev => ({
      ...prev,
      page_type: pageType,
      template_type: defaultTemplate,
      is_main_nav: pageType === 'main-page',
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const canProceedToStep2 = formData.page_type && formData.template_type;
  const canSubmit = formData.title && formData.slug && canProceedToStep2;

  const handleSubmit = () => {
    if (canSubmit && formData.page_type && formData.template_type && formData.title && formData.slug) {
      onCreatePage({
        page_type: formData.page_type,
        template_type: formData.template_type,
        title: formData.title,
        slug: formData.slug,
        parent_id: formData.parent_id || null,
        is_main_nav: formData.is_main_nav || false,
        meta_description: formData.meta_description,
        meta_keywords: formData.meta_keywords,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Create New Page</h3>
        <div className="flex gap-2">
          <span className={`text-sm px-2 py-1 rounded ${step === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
            1. Type & Template
          </span>
          <span className={`text-sm px-2 py-1 rounded ${step === 2 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
            2. Page Details
          </span>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>Page Type</Label>
            <Select
              options={pageTypeOptions}
              defaultValue={formData.page_type || ''}
              onChange={(value) => handlePageTypeChange(value as PageType)}
              placeholder="Select page type"
            />
            <p className="text-sm text-gray-500 mt-1">
              Choose the type of page based on its purpose and content
            </p>
          </div>

          {formData.page_type && (
            <div>
              <Label>Template</Label>
              <Select
                options={templateTypeOptions[formData.page_type]}
                defaultValue={formData.template_type || ''}
                onChange={(value) => handleInputChange('template_type', value as TemplateType)}
                placeholder="Select template"
              />
              <p className="text-sm text-gray-500 mt-1">
                Choose the layout template for this page
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={() => setStep(2)} 
              disabled={!canProceedToStep2}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>Page Title</Label>
            <Input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          <div>
            <Label>URL Slug</Label>
            <Input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="page-url-slug"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL-friendly version of the title (lowercase, hyphens instead of spaces)
            </p>
          </div>

          {formData.page_type !== 'main-page' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mainNav"
                checked={formData.is_main_nav || false}
                onChange={(e) => handleInputChange('is_main_nav', e.target.checked)}
              />
              <Label htmlFor="mainNav">Show in main navigation</Label>
            </div>
          )}

          <div>
            <Label>Meta Description (SEO)</Label>
            <TextArea
              value={formData.meta_description || ''}
              onChange={(value) => handleInputChange('meta_description', value)}
              placeholder="Brief description for search engines (150-160 characters)"
              rows={3}
            />
          </div>

          <div>
            <Label>Meta Keywords (SEO)</Label>
            <Input
              type="text"
              value={formData.meta_keywords || ''}
              onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!canSubmit || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageCreationWizard;
