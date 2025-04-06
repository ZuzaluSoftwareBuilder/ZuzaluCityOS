import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Bold from '@tiptap/extension-bold';
import Text from '@tiptap/extension-text';
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
import { MarkdownLinkPlugin } from './mdLinkPlugin';
import { MarkdownPastePlugin } from './mdPasteHandler';

interface EditorValue {
  content: string;
  type: 'doc' | 'text';
  isEmpty: boolean;
}

interface EditorProProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  isEdit?: boolean;
  onClick?: () => void;
  collapsable?: boolean;
  collapseHeight?: number;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const isContentEmpty = (content: string): boolean => {
  const plainText = content
    .replace(/<br\s*\/?>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plainText.length === 0;
};

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

  useEffect(() => {
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href;
      setUrl(previousUrl || '');
    }
  }, [isOpen, editor]);

  const addLink = () => {
    if (!url || !editor) return;

    let processedUrl = url.trim();
    if (processedUrl.startsWith('www.')) {
      processedUrl = `https://${processedUrl}`;
    }

    const { empty, from, to } = editor.state.selection;
    if (empty) {
      alert('Please select the text you want to link');
      return;
    }

    const isUpdatingLink = editor.isActive('link');

    const { state, view } = editor;
    const { tr } = state;
    const linkMark = state.schema.marks.link.create({ href: processedUrl });

    let transaction = tr.addMark(from, to, linkMark);

    if (!isUpdatingLink) {
      transaction = transaction.setSelection(
        state.selection.constructor.near(transaction.doc.resolve(to)),
      );

      transaction = transaction.insertText(' ', to);

      transaction = transaction.removeStoredMark(linkMark);
    }

    view.dispatch(transaction);

    view.focus();

    setUrl('');
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
  value = '',
  onChange,
  placeholder = 'Start writing...',
  className,
  isEdit = true,
  onClick,
  collapsable = false,
  collapseHeight = 150,
  collapsed = false,
  onCollapse,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  const editorValue = React.useMemo(() => {
    if (!value) return JSON.parse(defaultValue);
    try {
      const parsedValue = JSON.parse(value);

      if (!isValidEditorValue(parsedValue)) {
        return JSON.parse(defaultValue);
      }

      const contentIsEmpty = isContentEmpty(parsedValue.content);
      return {
        ...parsedValue,
        isEmpty: contentIsEmpty,
      };
    } catch (e) {
      return JSON.parse(defaultValue);
    }
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'custom-bullet-list pl-4 my-[10px] list-disc text-white/80',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class:
              'custom-ordered-list pl-4 my-[10px] list-decimal text-white/80',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'custom-blockquote border-l-[3px] border-white/20 my-6 pl-4',
          },
        },
        code: {
          HTMLAttributes: {
            class:
              'custom-code bg-[#1f1f1f] rounded-[0.4rem] text-[0.85rem] px-[0.3em] py-[0.25em]',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'custom-code-block bg-[#1f1f1f] rounded-[0.5rem] my-6 p-4',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'custom-heading',
          },
        },
      }),
      Text.configure({
        HTMLAttributes: {
          class: 'text-[14px]',
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: 'font-bold font-[800]',
        },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class:
            'custom-link text-primary-500 hover:text-primary-400 cursor-pointer transition-colors',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        autolink: true,
      }),
      MarkdownPastePlugin,
      MarkdownLinkPlugin,
    ],
    content: editorValue.content,
    editable: isEdit,
    editorProps: {
      attributes: {
        class: cn(
          'tiptap prose prose-invert max-w-none focus:outline-none text-[14px]',
          '[&_.tiptap]:first:mt-0',
          '[&_h1]:text-[2rem] [&_h1]:leading-[1.4]',
          '[&_h2]:text-[1.6rem] [&_h2]:leading-[1.4]',
          '[&_h3]:text-[1.4rem] [&_h3]:leading-[1.4]',
          !isEdit && 'cursor-default',
          className,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      if (!isEdit || !isInitialized) return;
      const html = editor.getHTML();
      const contentIsEmpty = isContentEmpty(html);
      const jsonValue: EditorValue = {
        content: html,
        type: 'doc',
        isEmpty: contentIsEmpty,
      };
      onChange?.(JSON.stringify(jsonValue));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editorValue.content !== editor.getHTML()) {
      editor.commands.setContent(editorValue.content);
    }
  }, [editorValue.content, editor]);

  useEffect(() => {
    if (editor) {
      setIsInitialized(true);
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEdit);
    }
  }, [isEdit, editor]);

  const [canCollapse, setCanCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsable || isEdit || !contentRef.current) return;

    const checkHeight = () => {
      const contentHeight = contentRef.current?.scrollHeight || 0;
      const shouldCollapse = contentHeight > collapseHeight * 1.5;

      setCanCollapse(shouldCollapse);

      if (shouldCollapse) {
        onCollapse?.(shouldCollapse);
      }
    };

    setTimeout(checkHeight, 100);

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
            'relative p-[10px]',
            collapsable &&
              !isEdit &&
              canCollapse &&
              'transition-all duration-300',
          )}
        >
          <EditorContent editor={editor} />
          {editorValue.isEmpty && isEdit && (
            <div className="pointer-events-none absolute left-[10px] top-[10px] text-[16px] text-white/50">
              {placeholder}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPro;
