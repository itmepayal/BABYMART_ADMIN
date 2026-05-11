import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Undo2,
  Redo2,
  Strikethrough,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Eraser,
} from "lucide-react";
import { useEffect } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({ onClick, active, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-lg p-2 transition ${
      active
        ? "bg-emerald-100 text-emerald-700"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    {children}
  </button>
);

export default function TextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),

      Underline,

      Placeholder.configure({
        placeholder: "Write product description here...",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
    ],

    content: value || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const headings = [
    { level: 1, icon: <Heading1 size={16} /> },
    { level: 2, icon: <Heading2 size={16} /> },
    { level: 3, icon: <Heading3 size={16} /> },
    { level: 4, icon: <Heading4 size={16} /> },
    { level: 5, icon: <Heading5 size={16} /> },
    { level: 6, icon: <Heading6 size={16} /> },
  ];

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b bg-slate-50 p-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough size={16} />
        </ToolbarButton>

        {headings.map((heading) => (
          <ToolbarButton
            key={heading.level}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: heading.level as 1 | 2 | 3 | 4 | 5 | 6,
                })
                .run()
            }
            active={editor.isActive("heading", { level: heading.level })}
          >
            {heading.icon}
          </ToolbarButton>
        ))}

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code2 size={16} />
        </ToolbarButton>

        {/* ALIGNMENT */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={16} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <Eraser size={16} />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo2
            size={16}
            className={!editor.can().undo() ? "opacity-40" : ""}
          />
        </ToolbarButton>

        <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo2
            size={16}
            className={!editor.can().redo() ? "opacity-40" : ""}
          />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
