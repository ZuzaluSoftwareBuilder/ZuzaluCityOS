'use client';

import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

import { ZuButton } from '@/components/core';
import { PlusCircleIcon } from '@/components/icons';
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import AkashaConnectModal from '@/components/modals/Zuland/AkashaConnectModal';
import Container from '@/components/zuland/Container';
import PostCard from '@/components/zuland/PostCard';
import SortList from '@/components/zuland/SortList';
import TopicList from '@/components/zuland/TopicList';
import { Post } from '@/utils/akasha/beam-to-post';

interface DiscussionsHomeProps {
  eventId: string;
  posts: Post[];
  isLoadingBeams: boolean;
  setIsNewPostOpen: (value: string) => void;
  selectedSort: string;
  setSelectedSort: Dispatch<SetStateAction<string>>;
  loadMoreBeams: () => void;
  hasMoreBeams: boolean;
  errorMessage?: string;
}

const DiscussionsHome = ({
  eventId,
  posts,
  isLoadingBeams,
  setIsNewPostOpen,
  selectedSort,
  setSelectedSort,
  loadMoreBeams,
  hasMoreBeams,
  errorMessage,
}: DiscussionsHomeProps) => {
  const { currentAkashaUser, loginAkasha } = useAkashaAuthStore();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showAkashaModal, setShowAkashaModal] = useState(false);

  const handleSignInUser = () => {
    setShowAkashaModal(false);
    loginAkasha()
      .then(() => {
        setIsNewPostOpen('true');
      })
      .catch((err) => {
        console.error('err', err);
      });
  };

  const handleLoadMoreBeams = () => {
    if (hasMoreBeams && !isLoadingBeams) {
      loadMoreBeams();
    }
  };

  return (
    <>
      {/* Hero section */}
      <Box
        justifyContent="center"
        position="relative"
        display="flex"
        flexDirection="row"
        borderRadius="10px"
        padding="40px 40px"
        width="100%"
        sx={{
          marginTop: '20px',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/27.jpg")',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
        <Container>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
            sx={{
              position: 'relative',
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              maxWidth="1200px"
            >
              <Typography
                color={theme.palette.text.primary}
                variant={isMobile ? 'h1' : 'hB'}
              >
                Discussions
              </Typography>
              <Typography color="white" variant="bodyB" marginBottom="20px">
                Discuss with the members of the community
              </Typography>
            </Box>
            <Link
              href={`/events/${eventId}?tab=discussions&newPost=true`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <ZuButton
                variant="outlined"
                size="small"
                startIcon={<PlusCircleIcon size={5} />}
                sx={{ padding: '10px 20px' }}
                onClick={() => {
                  if (currentAkashaUser === null) {
                    setShowAkashaModal(true);
                  }
                }}
              >
                New Post
              </ZuButton>
            </Link>
          </Stack>
        </Container>
      </Box>

      <Container>
        {/* Topics */}
        <TopicList
          selectedTopics={selectedTopics}
          setSelectedTopics={setSelectedTopics}
        />

        {/* Sort */}
        <SortList
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />

        {/* Posts */}
        <Stack direction="column" spacing="10px">
          {errorMessage ? (
            <Typography color="error" variant="h6" alignSelf="center">
              {errorMessage}
            </Typography>
          ) : null}
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </Stack>

        {/* Pagination */}
        {hasMoreBeams ? (
          <Stack direction="row" justifyContent="center" spacing="10px">
            <ZuButton
              sx={{ width: '150px', display: 'flex', gap: '10px' }}
              onClick={handleLoadMoreBeams}
            >
              {isLoadingBeams ? (
                <>
                  <CircularProgress size="20px" color="info" />
                  Loading...
                </>
              ) : (
                <>Load More</>
              )}
            </ZuButton>
          </Stack>
        ) : null}

        {showAkashaModal && (
          <AkashaConnectModal
            showModal={showAkashaModal}
            setShowModal={setShowAkashaModal}
            onSuccess={() => handleSignInUser()}
          />
        )}
      </Container>
    </>
  );
};

export default DiscussionsHome;
