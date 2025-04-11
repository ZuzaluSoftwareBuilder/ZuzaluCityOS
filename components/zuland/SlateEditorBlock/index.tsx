'use client';

import { TrashcanIcon } from '@/components/icons';
import EditorBox, { EditorActions } from '@/components/zuland/EditorBox';
import { encodeSlateToBase64 } from '@/utils/akasha';
import { type IPublishData } from '@akashaorg/typings/lib/ui';
import { Box, Icon, IconButton, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import React, {
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

interface SlateEditorBlockProps {
  authenticatedDID: string;
  onPublishDisabledChange?: (isDisabled: boolean) => void;
}

export type SlateEditorBlockRef = {
  getAllContents: () => IPublishData[];
};

export const SlateEditorBlock = forwardRef<
  SlateEditorBlockRef,
  SlateEditorBlockProps
>(({ authenticatedDID, onPublishDisabledChange }, ref) => {
  const editorBlockRef = useRef<EditorActions[]>([]);

  const [isPublishDisabled, setIsPublishDisabled] = useState(false);
  const [editors, setEditors] = useState<
    {
      key: number;
      ref: React.RefObject<EditorActions>;
    }[]
  >([
    {
      key: 0,
      ref: createRef<EditorActions>(),
    },
  ]);

  const onPublish = (data: IPublishData) => {
    console.log('onPublish', data);
  };

  const addEditor = () => {
    setEditors((prevEditors) => {
      // Check if the current number of editors is less than 10
      if (prevEditors.length < 10) {
        return [
          ...prevEditors,
          {
            key: prevEditors.length,
            ref: createRef<EditorActions>(),
          },
        ];
      }
      // If we already have 10 editors, return the current state without changes
      return prevEditors;
    });
  };

  const removeEditor = (key: number) => {
    setEditors((prevEditors) => prevEditors.filter((p) => p.key !== key));
  };

  const handleDisablePublish = (disabled: boolean) => {
    setIsPublishDisabled(disabled);
    onPublishDisabledChange?.(disabled);
  };

  useImperativeHandle(
    ref,
    () => ({
      getAllContents: () => {
        return editors
          .map((_, index) => {
            return editorBlockRef.current[index]?.getContent() ?? null;
          })
          .filter((content) => content !== null);
      },
    }),
    [editors],
  );

  return (
    <Box>
      {editors.map((editor, index) => (
        <Box key={editor.key} mb={2}>
          <EditorBox
            showAvatar={false}
            profileId={authenticatedDID}
            placeholderLabel={'Write here'}
            maxEncodedLengthErrLabel={
              'Text block exceeds line limit, please review!'
            }
            withMeter={true}
            withToolbar={true}
            showPostButton={false}
            showCancelButton={false}
            initialEditorValue={undefined}
            editorActionsRef={editor.ref}
            handleDisablePublish={handleDisablePublish}
            encodingFunction={encodeSlateToBase64}
            onPublish={onPublish}
            ref={(el) => {
              if (el) {
                editorBlockRef.current[index] = el;
              }
            }}
          />
          {index > 0 && (
            <Stack alignItems="flex-end" width="100%">
              <IconButton
                onClick={() => removeEditor(editor.key)}
                sx={{
                  width: '2rem',
                  height: '2rem',
                }}
              >
                <Icon>
                  <TrashcanIcon />
                </Icon>
              </IconButton>
            </Stack>
          )}
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={addEditor}
        disabled={editors.length >= 10}
      >
        Add Block
      </Button>
    </Box>
  );
});

SlateEditorBlock.displayName = 'SlateEditorBlock';

export default SlateEditorBlock;
