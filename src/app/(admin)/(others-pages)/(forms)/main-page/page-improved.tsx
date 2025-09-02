"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import MultipleFileInputExample from "@/components/form/form-elements/MultipleFileInputExample";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import SeoMetadata from "@/components/form/form-elements/SeoMetadata";
import Alert from "@/components/ui/alert/Alert";
import PageOrganizer from "@/components/page-manager/PageOrganizer";
import PageCreationWizard from "@/components/page-manager/PageCreationWizard";
import EditorSection from "@/components/page-manager/EditorSection";

import { useSidebar } from "@/context/SidebarContext";
import { useFormValidation } from "@/hooks/useFormValidation";
import { usePageManager } from "@/hooks/usePageManager";
import { PageCreationData } from "@/types/page";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";

const DEFAULT_MARKDOWN = `
Enter Content Here,
Open ChatGPT and ask it to write down the content you want to add here.
Ex.
Give me content using SEO best practices. For company [Name] for the service []
`;

export default function FormMain() {
  // Context
  const { selectedClient } = useSidebar();
  
  // State
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<'organizer' | 'editor'>('organizer');
  
  // Refs
  const editorRef = useRef<MDXEditorMethods>(null);
  
  // Custom hooks
  const { formData, errors, handleInputChange, validateAllFields, resetForm, updateFormData } = useFormValidation();
  
  const { 
    selectedPage,
    seoData,
    content,
    imageUploadLocation,
    mainNavPages,
    servicePages,
    blogPosts,
    galleryPages,
    customPages,
    setContent,
    selectPage,
    savePage,
    resetPageState,
    createNewPage,
  } = usePageManager({
    websiteId: selectedClient?.website_id || null,
    onSuccess: handleSaveSuccess,
  });

  // Update form data when SEO data changes
  useEffect(() => {
    if (seoData) {
      updateFormData({
        seoTitle: seoData.meta_title || "",
        seoDescription: seoData.meta_description || "",
        seoKeywords: seoData.keywords || "",
        title: selectedPage?.title || "",
        slug: selectedPage?.slug || "",
      });
    }
  }, [seoData, selectedPage, updateFormData]);

  // Handler functions
  const handleCreatePage = useCallback(() => {
    setShowCreationWizard(true);
    setViewMode('editor');
  }, []);

  const handleCreatePageSubmit = useCallback(async (data: PageCreationData) => {
    const result = await createNewPage(data);
    if (result?.response) {
      setShowCreationWizard(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [createNewPage]);

  const handlePageSelect = useCallback((pageId: number) => {
    selectPage(pageId);
    setViewMode('editor');
  }, [selectPage]);

  function handleSaveSuccess() {
    resetForm();
    setContent("");
    setShowAlert(true);
    setResetTrigger(prev => prev + 1);
    
    if (editorRef.current) {
      editorRef.current.setMarkdown(DEFAULT_MARKDOWN);
    }
  }

  const handleGetMarkdown = useCallback(() => {
    setContent(editorRef.current?.getMarkdown() ?? "");
  }, [setContent]);

  const handleFocusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    handleInputChange("seoDescription", value);
  }, [handleInputChange]);

  const handleSavePage = useCallback(async () => {
    const isValid = validateAllFields();
    const isContentValid = content.trim().length > 0;
    
    if (isValid && isContentValid) {
      await savePage(formData, selectedClient?.website_id);
    } else {
      console.error("Form validation failed", errors);
    }
  }, [validateAllFields, content, savePage, formData, selectedClient?.website_id, errors]);

  const shouldShowSeoMetadata = showCreationWizard || !!seoData;
  const editorMarkdown = selectedPage?.content || DEFAULT_MARKDOWN;

  return (
    <div>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            variant="success"
            title="Success"
            message="Your changes have been saved."
            timeout={5000}
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}
      
      <PageBreadcrumb pageTitle="Page Manager" />
      
      {/* View Toggle */}
      <div className="mb-6 flex gap-4">
        <Button
          variant={viewMode === 'organizer' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('organizer')}
        >
          Page Organizer
        </Button>
        <Button
          variant={viewMode === 'editor' ? 'primary' : 'secondary'}
          onClick={() => setViewMode('editor')}
        >
          Page Editor
        </Button>
      </div>

      {viewMode === 'organizer' ? (
        <PageOrganizer
          mainNavPages={mainNavPages}
          servicePages={servicePages}
          blogPosts={blogPosts}
          galleryPages={galleryPages}
          customPages={customPages}
          onSelectPage={handlePageSelect}
          onCreatePage={handleCreatePage}
          selectedPageId={selectedPage?.id}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <ComponentCard title="Page Management">
              <div className="space-y-6">
                {showCreationWizard ? (
                  <PageCreationWizard
                    onCreatePage={handleCreatePageSubmit}
                    onCancel={() => {
                      setShowCreationWizard(false);
                      setViewMode('organizer');
                    }}
                  />
                ) : (
                  <>
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        onClick={handleCreatePage}
                      >
                        Create New Page
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setViewMode('organizer')}
                      >
                        Back to Organizer
                      </Button>
                    </div>
                    
                    {shouldShowSeoMetadata && (
                      <SeoMetadata 
                        formData={formData} 
                        handleInputChange={handleInputChange} 
                        errors={errors} 
                        handleDescriptionChange={handleDescriptionChange} 
                      />
                    )}
                  </>
                )}
              </div>
            </ComponentCard>
          </div>

          <div className="space-y-6">
            <ComponentCard title="Content Editor">
              {selectedPage ? (
                <div className="border rounded-lg overflow-hidden">
                  <EditorSection
                    editorRef={editorRef}
                    markdown={selectedPage.content || ""}
                    showControls={false}
                  />
                </div>
              ) : !showCreationWizard ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a page from the organizer or create a new page to start editing</p>
                </div>
              ) : (
                <>
                  <EditorSection
                    editorRef={editorRef}
                    markdown={editorMarkdown}
                    onGetMarkdown={handleGetMarkdown}
                    onFocusEditor={handleFocusEditor}
                  />
                  
                  <div className="space-y-6 mt-6">
                    <MultipleFileInputExample
                      imageUploadLocation={imageUploadLocation}
                      resetTrigger={resetTrigger}
                      idFieldName="page_id"
                    />
                  </div>
                </>
              )}
            </ComponentCard>

            {(selectedPage || showCreationWizard) && !showCreationWizard && (
              <Button 
                size="sm" 
                className="bg-green-500" 
                onClick={handleSavePage} 
                disabled={selectedClient?.id === 0}
              >
                Save Page
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
