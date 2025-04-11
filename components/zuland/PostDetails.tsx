'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { ZuButton } from '@/components/core';
import Drawer from '@/components/drawer';
import ReportPostModal from '@/components/modals/Zuland/ReportPostModal';
import ShareModal from '@/components/modals/Zuland/ShareModal';
import CommentDetails from './CommentDetails';
import DiscussionSidebar from './DiscussionSidebar';
import ReplyForm from './ReplyForm';
import SortList from './SortList';
import TopicChip from './TopicChip';

import { ZulandReadableReflection } from '@/types/akasha';
import {
  createZulandReflection,
  encodeSlateToBase64,
  getTopReadableReflectionsByBeamId,
  standardDateFormat,
} from '@/utils/akasha';
import { buildIpfsUrl, Post } from '@/utils/akasha/beam-to-post';

import {
  ArrowUpOnSquareIcon,
  ChatBubbleIcon,
  FlagIcon,
} from '@/components/icons';
import { IPublishData } from '@akashaorg/typings/lib/ui';
import ReadOnlyEditor from './ReadOnlyEditor';

interface PostDetailsProps {
  postId: string;
  discussion: Post;
  eventId: string;
}

const PostDetails: React.FC<PostDetailsProps> = ({
  postId,
  discussion,
  eventId,
}) => {
  const queryClient = useQueryClient();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedReflectionsSort, setSelectedReflectionsSort] =
    useState<string>('NEW');
  const [openReportModal, setOpenReportModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);

  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyFormRef = useRef<HTMLDivElement>(null);

  const [openProfileDrawer, setOpenProfileDrawer] = useState<boolean>(false);

  const [reflectionCount, setReflectionCount] = useState<number>(0);
  const [reflections, setReflections] = useState<ZulandReadableReflection[]>(
    [],
  );

  const {
    data: reflectionsData,
    fetchNextPage,
    hasNextPage: hasMoreReflections,
    isLoading: isLoadingReflections,
    isFetching: isFetchingReflections,
  } = useInfiniteQuery({
    queryKey: ['reflections', postId],
    queryFn: async ({ pageParam }) => {
      if (!postId) return null;
      const reflections = await getTopReadableReflectionsByBeamId(postId, {
        first: 3,
        after: pageParam,
      });
      pageParam = reflections?.reflections.pageInfo.endCursor ?? '';
      setReflectionCount(reflections?.reflectionsCount ?? 0);
      return reflections;
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage?.reflections.pageInfo.hasNextPage
        ? lastPage.reflections.pageInfo.endCursor
        : undefined,
  });

  const allReflections = useMemo(
    () =>
      reflectionsData?.pages.flatMap(
        (page) =>
          page?.reflections.edges
            .map((edge) => edge?.node)
            .filter(
              (node): node is ZulandReadableReflection => node !== null,
            ) ?? [],
      ),
    [reflectionsData],
  );

  useEffect(() => {
    const sortedReflections = reflections.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return selectedReflectionsSort === 'OLDEST'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    setReflections(sortedReflections);
  }, [selectedReflectionsSort, reflections]);

  const handleShare = () => {
    if (isMobile && navigator.share) {
      navigator
        .share({
          title: discussion?.title,
          text: 'Check out this discussion!',
          url: window.location.href,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      setOpenShareModal(true);
    }
  };

  const handleReplyClick = () => {
    setShowReplyForm(true);
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }, 0);
  };

  const handleReplySubmit = async (
    editorContents: IPublishData[],
    topics: string[],
    parentReflectionId: string = '',
  ) => {
    setShowReplyForm(false);
    const blocks = editorContents.map((content, index) => ({
      label: `@bg/zuland/reflection-${index + 1}`,
      propertyType: 'slate-block',
      value: encodeSlateToBase64(content.slateContent),
    }));

    try {
      await createZulandReflection({
        beamID: postId,
        createdAt: new Date().toISOString(),
        active: true,
        tags: topics,
        isReply: parentReflectionId !== '' ? true : null,
        reflection: parentReflectionId !== '' ? parentReflectionId : null,
        content: [...blocks],
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['reflections', postId] });
      queryClient.invalidateQueries({ queryKey: ['beams', eventId] });
      if (parentReflectionId) {
        queryClient.invalidateQueries({
          queryKey: ['childReflections', parentReflectionId],
        });
      }
    } catch (error) {
      console.error('Error creating reflection:', error);
    }
  };

  const toggleProfileDrawer = () => setOpenProfileDrawer((v) => !v);

  const loadMoreReflections = () => {
    if (hasMoreReflections) {
      fetchNextPage();
    }
  };

  return (
    <div>
      {/* Profile Sidebar */}
      <Drawer
        open={openProfileDrawer}
        onClose={toggleProfileDrawer}
        onOpen={toggleProfileDrawer}
      >
        <DiscussionSidebar
          discussion={discussion}
          handleClose={toggleProfileDrawer}
        />
      </Drawer>
      <Stack spacing={3} sx={{ width: '100%' }}>
        <Typography variant="h4">{discussion?.title}</Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={toggleProfileDrawer}
        >
          <Avatar
            src={buildIpfsUrl(
              discussion?.author.akashaProfile?.avatar?.default.src,
            )}
            alt={discussion?.author.akashaProfile?.name}
            sx={{ width: 32, height: 32 }}
          />
          <Stack direction="column" justifyContent="space-around">
            <Typography variant="body2">
              {discussion?.author.akashaProfile?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {standardDateFormat(discussion.createdAt)}
            </Typography>
          </Stack>
        </Stack>

        {/* Readonly Slate React Editor */}
        {discussion?.originalContent && (
          <ReadOnlyEditor content={discussion.originalContent} />
        )}

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {discussion?.tags?.map((tag, index) => (
            <TopicChip key={index} label={tag} selected={false} />
          ))}
        </Box>

        {/* Actions */}
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={1}>
            <ZuButton
              onClick={() => setOpenReportModal(true)}
              sx={{
                color: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 20px',
                fontSize: '14px',
                fontWeight: '700',
                gap: '10px',
                '& > span': {
                  margin: '0px',
                },
              }}
            >
              <FlagIcon size={4} />
              Report
            </ZuButton>
            <ZuButton
              onClick={handleShare}
              sx={{
                color: 'white',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 20px',
                fontSize: '14px',
                fontWeight: '700',
                gap: '10px',
                '& > span': {
                  margin: '0px',
                },
              }}
            >
              <ArrowUpOnSquareIcon size={4} />
              Share
            </ZuButton>
          </Stack>
          <ZuButton
            onClick={handleReplyClick}
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
            Reply
          </ZuButton>
        </Stack>

        {/* Reply Form */}
        {showReplyForm && (
          <div>
            <ReplyForm
              eventId={eventId}
              onCancel={() => setShowReplyForm(false)}
              onReplySubmit={handleReplySubmit}
            />
            <div ref={replyFormRef} />
          </div>
        )}

        {/* Report Modal */}
        <ReportPostModal
          openReportModal={openReportModal}
          setOpenReportModal={setOpenReportModal}
        />

        {/* Share Modal */}
        <ShareModal
          discussionTitle={discussion?.title}
          openShareModal={openShareModal}
          setOpenShareModal={setOpenShareModal}
        />

        {/* Reply count and sort list section */}
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent="space-between"
          sx={{ flexGrow: 1, flexWrap: 'wrap' }}
        >
          <Stack direction="row" alignItems="center">
            <IconButton size="medium" sx={{ color: 'white' }}>
              <ChatBubbleIcon size={6} />
            </IconButton>
            <Typography variant="body1">
              {reflectionCount} {reflectionCount === 1 ? 'Reply' : 'Replies'}
            </Typography>
          </Stack>

          <SortList
            selectedSort={selectedReflectionsSort}
            setSelectedSort={setSelectedReflectionsSort}
          />
        </Stack>
        <Divider />

        {/* Existing replies */}
        <Stack spacing={3}>
          {allReflections
            ? allReflections.map((reflection) => (
                <CommentDetails
                  key={`${reflection.id}-${reflection.createdAt}`}
                  eventId={eventId}
                  reflection={reflection}
                  onReplySubmit={handleReplySubmit}
                />
              ))
            : null}
        </Stack>

        {/* Pagination */}
        <Stack direction="row" justifyContent="center" spacing="10px">
          <ZuButton
            sx={{ width: '150px', display: 'flex', gap: '10px' }}
            onClick={loadMoreReflections}
            disabled={
              !hasMoreReflections ||
              isLoadingReflections ||
              isFetchingReflections
            }
          >
            {isLoadingReflections || isFetchingReflections ? (
              <>
                <CircularProgress size="20px" color="info" />
                Loading...
              </>
            ) : hasMoreReflections ? (
              <>Load More</>
            ) : (
              <>No More Replies</>
            )}
          </ZuButton>
        </Stack>
      </Stack>
    </div>
  );
};

export default PostDetails;
