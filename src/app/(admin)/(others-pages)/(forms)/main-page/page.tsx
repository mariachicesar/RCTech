"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import MultipleFileInputExample from "@/components/form/form-elements/MultipleFileInputExample";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import SeoMetadata from "@/components/form/form-elements/SeoMetadata";
import Alert from "@/components/ui/alert/Alert";
import PageSelector from "@/components/page-manager/PageSelector";
import EditorSection from "@/components/page-manager/EditorSection";

import { useSidebar } from "@/context/SidebarContext";
import { useFormValidation } from "@/hooks/useFormValidation";
import { usePageManager } from "@/hooks/usePageManager";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";

const DEFAULT_MARKDOWN = `
Enter Content Here,
Open ChatGPT and ask it to write down the content you want to add here.
Ex.
Give me content using SEO best practices. For company [Name] for the service []
`;

export default function FormMain() {
  // Context
  const { user } = useSidebar();
  
  // State
  const [newPage, setNewPage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // Refs
  const editorRef = useRef<MDXEditorMethods>(null);
  
  // Custom hooks
  const { formData, errors, handleInputChange, validateAllFields, resetForm, updateFormData } = useFormValidation();
  
  const { 
    pages, 
    selectedPage, 
    seoData, 
    content, 
    imageUploadLocation, 
    setContent, 
    selectPage, 
    savePage, 
    resetPageState 
  } = usePageManager({
    websiteId: user?.website_id || null,
    onSuccess: handleSaveSuccess,
  });

  // Update form data when SEO data changes
  useEffect(() => {
    if (seoData) {
      updateFormData({
        seoTitle: seoData.meta_title || "",
        seoKeywords: seoData.keywords || "",
        seoDescription: seoData.meta_description || "",
        title: selectedPage?.title || "",
        slug: selectedPage?.slug || "",
      });
    }
  }, [seoData, selectedPage, updateFormData]);

  // Handlers
  const handleGetMarkdown = useCallback(() => {
    setContent(editorRef.current?.getMarkdown() ?? "");
  }, [setContent]);

  const handleFocusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, []);

  const handleToggleNewPage = useCallback(() => {
    setNewPage(!newPage);
    if (newPage) {
      resetForm();
      resetPageState();
    }
  }, [newPage, resetForm, resetPageState]);

  const handleDescriptionChange = useCallback((value: string) => {
    handleInputChange("seoDescription", value);
  }, [handleInputChange]);

  function handleSaveSuccess() {
    resetForm();
    setContent("");
    setNewPage(false);
    setShowAlert(true);
    setResetTrigger(prev => prev + 1);
    
    if (editorRef.current) {
      editorRef.current.setMarkdown(DEFAULT_MARKDOWN);
    }
  }

  const handleSavePage = useCallback(async () => {
    const isValid = validateAllFields();
    const isContentValid = content.trim().length > 0;
    
    if (isValid && isContentValid) {
      await savePage(formData, user?.website_id);
    } else {
      console.error("Form validation failed", errors);
    }
  }, [validateAllFields, content, savePage, formData, errors]);

  const shouldShowSeoMetadata = newPage || !!seoData;
  const editorMarkdown = selectedPage?.content || DEFAULT_MARKDOWN;

  return (
    <div>
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            variant="success"
            title="Insert was successful"
            message="Your changes have been saved."
            timeout={5000}
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}
      
      <PageBreadcrumb pageTitle="Main Forms" />
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ComponentCard title="Page Info">
            <div className="space-y-6">
              <Button
                size="sm"
                className={`${newPage ? "bg-red-500" : "bg-blue-500"}`}
                onClick={handleToggleNewPage}
              >
                {newPage ? "Cancel" : "New Page"}
              </Button>
              
              <PageSelector
                pages={pages}
                onPageSelect={selectPage}
                disabled={newPage}
              />
              
              {shouldShowSeoMetadata && (
                <SeoMetadata 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  errors={errors} 
                  handleDescriptionChange={handleDescriptionChange} 
                />
              )}
            </div>
          </ComponentCard>
        </div>

        {selectedPage ? (
          <div className="border rounded-lg overflow-hidden">
            <EditorSection
              editorRef={editorRef}
              markdown={selectedPage.content || ""}
              showControls={false}
            />
          </div>
        ) : (
          <>
            <EditorSection
              editorRef={editorRef}
              markdown={editorMarkdown}
              onGetMarkdown={handleGetMarkdown}
              onFocusEditor={handleFocusEditor}
            />
            
            <div className="space-y-6">
              <MultipleFileInputExample
                imageUploadLocation={imageUploadLocation}
                resetTrigger={resetTrigger}
              />
            </div>
          </>
        )}
        
        {newPage && (
          <Button 
            size="sm" 
            className="bg-green-500" 
            onClick={handleSavePage} 
            disabled={user?.id === 0}
          >
            Save Page
          </Button>
        )}
      </div>
    </div>
  );
}

