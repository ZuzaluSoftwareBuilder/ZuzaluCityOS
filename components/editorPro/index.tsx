import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import React, { useEffect, useState, useRef } from 'react';
import {
  TextHOne,
  TextHTwo,
  TextHThree,
  ListBullets,
  ListNumbers,
  TextBolder,
  TextItalic,
  Quotes,
  Link as LinkIcon,
} from '@phosphor-icons/react';
import { cn } from '@heroui/react';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Button, Input } from '@/components/base';

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
  isEdit?: boolean;
  onClick?: () => void;
  collapsable?: boolean;
  collapseHeight?: number;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

// Check if content is empty
const isContentEmpty = (content: string): boolean => {
  // Remove HTML tags and whitespace
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  return plainText.length === 0;
};

// Check if object is a valid EditorValue structure
const isValidEditorValue = (value: any): value is EditorValue => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.content === 'string' &&
    (value.type === 'doc' || value.type === 'text') &&
    typeof value.isEmpty === 'boolean'
  );
};

const LinkInput = ({ editor, isOpen }: { editor: any; isOpen: boolean }) => {
  const [url, setUrl] = useState('');

  // When the popup opens, fill in the existing link URL if there is one
  useEffect(() => {
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href;
      setUrl(previousUrl || '');
    }
  }, [isOpen, editor]);

  const addLink = () => {
    // Check if there is selected text
    const hasSelection = !editor.state.selection.empty;

    if (url) {
      if (hasSelection) {
        // If text is selected, add the link directly
        editor.chain().focus().setLink({ href: url }).run();
      } else {
        // If no text is selected, prompt the user
        alert('Please select the text you want to link');
        return;
      }
      setUrl('');
    }
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    setUrl('');
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        size="sm"
        placeholder="Enter link URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addLink();
          }
        }}
      />
      <div className="flex gap-2">
        <Button size="sm" color="submit" onPress={addLink}>
          {editor.isActive('link') ? 'Update Link' : 'Add Link'}
        </Button>
        {editor.isActive('link') && (
          <Button size="sm" color="secondary" onPress={removeLink}>
            Remove Link
          </Button>
        )}
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  const [isLinkOpen, setIsLinkOpen] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-white/10 p-[10px]">
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('heading', { level: 1 }) && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Heading 1"
      >
        <TextHOne size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('heading', { level: 2 }) && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Heading 2"
      >
        <TextHTwo size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('heading', { level: 3 }) && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Heading 3"
      >
        <TextHThree size={20} />
      </Button>
      <div className="mx-1 my-auto h-6 w-px bg-white/10" />
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('bold') && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Bold"
      >
        <TextBolder size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('italic') && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Italic"
      >
        <TextItalic size={20} />
      </Button>
      <div className="mx-1 my-auto h-6 w-px bg-white/10" />
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('bulletList') && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Bullet List"
      >
        <ListBullets size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('orderedList') && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Ordered List"
      >
        <ListNumbers size={20} />
      </Button>
      <Button
        isIconOnly
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          'bg-transparent hover:bg-[#363636]',
          editor.isActive('blockquote') && 'bg-[#363636]',
          'p-[5px]',
        )}
        title="Quote"
      >
        <Quotes size={20} />
      </Button>
      <Popover
        isOpen={isLinkOpen}
        onOpenChange={(open) => {
          setIsLinkOpen(open);
        }}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            size="sm"
            className={cn(
              'bg-transparent hover:bg-[#363636]',
              editor.isActive('link') && 'bg-[#363636]',
              'p-[5px]',
            )}
            title={editor.isActive('link') ? 'Edit Link' : 'Add Link'}
          >
            <LinkIcon size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <LinkInput editor={editor} isOpen={isLinkOpen} />
        </PopoverContent>
      </Popover>
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
  isEdit = true,
  onClick,
  collapsable = false,
  collapseHeight = 200,
  collapsed = false,
  onCollapse,
}) => {
  // Parse the JSON string to get the editor value
  const editorValue = React.useMemo(() => {
    if (!value) return JSON.parse(defaultValue);
    try {
      const parsedValue = JSON.parse(value);

      // Check if parsed value is a valid EditorValue structure
      if (!isValidEditorValue(parsedValue)) {
        console.error('Invalid editor value structure');
        return JSON.parse(defaultValue);
      }

      // Check if content is empty
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
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 hover:underline cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        validate: (href) =>
          /^https?:\/\//.test(href) ||
          href.startsWith('/') ||
          href.startsWith('#'),
        protocols: ['http', 'https', 'mailto', 'tel'],
      }),
    ],
    content: editorValue.content,
    editable: isEdit, // Control editable state
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
          !isEdit && 'cursor-default', // Add cursor-default in read-only mode
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      if (!isEdit) return; // Prevent updates in read-only mode
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

  // Update editable state when isEdit changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEdit);
    }
  }, [isEdit, editor]);

  const [canCollapse, setCanCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 检查内容是否足够高以支持折叠
  useEffect(() => {
    if (!collapsable || isEdit || !contentRef.current) return;

    const checkHeight = () => {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      const shouldCollapse = contentHeight > collapseHeight * 1.5;

      setCanCollapse(shouldCollapse);

      // 只通知外部内容是否可折叠，但不主动设置折叠状态
      if (shouldCollapse) {
        onCollapse?.(shouldCollapse);
      }
    };

    // 检查完成后通知外部
    setTimeout(checkHeight, 100);

    // 监听窗口大小变化
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, [
    collapsable,
    isEdit,
    collapseHeight,
    editor,
    editorValue.content,
    onCollapse,
  ]);

  return (
    <div className="w-full">
      <div
        className={cn(
          'rounded-lg bg-white/[0.02]',
          collapsable &&
            !isEdit &&
            canCollapse &&
            collapsed &&
            'overflow-hidden',
        )}
        onClick={onClick}
        style={
          collapsable && !isEdit && canCollapse && collapsed
            ? { maxHeight: `${collapseHeight}px` }
            : undefined
        }
      >
        {isEdit && <MenuBar editor={editor} />}
        <div
          ref={contentRef}
          className={cn(
            'relative min-h-[50px] p-[10px]',
            !isEdit && 'pt-[10px]',
            collapsable &&
              !isEdit &&
              canCollapse &&
              'transition-all duration-300',
          )}
        >
          <EditorContent editor={editor} />
          {editorValue.isEmpty && isEdit && (
            <div className="pointer-events-none absolute left-[10px] top-[10px] text-gray-500">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPro;
