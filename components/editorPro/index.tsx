import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import {
  TextHOne,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  TextBolder,
  TextItalic,
  Code,
  Quotes,
} from '@phosphor-icons/react';
import { cn } from '@heroui/react';

interface EditorValue {
  content: string;
  type: 'doc' | 'text';
  isEmpty: boolean;
}

interface EditorProProps {
  value?: string; // JSON string
  onChange?: (value: string) => void; // JSON string
  placeholder?: string;
  className?: string;
}

// 检查内容是否为空
const isContentEmpty = (content: string): boolean => {
  // 移除 HTML 标签和空白字符
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  return plainText.length === 0;
};

// 检查对象是否符合 EditorValue 结构
const isValidEditorValue = (value: any): value is EditorValue => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.content === 'string' &&
    (value.type === 'doc' || value.type === 'text') &&
    typeof value.isEmpty === 'boolean'
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('heading', { level: 1 }) && 'bg-white/10',
        )}
        title="Heading 1"
      >
        <TextHOne size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('heading', { level: 2 }) && 'bg-white/10',
        )}
        title="Heading 2"
      >
        <TextHTwo size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('heading', { level: 3 }) && 'bg-white/10',
        )}
        title="Heading 3"
      >
        <TextHThree size={20} />
      </button>
      <div className="mx-1 my-auto h-6 w-px bg-white/10" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('bold') && 'bg-white/10',
        )}
        title="Bold"
      >
        <TextBolder size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('italic') && 'bg-white/10',
        )}
        title="Italic"
      >
        <TextItalic size={20} />
      </button>
      <div className="mx-1 my-auto h-6 w-px bg-white/10" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('bulletList') && 'bg-white/10',
        )}
        title="Bullet List"
      >
        <ListBullets size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('orderedList') && 'bg-white/10',
        )}
        title="Ordered List"
      >
        <ListNumbers size={20} />
      </button>
      <div className="mx-1 my-auto h-6 w-px bg-white/10" />
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('code') && 'bg-white/10',
        )}
        title="Code"
      >
        <Code size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          'p-2 rounded hover:bg-white/10',
          editor.isActive('blockquote') && 'bg-white/10',
        )}
        title="Quote"
      >
        <Quotes size={20} />
      </button>
    </div>
  );
};

const defaultValue = JSON.stringify({
  content: '',
  type: 'doc',
  isEmpty: true,
});

const EditorPro: React.FC<EditorProProps> = ({
  value,
  onChange,
  placeholder = 'Enter content...',
  className = '',
}) => {
  // Parse the JSON string to get the editor value
  const editorValue = React.useMemo(() => {
    if (!value) return JSON.parse(defaultValue);
    try {
      const parsedValue = JSON.parse(value);

      // 检查解析出的值是否符合 EditorValue 结构
      if (!isValidEditorValue(parsedValue)) {
        console.error('Invalid editor value structure');
        return JSON.parse(defaultValue);
      }

      // 检查内容是否为空
      const contentIsEmpty = isContentEmpty(parsedValue.content);
      return {
        ...parsedValue,
        isEmpty: contentIsEmpty,
      };
    } catch (e) {
      console.error('Failed to parse editor value:', e);
      return JSON.parse(defaultValue);
    }
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: editorValue.content,
    editorProps: {
      attributes: {
        class: cn(
          'tiptap prose prose-invert max-w-none focus:outline-none',
          '[&_.tiptap]:first:mt-0',
          '[&_h1]:text-[2rem] [&_h1]:leading-[1.4]',
          '[&_h2]:text-[1.6rem] [&_h2]:leading-[1.4]',
          '[&_h3]:text-[1.4rem] [&_h3]:leading-[1.4]',
          '[&_h6]:text-[1rem] [&_h6]:leading-[1.1] [&_h6]:mt-1 [&_h6]:mb-1',
          '[&_strong]:font-[800]',
          '[&_ul]:pl-4 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:text-white/80',
          '[&_ol]:pl-4 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:text-white/80',
          '[&_li_p]:mt-1 [&_li_p]:mb-1',
          '[&_code]:bg-[#1f1f1f] [&_code]:rounded-[0.4rem] [&_code]:text-[0.85rem] [&_code]:px-[0.3em] [&_code]:py-[0.25em]',
          '[&_pre]:bg-[#1f1f1f] [&_pre]:rounded-[0.5rem] [&_pre]:my-6 [&_pre]:p-4',
          '[&_pre_code]:bg-transparent [&_pre_code]:text-[0.8rem] [&_pre_code]:p-0',
          '[&_blockquote]:border-l-[3px] [&_blockquote]:border-white/20 [&_blockquote]:my-6 [&_blockquote]:pl-4',
          '[&_hr]:border-none [&_hr]:border-t [&_hr]:border-white/20 [&_hr]:my-8',
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const contentIsEmpty = isContentEmpty(html);
      const jsonValue: EditorValue = {
        content: html,
        type: 'doc',
        isEmpty: contentIsEmpty,
      };
      onChange?.(JSON.stringify(jsonValue));
    },
    immediatelyRender: false, // Fix SSR warning
  });

  // Update editor content when external value changes
  useEffect(() => {
    if (editor && editorValue.content !== editor.getHTML()) {
      editor.commands.setContent(editorValue.content);
    }
  }, [editorValue.content, editor]);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg bg-[#2D2D2D]">
        <MenuBar editor={editor} />
        <div className="relative min-h-[200px] p-4">
          <EditorContent editor={editor} />
          {editorValue.isEmpty && (
            <div className="pointer-events-none absolute left-[15px] top-[15px] text-gray-500">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPro;
