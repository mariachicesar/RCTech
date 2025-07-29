import { useState, useCallback } from 'react';
import { Page, FormData, ImageUploadLocation } from '@/types/page';
import { mutateUpdate } from '@/hooks/useMutateUpdate';
import { useGetPages } from '@/hooks/usePages';
import { useGetSeo } from '@/hooks/useSeo';

interface UsePageManagerProps {
  websiteId: number | null;
  onSuccess?: () => void;
}

export const usePageManager = ({ websiteId, onSuccess }: UsePageManagerProps) => {
  const [selectedPage, setSelectedPage] = useState<Page | undefined>(undefined);
  const [content, setContent] = useState("");
  const [imageUploadLocation, setImageUploadLocation] = useState<ImageUploadLocation>({ table: "", id: 0 });

  const { pages } = useGetPages(websiteId);
  const { seoData } = useGetSeo(selectedPage?.id || null);

  const selectPage = useCallback((pageId: number) => {
    const page = pages.find((p) => p.id === pageId);
    setSelectedPage(page);
  }, [pages]);

  const savePage = useCallback(async (formData: FormData, websiteId?: number | null ) => {
    if (!websiteId) return null;

    const pagePayload = {
      title: formData.title,
      slug: formData.slug,
      content: content,
      website_id: websiteId,
    };

    const result = await mutateUpdate({
      path: "/page",
      method: "POST",
      payload: pagePayload,
      additionalHeaders: {
        Prefer: "return=representation",
      },
    });

    if (result) {
      const pageId = (result.response as { id: number }[])[0].id;
      
      await mutateUpdate({
        path: "/seo_metadata",
        method: "POST",
        payload: {
          meta_title: formData.seoTitle,
          meta_description: formData.seoDescription,
          keywords: formData.seoKeywords,
          page_id: pageId,
        },
      });

      setImageUploadLocation({
        table: "/page_image",
        id: pageId,
      });

      onSuccess?.();
      return pageId;
    }

    return null;
  }, [content, websiteId, onSuccess]);

  const resetPageState = useCallback(() => {
    setContent("");
    setSelectedPage(undefined);
    setImageUploadLocation({ table: "", id: 0 });
  }, []);

  return {
    pages,
    selectedPage,
    seoData,
    content,
    imageUploadLocation,
    setContent,
    selectPage,
    savePage,
    resetPageState,
  };
};
