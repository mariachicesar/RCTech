export interface Page {
  content: string | null;
  created_at: string | null;
  id: number;
  slug: string | null;
  title: string | null;
  type: string | null;
  website_id: number | null;
}

export interface FormData {
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  title: string;
  slug: string;
  altText?: string; // Optional for image metadata
  caption?: string; // Optional for image metadata
}

export interface FormErrors {
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  title: string;
  slug: string;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface ImageUploadLocation {
  table: string;
  id: number;
  idFieldName?: string; // Optional, used for specific cases like page images
}
