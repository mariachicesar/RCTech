"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MultipleFileInputExample from "@/components/form/form-elements/MultipleFileInputExample";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import Label from "../../../../../components/form/Label";
import Select from "../../../../../components/form/Select";
import ComponentCard from "../../../../../components/common/ComponentCard";
import { ChevronDownIcon } from "../../../../../icons";
import Button from "../../../../../components/ui/button/Button";
import SeoMetadata from "../../../../../components/form/form-elements/SeoMetadata";
import { useSidebar } from "../../../../../context/SidebarContext";
import { mutateUpdate } from "../../../../../hooks/useMutateUpdate";
import Alert from "../../../../../components/ui/alert/Alert";
import { useGetPages } from "../../../../../hooks/usePages";
import { useGetSeo } from "../../../../../hooks/useSeo";

const Editor = dynamic(() => import("@/components/mdxEditor/Editor"), {
  ssr: false,
});

const markdown = `
Enter Content Here,
Open ChatGPT and ask it to write down the content you want to add here.
Ex.
Give me content using SEO best practices. For company [Name] for the service []
`;

export default function FormMain() {
  //Context
  const { user } = useSidebar();
  //State
  const [newPage, setNewPage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
    title: "",
    slug: "",
  });
  const [errors, setErrors] = useState({
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
    title: "",
    slug: "",
  });
  const [content, setContent] = useState("");
  const [imageUploadLocation, setImageUploadLocation] = useState<{ table: string; id: number }>({ table: "", id: 0 });
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedPage, setSelectedPage] = useState<
    | {
      content: string | null;
      created_at: string | null;
      id: number;
      slug: string | null;
      title: string | null;
      type: string | null;
      website_id: number | null;
    }
    | undefined
  >(undefined);

  //Hooks
  const { pages } = useGetPages(user?.website_id || null);
  const { seoData } = useGetSeo(selectedPage?.id || null);


  useEffect(() => {
    setFormData({
      seoTitle: seoData?.meta_title || "",
      seoKeywords: seoData?.keywords || "",
      seoDescription: seoData?.meta_description || "",
      title: selectedPage?.title || "",
      slug: selectedPage?.slug || "",
    });
    console.log("SEO Data updated:", seoData);
  }, [seoData]);

  const editorRef = useRef<MDXEditorMethods>(null);

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "seoTitle":
        if (!value.trim()) error = "SEO Title is required";
        else if (value.length < 10) error = "SEO Title must be at least 10 characters";
        else if (value.length > 60) error = "SEO Title must be less than 60 characters";
        break;
      case "seoKeywords":
        if (!value.trim()) error = "SEO Keywords are required";
        else if (value.split(",").length < 3) error = "At least 3 keywords required (comma separated)";
        break;
      case "seoDescription":
        if (!value.trim()) error = "SEO Description is required";
        else if (value.length < 120) error = "SEO Description must be at least 120 characters";
        else if (value.length > 160) error = "SEO Description must be less than 160 characters";
        break;
      case "title":
        if (!value.trim()) error = "Title is required";
        else if (value.length < 60) error = "Title must be at least 60 characters";
        break;
      case "slug":
        if (!value.trim()) error = "Slug is required";
        else if (!/^[a-z0-9-]+$/.test(value)) error = "Slug must contain only lowercase letters, numbers, and hyphens";
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, seoDescription: value }));
    validateField("seoDescription", value);
  };

  const handleGetMarkdown = () => {
    setContent(editorRef.current?.getMarkdown() ?? "");
  };
  const handleFocusEditor = () => {
    editorRef.current?.focus();
  };


  const handleSavePage = async () => {
    const keys = Object.keys(formData) as Array<keyof typeof formData>;
    const isValid = keys.every((key) => validateField(key, formData[key]));
    const isContentValid = content.trim().length > 0;
    if (isValid && isContentValid) {
      const pagePayload = {
        title: formData.title,
        slug: formData.slug,
        content: content,
        website_id: user?.website_id,
      }
      const result = await mutateUpdate({
        path: "/page",
        method: "POST",
        payload: pagePayload,
        additionalHeaders: {
          Prefer: "return=representation",
        },
      })
      if (result) {
        const pageId = (result.response as { id: number }[])[0].id;
        mutateUpdate({
          path: "/seo_metadata",
          method: "POST",
          payload: {
            meta_title: formData.seoTitle,
            meta_description: formData.seoDescription,
            keywords: formData.seoKeywords,
            page_id: pageId,
          },
        })
        setImageUploadLocation({
          table: "/page_image",
          id: pageId,
        })

        // Clear all state and show success alert
        setFormData({
          seoTitle: "",
          seoKeywords: "",
          seoDescription: "",
          title: "",
          slug: "",
        });
        setContent("");
        setNewPage(false);
        setShowAlert(true);
        setResetTrigger(prev => prev + 1); // Trigger reset

        // Reset editor content
        if (editorRef.current) {
          editorRef.current.setMarkdown(markdown);
        }
      }


    } else {
      console.error("Form validation failed", errors);
    }
  }

  const pagesOptions = pages.map((page) => ({
    value: page.id,
    label: page.slug || "",
  }));

  const handleSelectChange = (value: string | number) => {
    setSelectedPage(pages.find((page) => page.id === Number(value)))

  };

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
                onClick={() => setNewPage(!newPage)}
              >
                {newPage ? "Cancel" : "New Page"}
              </Button>
              <div className={`${!newPage ? "" : "hidden"}`}>
                <Label>Select Input & Edit</Label>
                <div className="relative">
                  <Select
                    options={pagesOptions}
                    placeholder="Select Option"
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
              {newPage && (
                <SeoMetadata formData={formData} handleInputChange={handleInputChange} errors={errors} handleDescriptionChange={handleDescriptionChange} />
              )}
              {seoData && (
                <SeoMetadata formData={formData} handleInputChange={handleInputChange} errors={errors} handleDescriptionChange={handleDescriptionChange} />
              )}
            </div>
          </ComponentCard>
        </div>
        {selectedPage ? <div className="border rounded-lg overflow-hidden">
          <Suspense fallback={null}>
            <Editor editorRef={editorRef} markdown={selectedPage.content || ""} />
          </Suspense>
        </div> : (
          <>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="border rounded-lg overflow-hidden">
                <Suspense fallback={null}>
                  <Editor editorRef={editorRef} markdown={markdown} />
                </Suspense>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={handleGetMarkdown}
                  className="rounded bg-purple-500 px-3 py-2 text-sm text-white hover:bg-purple-600"
                >
                  Get Markdown
                </button>
                <button
                  onClick={handleFocusEditor}
                  className="rounded bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
                >
                  Focus Editor
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <MultipleFileInputExample
                imageUploadLocation={imageUploadLocation}
                resetTrigger={resetTrigger}
              />
            </div>
          </>
        )}
        {newPage && (
          <Button size="sm" className="bg-green-500" onClick={handleSavePage} disabled={user?.id === 0}>
            Save Page
          </Button>
        )}
      </div>
    </div>
  );
}

