import isUrl from 'is-url';
import React, {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  createEditor,
  Descendant,
  Editor,
  Element,
  Text as SlateText,
  Transforms,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react';

import type {
  IMetadata,
  IPublishData,
  Profile,
} from '@akashaorg/typings/lib/ui';

import EditorMeter from './editor-meter';

import { CustomEditor } from './helpers';
import { editorDefaultValue } from './initial-value';
import { withLinks, withMentions } from './plugins';
import { renderElement, renderLeaf } from './renderers';
import { serializeToPlainText } from './serialize';

import { ArrowPathIcon } from '@/components/icons/ArrowPath';
import { transformSource } from '@/utils/akasha/editor/media-utils';
import { Avatar, Button, IconButton, Stack, Typography } from '@mui/material';
import {
  AlignTextCenter,
  AlignTextLeft,
  AlignTextRight,
  Bold,
  ExclamationTriangle,
  Italic,
  ListBulleted,
  ListNumbered,
  Underline,
} from './editor-icons';
import { BlockButton, MarkButton } from './formatting-buttons';

const MAX_TEXT_LENGTH = 500;

export type ExtendedNode = Descendant | { children: Descendant[] };

export type EditorActions = {
  insertText: (text: string) => void;
  insertBreak: () => void;
  getContent: () => IPublishData;
  children: Descendant[];
  overwriteEditorChildren?: (value: Descendant[]) => void;
};

export type EditorBoxProps = {
  avatar?: Profile['avatar'];
  showAvatar?: boolean;
  profileId: string | null;
  actionLabel?: string;
  placeholderLabel?: string;
  emojiPlaceholderLabel?: string;
  disableActionLabel?: string;
  maxEncodedLengthErrLabel?: string;
  disablePublish?: boolean;
  minHeight?: string;
  withMeter?: boolean;
  withToolbar?: boolean;
  publishingApp?: string;
  initialEditorValue?: Descendant[];
  ref?: React.Ref<unknown>;
  showCancelButton?: boolean;
  cancelButtonLabel?: string;
  showDraft?: boolean;
  showPostButton?: boolean;
  // this is to account for the limitations on the ceramic storage side
  maxEncodedLength?: number;
  editorActionsRef?: RefObject<EditorActions>;
  onPublish?: (publishData: IPublishData) => void;
  onCancelClick?: () => void;
  handleDisablePublish?: (value: boolean) => void;
  encodingFunction: (value: Descendant[]) => string;
};

/* eslint-disable complexity */
/**
 * Editor component based on the slate.js framework
 * @param withMeter - display the letter counter, maximum length is internally defined at 500
 * @param withToolbar - display the rich text formatting toolbar
 * @param encodingFunction - utility function to check if the encoded slate content is too big
 */
const EditorBox = forwardRef<EditorActions, EditorBoxProps>((props, ref) => {
  const {
    avatar,
    showAvatar = true,
    profileId,
    actionLabel = 'write',
    placeholderLabel,
    disableActionLabel = 'disabled',
    maxEncodedLengthErrLabel,
    disablePublish,
    minHeight,
    withMeter,
    withToolbar,
    publishingApp = 'AkashaApp',
    initialEditorValue,
    cancelButtonLabel = 'Cancel',
    showCancelButton,
    showPostButton = true,
    maxEncodedLength = 6000,
    editorActionsRef,
    onCancelClick,
    onPublish,
    handleDisablePublish,
    encodingFunction,
  } = props;
  const [letterCount, setLetterCount] = useState(0);

  const [publishDisabledInternal, setPublishDisabledInternal] = useState(true);
  const [showMaxEncodedLengthErr, setShowMaxEncodedLengthErr] = useState(false);

  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editorRef = useRef(
    withLinks(withMentions(withHistory(withReact(createEditor())))),
  );

  const editor = editorRef.current;

  /**
   * insert links here to be able to access the image state
   * and prevent link preview generation when there are images
   * already uploaded or currently uploading
   */
  const { insertData, insertText, children } = editor;

  const handleInsertLink = (text: string) => {
    CustomEditor.insertLink(editor, text.trim());
  };

  editor.insertText = (text) => {
    if (text && isUrl(text.trim())) {
      handleInsertLink(text);
    } else {
      insertText(text);
    }
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    if (text && isUrl(text.trim())) {
      handleInsertLink(text);
    } else {
      insertData(data);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      insertText: (text: string) => {
        editor.insertText(text);
      },
      insertBreak: () => {
        editor.insertText('\n');
      },
      getContent: () => {
        const slateContent = editor.children.slice(0, MAX_TEXT_LENGTH);

        const metadata: IMetadata = {
          app: publishingApp,
          mentions: [],
          version: 1,
        };

        /**
         * wrap slateContent in object to make recursive getMetadata work
         */
        const initContent: { children: Descendant[] } = {
          children: slateContent,
        };
        (function getMetadata(node: ExtendedNode) {
          if (Element.isElement(node) && node.type === 'mention') {
            if (node.id) {
              metadata.mentions.push(node.id);
            }
          }
          if (Element.isElement(node) && node.children) {
            node.children.forEach((n: Descendant) => getMetadata(n));
          }
        })(initContent);

        const textContent: string = serializeToPlainText({
          children: slateContent,
        });

        const data: IPublishData = {
          metadata,
          slateContent,
          textContent,
          author: profileId,
        };

        return data;
      },
      children: editor.children,
      overwriteEditorChildren: (value: Descendant[]) => {
        Transforms.removeNodes(editor, { at: [] });
        Transforms.insertNodes(editor, value);
      },
    }),
    [editor, publishingApp, profileId],
  );

  /**
   * set the selection at the end of the content when component is mounted
   */
  useEffect(() => {
    Transforms.select(editor, Editor.end(editor, []));
  }, [editor]);

  /**
   * creates the object for publishing and resets the editor state after
   * metadata contains mentions, quote, the publishing app and the version of the document
   */
  const handlePublish = () => {
    const publishData = editorActionsRef?.current?.getContent();

    if (publishData) {
      CustomEditor.clearEditor(editor);
      if (typeof onPublish === 'function') {
        onPublish(publishData);
      }
    }
  };

  /**
   *  computes the text length
   *  sets the editor state
   *  handles selection for mentions and tags
   */
  const handleChange = (value: Descendant[]) => {
    let textLength = 0;
    let encodedNodeLength = 0;
    /**
     * include tags, mentions and links in the text length
     * keeps track of the number of images in the content
     */
    (function computeLength(nodeArr: Descendant[]) {
      if (nodeArr.length) {
        nodeArr.forEach((node: Descendant) => {
          if (SlateText.isText(node)) {
            textLength += node.text.length;
          }
          if (
            Element.isElement(node) &&
            node.type === 'mention' &&
            node.name?.length
          ) {
            textLength += node.name.length;
          }
          if (
            Element.isElement(node) &&
            node.type === 'link' &&
            node.url?.length
          ) {
            textLength += node.url.length;
          }
          if (Element.isElement(node) && node.children) {
            computeLength(node.children);
          }
        });
      }
    })(value);

    (function computeEncodedNodeLength(nodeArr: Descendant[]) {
      if (nodeArr.length) {
        encodedNodeLength = encodingFunction(nodeArr).length;
      }
    })(value);

    /** disable publishing if encoded content length or text are too long */
    if (
      textLength > 0 &&
      textLength <= MAX_TEXT_LENGTH &&
      encodedNodeLength <= maxEncodedLength
    ) {
      setPublishDisabledInternal(false);
      if (typeof handleDisablePublish === 'function') {
        handleDisablePublish?.(false);
      }
    } else if (
      textLength === 0 ||
      textLength > MAX_TEXT_LENGTH ||
      encodedNodeLength > maxEncodedLength
    ) {
      setPublishDisabledInternal(true);
      if (typeof handleDisablePublish === 'function') {
        handleDisablePublish?.(true);
      }
    }

    if (encodedNodeLength <= maxEncodedLength) {
      setShowMaxEncodedLengthErr(false);
    } else if (
      encodedNodeLength > maxEncodedLength &&
      textLength < MAX_TEXT_LENGTH
    ) {
      setShowMaxEncodedLengthErr(true);
    }

    if (typeof setLetterCount === 'function') {
      setLetterCount(textLength);
    }
  };

  const publishDisabled = publishDisabledInternal || disablePublish;

  return (
    <Stack justifyContent="between" width="100%">
      <Stack direction="row" justifyContent="start" spacing="gap-x-2">
        {showAvatar && (
          <Stack padding={16}>
            <Avatar
              alt={`${profileId} profile avatar`}
              src={
                transformSource(avatar?.default).src ??
                transformSource(avatar?.alternatives?.[0] ?? undefined)
              }
            />
          </Stack>
        )}
        <Stack
          ref={editorContainerRef}
          width="100%"
          padding={1}
          sx={{
            backgroundColor: 'rgb(55, 55, 55)',
            border: `1px solid ${
              publishDisabled && letterCount > 0 ? '#ffa500' : 'transparent'
            }`,
            borderRadius: '10px',
            padding: '10px 25px',
          }}
        >
          <Slate
            editor={editor}
            initialValue={initialEditorValue || editorDefaultValue}
            onChange={handleChange}
          >
            <Editable
              placeholder={placeholderLabel}
              style={{
                padding: '0px 3px',
              }}
              autoComplete="off"
              spellCheck={false}
              autoFocus={true}
              renderLeaf={renderLeaf}
              renderElement={(renderProps: RenderElementProps) =>
                renderElement(
                  renderProps,
                  () => null,
                  () => null,
                  () => null,
                )
              }
            />
            <Stack
              direction="row"
              justifyContent={withToolbar ? 'space-between' : 'end'}
            >
              {withToolbar && (
                <Stack direction="row" alignItems="center">
                  <MarkButton
                    format="bold"
                    icon={<Bold fill="#D7FFC4" />}
                    style={'rounded-l-sm'}
                  />
                  <MarkButton
                    format="italic"
                    icon={<Italic fill="#D7FFC4" />}
                  />
                  <MarkButton
                    format="underline"
                    icon={<Underline fill="#D7FFC4" />}
                  />
                  <BlockButton
                    format="left"
                    icon={<AlignTextLeft fill="#D7FFC4" />}
                  />
                  <BlockButton
                    format="center"
                    icon={<AlignTextCenter fill="#D7FFC4" />}
                  />
                  <BlockButton
                    format="right"
                    icon={<AlignTextRight fill="#D7FFC4" />}
                  />
                  <BlockButton
                    format="numbered-list"
                    icon={<ListNumbered fill="#D7FFC4" />}
                  />
                  <BlockButton
                    format="bulleted-list"
                    icon={<ListBulleted fill="#D7FFC4" />}
                    style={'rounded-r-sm'}
                  />
                </Stack>
              )}
              <Stack
                direction="row"
                alignItems="center"
                spacing="gap-x-2"
                padding={1}
              >
                {withMeter && (
                  <EditorMeter value={letterCount} max={MAX_TEXT_LENGTH} />
                )}
                {showCancelButton && (
                  <Button onClick={onCancelClick}>{cancelButtonLabel}</Button>
                )}
                {showPostButton && (
                  <Button
                    startIcon={disablePublish ? <ArrowPathIcon /> : null}
                    onClick={handlePublish}
                    disabled={publishDisabled}
                  >
                    {disablePublish ? disableActionLabel : actionLabel}
                  </Button>
                )}
              </Stack>
            </Stack>
          </Slate>
          {showMaxEncodedLengthErr && (
            <Stack direction="row" alignItems="center" padding={1}>
              <IconButton size="small">
                <ExclamationTriangle fill="#ffa500" />
              </IconButton>
              <Typography>{maxEncodedLengthErrLabel}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
});
EditorBox.displayName = 'EditorBox';

export default EditorBox;
