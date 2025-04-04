import { Editor, Extension } from '@tiptap/core';
import { EditorView } from 'prosemirror-view';
import markdownit from 'markdown-it';
import { Plugin, PluginKey } from 'prosemirror-state';

// Initialize markdown-it instance
const md = markdownit({
  html: false,
  breaks: true,
  linkify: true, // Enable automatic link detection
  typographer: true,
});

/**
 * Check if text contains Markdown syntax or URLs
 */
function containsMarkdown(text: string): boolean {
  // Check common Markdown formats
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

/**
 * Handle pasting of pure URLs
 */
function handleUrlPaste(view: EditorView, event: ClipboardEvent): boolean {
  const clipboardText = event.clipboardData?.getData('text/plain');
  if (!clipboardText) return false;

  // Check if it's a pure URL - relaxed conditions, not requiring exact single-line URL match
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = clipboardText.trim().match(urlRegex);
  if (!match) return false;

  // If text exactly matches URL pattern or contains only one URL
  const [fullUrl] = match;
  const isOnlyUrl = clipboardText.trim() === fullUrl;

  if (isOnlyUrl) {
    const { state, dispatch } = view;
    const { selection } = state;
    const { from } = selection;

    // Create transaction
    const tr = state.tr;

    // Insert URL text
    tr.insertText(fullUrl, from);

    // Add link mark
    const linkMark = state.schema.marks.link.create({ href: fullUrl });
    tr.addMark(from, from + fullUrl.length, linkMark);

    // Apply transaction
    dispatch(tr);
    event.preventDefault();
    return true;
  }

  return false;
}

/**
 * Handle pasting of Markdown links
 */
function handleMarkdownLinkPaste(
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  const clipboardText = event.clipboardData?.getData('text/plain');
  if (!clipboardText) return false;

  // Check if pasted text contains Markdown link format
  if (!/(\[.*?\]\(.*?\))/.test(clipboardText)) return false;

  console.log('Detected Markdown link:', clipboardText);

  const { state, dispatch } = view;
  const { selection } = state;
  const { from } = selection;

  // Parse Markdown links in pasted text
  let processed = clipboardText;
  let hasMatch = false;

  // Process Markdown link [text](url)
  let tr = state.tr;

  // Insert processed text
  tr.insertText(processed, from);
  dispatch(tr);

  // Manually traverse document to find and process links
  setTimeout(() => {
    const newState = view.state;
    const newText = newState.doc.textBetween(
      from,
      from + processed.length,
      ' ',
    );

    console.log('Processing text:', newText);

    let match;
    let linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = linkRegex.exec(newText)) !== null) {
      hasMatch = true;
      const [fullMatch, linkText, linkUrl] = match;
      const matchStart = from + match.index;
      const matchEnd = matchStart + fullMatch.length;

      console.log('Found link:', linkText, linkUrl);

      // Process link URL
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

      console.log('Processed URL:', processedUrl);

      // Replace Markdown link with actual link
      let newTr = view.state.tr;
      newTr.delete(matchStart, matchEnd);
      newTr.insertText(linkText, matchStart);

      const linkMark = newState.schema.marks.link.create({
        href: processedUrl,
      });
      newTr.addMark(matchStart, matchStart + linkText.length, linkMark);

      view.dispatch(newTr);
    }

    // Ensure cursor is after the last link and not in link mode
    if (hasMatch) {
      const finalState = view.state;
      const finalTr = finalState.tr;
      finalTr.removeStoredMark(finalState.schema.marks.link);
      view.dispatch(finalTr);
    }
  }, 0);

  return hasMatch;
}

/**
 * Main function for handling Markdown content pasting
 */
function handleMarkdownPaste(
  editor: Editor,
  view: EditorView,
  event: ClipboardEvent,
): boolean {
  // First try to handle pure URLs
  if (handleUrlPaste(view, event)) {
    return true;
  }

  // Then try to handle Markdown links
  if (handleMarkdownLinkPaste(view, event)) {
    event.preventDefault();
    return true;
  }

  if (!event.clipboardData) return false;

  // Get clipboard text
  const text = event.clipboardData.getData('text/plain');
  if (!text || !containsMarkdown(text)) return false;

  try {
    // Convert Markdown to HTML
    const html = md.render(text);

    // Use editor's insertContent API to insert content
    editor.commands.insertContent(html);

    // Prevent default paste behavior
    event.preventDefault();
    return true;
  } catch (error) {
    console.error('Error processing Markdown:', error);
    return false;
  }
}

/**
 * Create Markdown paste handler plugin - using standard Tiptap extension format
 */
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

// Note: This plugin requires markdown-it dependency in package.json
// npm install markdown-it @types/markdown-it
