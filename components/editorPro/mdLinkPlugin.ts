import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { TextSelection } from 'prosemirror-state';

export const MarkdownLinkPlugin = Extension.create({
  name: 'markdownLinks',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('markdownLinks'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              const { state, dispatch } = view;

              if (!state.selection.empty) return false;
              const $head = state.selection.$head;

              const lineStart = $head.nodeBefore
                ? $head.pos - $head.nodeBefore.nodeSize
                : 0;
              const textBefore = state.doc.textBetween(
                lineStart,
                $head.pos,
                ' ',
              );

              const urlRegex = /(https?:\/\/[^\s]+)$/;
              const urlMatch = textBefore.match(urlRegex);
              if (urlMatch) {
                const [fullMatch] = urlMatch;
                const start = $head.pos - fullMatch.length;

                const tr = state.tr;

                const linkMark = state.schema.marks.link.create({
                  href: fullMatch,
                });
                tr.addMark(start, $head.pos, linkMark);

                tr.insertText(' ', $head.pos);

                const newPos = $head.pos + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                tr.removeStoredMark(linkMark);

                dispatch(tr);
                return true;
              }

              const linkMatch = textBefore.match(/\[([^\]]+)\]\(([^)]+)\)$/);
              if (linkMatch) {
                const [fullMatch, linkText, linkUrl] = linkMatch;
                const start = $head.pos - fullMatch.length;

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

                const tr = state.tr;

                tr.delete(start, $head.pos);

                tr.insertText(linkText, start);

                const linkMark = state.schema.marks.link.create({
                  href: processedUrl,
                });
                tr.addMark(start, start + linkText.length, linkMark);

                tr.insertText(' ', start + linkText.length);

                const newPos = start + linkText.length + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                tr.removeStoredMark(linkMark);

                dispatch(tr);
                return true;
              }

              const imageMatch = textBefore.match(/!\[([^\]]*)\]\(([^)]+)\)$/);
              if (imageMatch) {
                const [fullMatch, altText, imageUrl] = imageMatch;
                const start = $head.pos - fullMatch.length;

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

                const tr = state.tr;

                tr.delete(start, $head.pos);

                tr.insertText(altText, start);

                const linkMark = state.schema.marks.link.create({
                  href: processedUrl,
                });
                tr.addMark(start, start + altText.length, linkMark);

                tr.insertText(' ', start + altText.length);

                const newPos = start + altText.length + 1;
                tr.setSelection(TextSelection.create(tr.doc, newPos));

                tr.removeStoredMark(linkMark);

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
