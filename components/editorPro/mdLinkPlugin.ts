import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';

// Create a plugin specifically for handling Markdown links
export const MarkdownLinkPlugin = Extension.create({
  name: 'markdownLinks',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownLinks'),
        props: {
          // Handle keyboard input
          handleKeyDown: (view, event) => {
            // Check when user presses space or enter
            if (event.key === ' ' || event.key === 'Enter') {
              const { state, dispatch } = view;

              // Get current selection position
              if (!state.selection.empty) return false;
              const $head = state.selection.$head;

              // Get current line text
              const lineStart = $head.nodeBefore
                ? $head.pos - $head.nodeBefore.nodeSize
                : 0;
              const textBefore = state.doc.textBetween(
                lineStart,
                $head.pos,
                ' ',
              );

              // Check for pure URL format
              const urlRegex = /(https?:\/\/[^\s]+)$/;
              const urlMatch = textBefore.match(urlRegex);
              if (urlMatch) {
                const [fullMatch] = urlMatch;
                const start = $head.pos - fullMatch.length;

                // Create transaction
                const tr = state.tr;

                // Add link mark
                const linkMark = state.schema.marks.link.create({
                  href: fullMatch,
                });
                tr.addMark(start, $head.pos, linkMark);

                // Insert space
                tr.insertText(' ', $head.pos);

                // Move cursor after space
                const newPos = $head.pos + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                // Ensure new text is not part of the link
                tr.removeStoredMark(linkMark);

                // Apply transaction
                dispatch(tr);
                return true;
              }

              // Check for Markdown link format - ensure complete format match
              const linkMatch = textBefore.match(/\[([^\]]+)\]\(([^)]+)\)$/);
              if (linkMatch) {
                const [fullMatch, linkText, linkUrl] = linkMatch;
                const start = $head.pos - fullMatch.length;

                // Process link URL
                let processedUrl = linkUrl.trim();
                // Print debug info to ensure correct URL processing
                console.log(
                  'Processing link:',
                  linkText,
                  linkUrl,
                  processedUrl,
                );

                if (
                  !processedUrl.startsWith('http://') &&
                  !processedUrl.startsWith('https://')
                ) {
                  if (processedUrl.startsWith('www.')) {
                    processedUrl = `https://${processedUrl}`;
                  } else {
                    // Add https:// for any URL without protocol
                    processedUrl = `https://${processedUrl}`;
                  }
                }

                console.log('Processed URL:', processedUrl);

                // Create transaction: delete Markdown syntax, insert linked text
                const tr = state.tr;

                // 1. Delete original Markdown text
                tr.delete(start, $head.pos);

                // 2. Insert link text
                tr.insertText(linkText, start);

                // 3. Add link mark
                const linkMark = state.schema.marks.link.create({
                  href: processedUrl,
                });
                tr.addMark(start, start + linkText.length, linkMark);

                // 4. Insert space
                tr.insertText(' ', start + linkText.length);

                // 5. Move cursor after space
                const newPos = start + linkText.length + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                // 6. Ensure new text is not part of the link
                tr.removeStoredMark(linkMark);

                // Apply transaction
                dispatch(tr);
                return true;
              }

              // Check for Markdown image format
              const imageMatch = textBefore.match(/!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imageMatch) {
                const [fullMatch, altText, imageUrl] = imageMatch;
                const start = $head.pos - fullMatch.length;

                // Process link URL
                let processedUrl = imageUrl.trim();
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

                // Create transaction
                const tr = state.tr;

                // 1. Delete original Markdown text
                tr.delete(start, $head.pos);

                // 2. Insert alt text
                tr.insertText(altText, start);

                // 3. Add link mark
                const linkMark = state.schema.marks.link.create({
                  href: processedUrl,
                });
                tr.addMark(start, start + altText.length, linkMark);

                // 4. Insert space
                tr.insertText(' ', start + altText.length);

                // 5. Move cursor after space
                const newPos = start + altText.length + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                // 6. Ensure new text is not part of the link
                tr.removeStoredMark(linkMark);

                // Apply transaction
                dispatch(tr);
                return true;
              }
            }

            return false;
          },
        },
      }),
    ];
  },
});
