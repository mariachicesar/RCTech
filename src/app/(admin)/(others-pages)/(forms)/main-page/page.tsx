"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import dynamic from "next/dynamic";
import React, { Suspense, useRef, useState } from "react";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import Label from "../../../../../components/form/Label";
import Select from "../../../../../components/form/Select";
import ComponentCard from "../../../../../components/common/ComponentCard";
import { ChevronDownIcon } from "../../../../../icons";
import Input from "../../../../../components/form/input/InputField";
import Button from "../../../../../components/ui/button/Button";
import TextArea from "../../../../../components/form/input/TextArea";

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
  //State
  const [newPage, setNewPage] = useState(false);
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

  const handleSavePage = () => {
    const keys = Object.keys(formData) as Array<keyof typeof formData>;
    const isValid = keys.every((key) => validateField(key, formData[key]));
    if (isValid) {
      // Save logic here
      console.log("Page saved successfully", formData, content);
    } else {
      console.error("Form validation failed", errors);
    }
  }

  const options = [
    { value: "marketing", label: "Marketing" },
    { value: "template", label: "Template" },
    { value: "development", label: "Development" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <div>
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
              {newPage && (
                <form className="flex flex-col">
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
                        className={errors.seoTitle ? "border-red-500" : ""}
                      />
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
                        className={errors.seoKeywords ? "border-red-500" : ""}
                      />
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
                        className={errors.seoDescription ? "border-red-500" : ""}
                      />
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
                        className={errors.title ? "border-red-500" : ""}
                      />
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
                        className={errors.slug ? "border-red-500" : ""}
                      />
                      {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
                    </div>
                  </div>
                </form>
              )}
              <div>
                <Label>Select Input & Edit</Label>
                <div className="relative">
                  <Select
                    options={options}
                    placeholder="Select Option"
                    onChange={handleSelectChange}
                    className="dark:bg-dark-900"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>
          </ComponentCard>
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
        </div>
        <div className="space-y-6">
          <FileInputExample />
          <DropzoneComponent />
        </div>
        {newPage && (
          <Button size="sm" className="bg-green-500" onClick={handleSavePage}>
            Save Page
          </Button>
        )}
      </div>
    </div>
  );
}
