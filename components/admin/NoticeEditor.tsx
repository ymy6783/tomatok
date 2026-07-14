"use client";

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import type { Editor } from "@tiptap/react";

type Props = {
  onChange: (html: string, text: string) => void;
  initialHtml?: string;
  placeholder?: string;
  uploadImage?: (file: File) => Promise<string>;
};

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-[10px] px-2.5 py-1.5 text-sm transition ${
        active
          ? "bg-[var(--foreground)] text-white"
          : "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function NoticeEditor({
  onChange,
  initialHtml = "",
  placeholder = "본문을 작성하세요.",
  uploadImage,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const uploadRef = useRef(uploadImage);
  uploadRef.current = uploadImage;

  async function insertImageFile(file: File) {
    const ed = editorRef.current;
    if (!ed) return;
    try {
      let src: string;
      if (uploadRef.current) {
        try {
          src = await uploadRef.current(file);
        } catch {
          src = await fileToDataUrl(file);
        }
      } else {
        src = await fileToDataUrl(file);
      }
      ed.chain().focus().setImage({ src }).run();
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "이미지 첨부에 실패했습니다."
      );
    }
  }

  const insertRef = useRef(insertImageFile);
  insertRef.current = insertImageFile;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({ allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "notice-editor min-h-[320px] px-4 py-3 outline-none text-[var(--foreground)] leading-relaxed",
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files;
        if (!files?.length) return false;
        const file = files[0];
        if (!file.type.startsWith("image/")) return false;
        event.preventDefault();
        void insertRef.current(file);
        return true;
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of items) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              void insertRef.current(file);
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML(), ed.getText());
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  if (!editor) {
    return (
      <div className="min-h-[360px] rounded-[10px] border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-[var(--muted)]">
        에디터 로딩…
      </div>
    );
  }

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--card)] focus-within:border-[var(--foreground)]">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void insertRef.current(file);
        }}
      />
      <div className="flex flex-wrap gap-0.5 border-b border-[var(--line)] px-2 py-1.5">
        <ToolbarButton
          title="굵게"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton
          title="기울임"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton
          title="밑줄"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          title="제목 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="제목 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          title="글머리 목록"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • 목록
        </ToolbarButton>
        <ToolbarButton
          title="번호 목록"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. 목록
        </ToolbarButton>
        <ToolbarButton
          title="인용"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          “ ”
        </ToolbarButton>
        <ToolbarButton
          title="구분선"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </ToolbarButton>
        <ToolbarButton title="링크" active={editor.isActive("link")} onClick={setLink}>
          링크
        </ToolbarButton>
        <ToolbarButton title="이미지 첨부" onClick={() => fileRef.current?.click()}>
          이미지
        </ToolbarButton>
        <ToolbarButton
          title="서식 지우기"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          지우기
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
