'use client';

import React, { useRef, useState } from 'react';

import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import {
  createZulandBeamFromBlocks,
  encodeSlateToBase64,
} from '@/utils/akasha';

import { ZuButton } from '@/components/core';
import AkashaCreateProfileModal from '@/components/modals/Zuland/AkashaCreateProfileModal';
import { IPublishData } from '@akashaorg/typings/lib/ui';
import {
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SlateEditorBlock, { SlateEditorBlockRef } from './SlateEditorBlock';
import TopicList from './TopicList';

interface NewPostProps {
  eventId: string;
  onCancel: () => void;
  onPostCreated: () => void;
}

const NewPost: React.FC<NewPostProps> = ({
  eventId,
  onCancel,
  onPostCreated,
}) => {
  const { currentAkashaUser, currentAkashaUserStats } = useAkashaAuthStore();

  const [reopenCreateProfileModal, setReopenCreateProfileModal] =
    useState(false);
  const [title, setTitle] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isPublishDisabled, setIsPublishDisabled] = useState(false);
  const MAX_TITLE_LENGTH = 300;
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const editorBlockRef = useRef<SlateEditorBlockRef>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(newTitle);
  };

  const handleSubmit = async () => {
    if (currentAkashaUser && !currentAkashaUserStats) {
      setReopenCreateProfileModal(true);
      return;
    }
    if (isPublishDisabled) {
      setErrorMessage(
        "There's an issue with your post content. Please check and try again.",
      );
      setShowErrorSnackbar(true);
      return;
    }
    try {
      const editorsContent = editorBlockRef.current?.getAllContents() || [];
      setErrorMessage('Encrypting post and publishing it to akasha...');
      setShowErrorSnackbar(true);
      await createBeamPassingBlocks(editorsContent);
      setErrorMessage('');
      setShowErrorSnackbar(false);
      onPostCreated();
    } catch (error) {
      console.error('Error creating beam', error);
      setErrorMessage(
        'An error occurred while creating your post. Please try again.',
      );
      setShowErrorSnackbar(true);
      onCancel();
    }
  };

  const handleCloseSnackbar = () => {
    setShowErrorSnackbar(false);
  };

  async function createBeamPassingBlocks(editorContents: IPublishData[]) {
    if (!title || editorContents.length === 0) {
      throw new Error('Beam title and content are required');
    }
    try {
      const blocks = editorContents.map((content, index) => ({
        label: `beam-content-${index + 1}`,
        propertyType: 'slate-block',
        value: encodeSlateToBase64(content.slateContent),
      }));

      await createZulandBeamFromBlocks({
        eventId,
        blocks: [
          {
            content: [
              {
                label: 'beam-title',
                propertyType: 'slate-block',
                value: encodeSlateToBase64([
                  {
                    type: 'paragraph',
                    children: [
                      {
                        text: title,
                      },
                    ],
                  },
                ]),
              },
              ...blocks,
            ],
          },
        ],
        tags: selectedTopics.map((topic) => ({
          labelType: '@bg/zuland#tag',
          value: topic,
        })),
      });
    } catch (err) {
      console.error('createBeamFromBlocks error', err);
      throw err;
    }
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography variant="h4">Create a new post</Typography>
        <Stack spacing={1}>
          <Typography variant="body1">Title</Typography>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
            inputProps={{
              maxLength: MAX_TITLE_LENGTH,
            }}
            helperText={`${MAX_TITLE_LENGTH - title.length} characters remaining`}
            FormHelperTextProps={{
              sx: { textAlign: 'right' },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {title.length}/{MAX_TITLE_LENGTH}
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TopicList
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
        />

        <Stack spacing={1}>
          <Typography variant="body1">Compose your post</Typography>
          {currentAkashaUserStats?.did ? (
            <SlateEditorBlock
              authenticatedDID={currentAkashaUserStats.did.id}
              ref={editorBlockRef}
              onPublishDisabledChange={setIsPublishDisabled}
            />
          ) : null}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <ZuButton onClick={onCancel}>Cancel</ZuButton>
          <ZuButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!title || isPublishDisabled}
            sx={{
              color: '#D7FFC4',
              backgroundColor: 'rgba(215, 255, 196, 0.2)',
              borderRadius: '10px',
              border: '1px solid rgba(215, 255, 196, 0.2)',
              padding: '4px 20px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
            }}
          >
            Post
          </ZuButton>
        </Stack>
      </Stack>
      <AkashaCreateProfileModal
        eventId={eventId}
        reOpen={reopenCreateProfileModal}
      />
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
      />
    </>
  );
};

export default NewPost;
