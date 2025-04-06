import { Editor, Extension } from '@tiptap/core';
import { EditorView } from 'prosemirror-view';
import markdownit from 'markdown-it';
import { Plugin, PluginKey } from 'prosemirror-state';

const md = markdownit({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
});

function containsMarkdown(text: string): boolean {
  const patterns = [
    /^#{1,6}\s+.+$/m, // Headers
    /\*\*(.+?)\*\*/, // Bold
    /\*(.+?)\*/, // Italic
    /\[(.+?)\]\((.+?)\)/, // Links
    /!\[(.+?)\]\((.+?)\)/, // Images
    /^[*\-+]\s+.+$/m, // Unordered lists
    /^[0-9]+\.\s+.+$/m, // Ordered lists
    /^```[\s\S]*?```$/m, // Code blocks
    /`(.+?)`/, // Inline code
    /^>\s+.+$/m, // Blockquotes
    /(https?:\/\/[^\s]+)/, // URL links
  ];

  return patterns.some((pattern) => pattern.test(text));
}

function handleUrlPaste(view: EditorView, event: ClipboardEvent): boolean {
  const clipboardText = event.clipboardData?.getData('text/plain');
  if (!clipboardText) return false;

  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = clipboardText.trim().match(urlRegex);
  if (!match) return false;

  const [fullUrl] = match;
  const isOnlyUrl = clipboardText.trim() === fullUrl;

  if (isOnlyUrl) {
    const { state, dispatch } = view;
    const { selection } = state;
    const { from } = selection;

    const tr = state.tr;

    tr.insertText(fullUrl, from);

    const linkMark = state.schema.marks.link.create({ href: fullUrl });
    tr.addMark(from, from + fullUrl.length, linkMark);

    dispatch(tr);
    event.preventDefault();
    return true;
  }

  return false;
}

function handleMarkdownLinkPaste(
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  const clipboardText = event.clipboardData?.getData('text/plain');
  if (!clipboardText) return false;

  if (!/(\[.*?\]\(.*?\))/.test(clipboardText)) return false;

  const { state, dispatch } = view;
  const { selection } = state;
  const { from } = selection;

  let processed = clipboardText;
  let hasMatch = false;

  let tr = state.tr;

  tr.insertText(processed, from);
  dispatch(tr);

  setTimeout(() => {
    const newState = view.state;
    const newText = newState.doc.textBetween(
      from,
      from + processed.length,
      ' ',
    );

    let match;
    let linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = linkRegex.exec(newText)) !== null) {
      hasMatch = true;
      const [fullMatch, linkText, linkUrl] = match;
      const matchStart = from + match.index;
      const matchEnd = matchStart + fullMatch.length;

      let processedUrl = linkUrl.trim();
      if (
        !processedUrl.startsWith('http://') &&
        !processedUrl.startsWith('https://')
      ) {
        if (processedUrl.startsWith('www.')) {
          processedUrl = `https://${processedUrl}`;
        } else {
          processedUrl = `https://${processedUrl}`;
        }
      }

      let newTr = view.state.tr;
      newTr.delete(matchStart, matchEnd);
      newTr.insertText(linkText, matchStart);

      const linkMark = newState.schema.marks.link.create({
        href: processedUrl,
      });
      newTr.addMark(matchStart, matchStart + linkText.length, linkMark);

      view.dispatch(newTr);
    }

    if (hasMatch) {
      const finalState = view.state;
      const finalTr = finalState.tr;
      finalTr.removeStoredMark(finalState.schema.marks.link);
      view.dispatch(finalTr);
    }
  }, 0);

  return hasMatch;
}

function handleMarkdownPaste(
  editor: Editor,
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  if (handleUrlPaste(view, event)) {
    return true;
  }

  if (handleMarkdownLinkPaste(view, event)) {
    event.preventDefault();
    return true;
  }

  if (!event.clipboardData) return false;

  const text = event.clipboardData.getData('text/plain');
  if (!text || !containsMarkdown(text)) return false;

  try {
    const html = md.render(text);

    editor.commands.insertContent(html);

    event.preventDefault();
    return true;
  } catch (error) {
    return false;
  }
}

export const MarkdownPastePlugin = Extension.create({
  name: 'markdownPasteHandler',

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        key: new PluginKey('markdownPasteHandler'),
        props: {
          handlePaste: (view, event) => {
            return handleMarkdownPaste(editor, view, event as ClipboardEvent);
          },
        },
      }),
    ];
  },
});
