'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Stack, Alert, Snackbar } from '@mui/material';
import dynamic from 'next/dynamic';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLitContext } from '@/context/LitContext';
import { ConfigPanel } from '../adminevents/[eventid]/Tabs/Ticket/components/Common';
import { ZulandReadableBeam } from '@/types/akasha';
import { getZulandReadableBeams, getAppByEventId } from '@/utils/akasha';
import { akashaBeamToMarkdown, Post } from '@/utils/akasha/beam-to-post';

const CreateDiscussionModal = dynamic(
  () => import('@/components/modals/Zuland/CreateDiscussionModal'),
  { ssr: false },
);
const DiscussionsHome = dynamic(
  () => import('@/components/zuland/DiscussionsHome'),
  { ssr: false },
);
const PostDetails = dynamic(() => import('@/components/zuland/PostDetails'), {
  ssr: false,
});
const NewPost = dynamic(() => import('@/components/zuland/NewPost'), {
  ssr: false,
});
const Container = dynamic(() => import('@/components/zuland/Container'), {
  ssr: false,
});

export default function ZulandPage() {
  const params = useParams();
  const spaceId = params.spaceid as string;
  const queryClient = useQueryClient();
  const { currentAkashaUser } = useAkashaAuthStore();
  const { litConnect, isConnected } = useLitContext();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [appChecked, setAppChecked] = useState(false);
  const [appExists, setAppExists] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('info');
  const [showToast, setShowToast] = useState(false);

  const [selectedSort, setSelectedSort] = useState<string>('NEW');
  const [beams, setBeams] = useState<Array<ZulandReadableBeam> | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNewPostOpen, setIsNewPostOpen] = useQueryState('newPost', {
    defaultValue: '',
  });
  const [postId, setPostId] = useQueryState('postId', {
    defaultValue: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleShowToast = (
    text: string,
    severity: 'success' | 'error' | 'info' | 'warning',
  ) => {
    setToastMessage(text);
    setToastSeverity(severity);
    setShowToast(true);
  };

  useEffect(() => {
    litConnect();
  }, [litConnect]);

  useEffect(() => {
    const checkAppExists = async () => {
      try {
        const appAlreadyExists = await getAppByEventId(spaceId);
        if (appAlreadyExists) {
          setAppExists(true);
        }
      } catch (error) {
        console.error('Error checking app:', error);
      }
      setAppChecked(true);
    };
    checkAppExists();
  }, [spaceId]);

  const {
    data: beamsData,
    fetchNextPage,
    hasNextPage: hasMoreBeams,
    isLoading: isLoadingBeams,
    isFetching: isFetchingBeams,
    error,
  } = useInfiniteQuery({
    queryKey: ['beams', spaceId],
    enabled: isConnected && appExists,
    queryFn: async ({ pageParam }) => {
      /*const isUserOkay = await hasUserTicketPermissions(spaceId);
      if (isUserOkay) {
        const readableBeams = await getZulandReadableBeams(spaceId, {
          first: 10,
          after: pageParam,
        });
        return readableBeams;
      } else {
        setErrorMessage('You dont have access');
        return {
          edges: [],
          pageInfo: {
            startCursor: null,
            endCursor: null,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }
    }*/
      const readableBeams = await getZulandReadableBeams(spaceId, {
        first: 10,
        after: pageParam,
      });
      return readableBeams;
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });

  const loadMoreBeams = () => {
    if (hasMoreBeams) {
      fetchNextPage();
    }
  };

  const selectedPost = posts.find((post) => post.id === postId);

  const getSortedPosts = (inputPosts: Post[], sort: string): Post[] => {
    if (sort === 'NEW' || sort === 'OLDEST') {
      const sortedPosts = [...inputPosts].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return selectedSort === 'OLDEST'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });
      return sortedPosts;
    }
    return inputPosts;
  };

  useEffect(() => {
    if (beamsData) {
      const allBeams: ZulandReadableBeam[] = [];
      beamsData.pages.forEach((page) => {
        if (page.edges) {
          page.edges.forEach((edge) => {
            allBeams.push(edge.node);
          });
        }
      });
      setBeams(allBeams);
      const newPosts = akashaBeamToMarkdown(allBeams, spaceId);
      const sortedPosts = getSortedPosts(newPosts, selectedSort);
      setPosts(sortedPosts);
    }
  }, [beamsData, selectedSort, spaceId]);

  const handleNewPostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['beams', spaceId] });
    setIsNewPostOpen('');
  };

  if (!appChecked) {
    return <div>Checking application...</div>;
  }

  return (
    <Stack direction="row" width={'100%'} height={'100%'}>
      <Stack width="100%" position="relative">
        {!appExists ? (
          <ConfigPanel
            title="Configure Space Zuland"
            desc="You need to setup initial configurations"
            sx={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(44, 44, 44, 0.80)',
              width: '600px',
              position: 'absolute',
              top: '40%',
              left: '50%',
              zIndex: 100,
              transform: 'translate(-50%, -50%)',
            }}
            handleOpen={() => setShowCreateModal(true)}
          />
        ) : (
          <Stack
            justifyContent="center"
            alignItems="center"
            bgcolor="#222222"
            width="100%"
          >
            {postId && selectedPost ? (
              <Container>
                <PostDetails
                  postId={postId}
                  discussion={selectedPost}
                  eventId={spaceId}
                />
              </Container>
            ) : isNewPostOpen !== '' && currentAkashaUser ? (
              <Container>
                <NewPost
                  eventId={spaceId}
                  onCancel={() => setIsNewPostOpen('')}
                  onPostCreated={handleNewPostCreated}
                />
              </Container>
            ) : (
              <DiscussionsHome
                eventId={spaceId}
                posts={posts}
                isLoadingBeams={isLoadingBeams || isFetchingBeams}
                setIsNewPostOpen={setIsNewPostOpen}
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                loadMoreBeams={loadMoreBeams}
                hasMoreBeams={hasMoreBeams}
                errorMessage={errorMessage}
              />
            )}
          </Stack>
        )}

        <CreateDiscussionModal
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
          showToast={handleShowToast}
          resourceId={spaceId}
          resourceType="spaces"
          resourceName="Zuland Discussion"
          resourceDescription="A place for discussion"
        />

        <Snackbar
          open={showToast}
          autoHideDuration={6000}
          onClose={() => setShowToast(false)}
        >
          <Alert severity={toastSeverity}>{toastMessage}</Alert>
        </Snackbar>
      </Stack>
    </Stack>
  );
}
