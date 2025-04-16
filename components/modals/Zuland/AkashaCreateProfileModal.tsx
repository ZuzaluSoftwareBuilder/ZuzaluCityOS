'use client';

import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import { useEffect, useState } from 'react';

import { AkashaProfileStats } from '@/types/akasha';
import { createZulandProfile } from '@/utils/akasha';

import { ZuButton } from '@/components/core';
import {
  IconButton,
  InputAdornment,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { getIconFromLink } from '@/components/zuland/DiscussionSidebar';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface AkashaCreateProfileModalProps {
  eventId: string;
  reOpen?: boolean;
}

const AkashaCreateProfileModal = ({
  eventId,
  reOpen,
}: AkashaCreateProfileModalProps) => {
  const MAX_NAME_LENGTH = 32;
  const MAX_DESCRIPTION_LENGTH = 100;
  const MAX_LINKS = 5;

  const { username } = useAbstractAuthContext();
  const { currentAkashaUser, currentAkashaUserStats, setAkashaUserStats } =
    useAkashaAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [profileName, setProfileName] = useState(username ?? '');
  const [profileDescription, setProfileDescription] = useState('');
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);
  const [newLink, setNewLink] = useState({ platform: 'chain', url: '' });

  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    if (currentAkashaUser && !currentAkashaUserStats) {
      setOpenModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reOpen) {
      setOpenModal(true);
    }
  }, [reOpen]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCreateProfile = async () => {
    if (!profileName) {
      setResultMessage(`Profile name is required`);
      setOpenSnackbar(true);
      return;
    }
    try {
      const result = await createZulandProfile(eventId, {
        name: profileName,
        description: profileDescription,
        links: links.map((link) => ({ href: link.url, label: null })),
      });
      console.log('handleCreateProfile result', result);
      setAkashaUserStats(result as AkashaProfileStats['akashaProfile']);
      setResultMessage(`Akasha profile created, ${profileName}!`);
    } catch (error) {
      console.error(`Error creating Akasha profile`, error);
      setResultMessage(`Error creating Akasha profile`);
    }
    setOpenModal(false);
    setOpenSnackbar(true);
  };

  const handleAddLink = () => {
    if (newLink.url && links.length < MAX_LINKS) {
      setLinks([...links, newLink]);
      setNewLink({ platform: 'chain', url: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="share-modal-title"
      >
        <Stack
          spacing={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.default',
            border: '2px solid #222222',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="profile-name"
            variant="h4"
            component="h2"
            gutterBottom
          >
            Create your Akasha profile
          </Typography>
          <Stack spacing={1}>
            <Typography variant="h6">Profile name *</Typography>
            <TextField
              fullWidth
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{
                maxLength: MAX_NAME_LENGTH,
              }}
              helperText={`Required`}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h6">Profile description</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={profileDescription}
              onChange={(e) => setProfileDescription(e.target.value)}
              inputProps={{
                maxLength: MAX_DESCRIPTION_LENGTH,
              }}
              sx={{ mb: 2 }}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="h6">Links (Max {MAX_LINKS})</Typography>
            {links.map((link, index) => (
              <TextField
                key={index}
                fullWidth
                value={link.url}
                sx={{ mb: 1, color: 'white' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" color="info">
                      {getIconFromLink(link.url)}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleRemoveLink(index)}
                        color="info"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
            {links.length < MAX_LINKS && (
              <TextField
                fullWidth
                value={newLink.url}
                onChange={(e) =>
                  setNewLink({ ...newLink, url: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" color="info">
                      {getIconFromLink(newLink.url)}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleAddLink}
                        color="info"
                        disabled={links.length >= MAX_LINKS}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, color: 'white' }}
              />
            )}
          </Stack>
          <ZuButton
            variant="contained"
            color="primary"
            onClick={handleCreateProfile}
            disabled={!profileName}
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
            Create Profile
          </ZuButton>
        </Stack>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={resultMessage}
      />
    </>
  );
};

export default AkashaCreateProfileModal;
