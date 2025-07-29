import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { type MDXEditorMethods } from "@mdxeditor/editor";

const Editor = dynamic(() => import("@/components/mdxEditor/Editor"), {
  ssr: false,
});

interface EditorSectionProps {
  editorRef: React.RefObject<MDXEditorMethods | null>;
  markdown: string;
  onGetMarkdown?: () => void;
  onFocusEditor?: () => void;
  showControls?: boolean;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  editorRef,
  markdown,
  onGetMarkdown,
  onFocusEditor,
  showControls = true,
}) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="border rounded-lg overflow-hidden">
        <Suspense fallback={null}>
          <Editor editorRef={editorRef} markdown={markdown} />
        </Suspense>
      </div>
      {showControls && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onGetMarkdown}
            className="rounded bg-purple-500 px-3 py-2 text-sm text-white hover:bg-purple-600"
          >
            Get Markdown
          </button>
          <button
            onClick={onFocusEditor}
            className="rounded bg-gray-500 px-3 py-2 text-sm text-white hover:bg-gray-600"
          >
            Focus Editor
          </button>
        </div>
      )}
    </div>
  );
};

export default EditorSection;
