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
  const editorRef = useRef<MDXEditorMethods>(null);

  const handleGetMarkdown = () => {
    console.log(editorRef.current?.getMarkdown());
  };
  const handleFocusEditor = () => {
    editorRef.current?.focus();
  };

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
              <Button size="sm" className={`${newPage ? "bg-red-500" : "bg-blue-500"}`} onClick={() => setNewPage(!newPage)}>
                {newPage ? "Cancel" : "New Page"}
              </Button>
              {newPage && (
                <Button size="sm" className="ml-2 bg-green-500" onClick={() => setNewPage(false)}>
                  Save Page
                </Button>
              )}
              {newPage && (
                <>
                  <div>
                    <Label>Url</Label>
                    <Input type="text" name="url" placeholder="ex. car-wrap" />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input type="text" name="title" placeholder="ex. Car Wrap " />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input type="text" name="description" placeholder="ex. Car Wrap is a service that..." />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input type="text" name="slug" placeholder="ex. car-wrap" />
                  </div>
                  <div>
                    <Label>Keywords</Label>
                    <Input type="text" name="keywords" placeholder="ex. car, wrap, service" />
                  </div>
</>
              )}
              <div>
                <Label>Select Input</Label>
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
      </div>
    </div>
  );
}
