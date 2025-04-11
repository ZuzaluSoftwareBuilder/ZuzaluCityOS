'use client';

import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import { useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import Container from '@/components/zuland/Container';
import DiscussionsHome from '@/components/zuland/DiscussionsHome';
import NewPost from '@/components/zuland/NewPost';
import PostDetails from '@/components/zuland/PostDetails';
import { ZulandReadableBeam } from '@/types/akasha';
import {
  getZulandReadableBeams,
  hasUserTicketPermissions,
} from '@/utils/akasha';
import { akashaBeamToMarkdown, Post } from '@/utils/akasha/beam-to-post';
import { ZulandLit } from '@/utils/lit';
import { Stack } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function SimplestZuland() {
  const params = useParams();
  const spaceId = params.spaceid as string;

  const queryClient = useQueryClient();
  const { currentAkashaUser } = useAkashaAuthStore();

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

  const {
    data: beamsData,
    fetchNextPage,
    hasNextPage: hasMoreBeams,
    isLoading: isLoadingBeams,
    isFetching: isFetchingBeams,
    error,
  } = useInfiniteQuery({
    queryKey: ['beams', spaceId],
    queryFn: async ({ pageParam }) => {
      const zulandLit = new ZulandLit();
      await zulandLit.connect();
      await zulandLit.disconnect();

      const isUserOkay = await hasUserTicketPermissions(spaceId);
      if (isUserOkay) {
        const readableBeams = await getZulandReadableBeams(spaceId, {
          first: 10,
          after: pageParam,
        });
        pageParam = readableBeams.pageInfo.endCursor ?? '';
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
      // Get the last page from the data
      const lastPage = beamsData.pages[beamsData.pages.length - 1];
      // Process only the beams from the last page
      const lastPageBeams = lastPage.edges
        ? lastPage.edges.map((edge) => edge.node)
        : [];
      setBeams(lastPageBeams);
      const newPosts = akashaBeamToMarkdown(lastPageBeams, spaceId);
      const sortedPosts = getSortedPosts(newPosts, selectedSort);
      setPosts(sortedPosts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beamsData]);

  useEffect(() => {
    const sortedPosts = getSortedPosts(posts, selectedSort);
    setPosts(sortedPosts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort]);

  const handleNewPostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['beams', spaceId] });
    setIsNewPostOpen('');
  };

  return (
    <>
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
    </>
  );
}
