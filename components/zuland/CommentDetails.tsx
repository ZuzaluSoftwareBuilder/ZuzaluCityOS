import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useMemo, useRef, useState } from 'react';

import { ZuButton } from '@/components/core';
import { ZulandReadableReflection } from '@/types/akasha';
import {
  getReadableReflectionsByReflectionId,
  standardDateFormat,
} from '@/utils/akasha';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { ChatBubbleIcon } from '@/components/icons';
import { buildIpfsUrl } from '@/utils/akasha/beam-to-post';
import { IPublishData } from '@akashaorg/typings/lib/ui';
import ReadOnlyEditor from './ReadOnlyEditor';
import ReplyForm from './ReplyForm';

interface CommentDetailsProps {
  eventId: string;
  reflection: ZulandReadableReflection;
  onReplySubmit: (
    content: IPublishData[],
    topics: string[],
    parentReflectionId?: string,
  ) => void;
}

const CommentDetails: React.FC<CommentDetailsProps> = ({
  eventId,
  reflection,
  onReplySubmit,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyFormRef = useRef<HTMLDivElement>(null);

  const {
    data: childReflectionsData,
    fetchNextPage,
    hasNextPage: hasMoreChildReflections,
    isLoading: isLoadingChildReflections,
    isFetching: isFetchingChildReflections,
    error,
  } = useInfiniteQuery({
    queryKey: ['childReflections', reflection.id],
    queryFn: async ({ pageParam }) => {
      try {
        const childReflections = await getReadableReflectionsByReflectionId(
          reflection.id,
          {
            first: 5,
            after: pageParam,
          },
        );
        pageParam = childReflections?.pageInfo?.endCursor ?? '';
        return childReflections;
      } catch (error) {
        console.error('Error getting child reflections:', error);
        return {
          pageInfo: null,
          edge: [],
        };
      }
    },
    initialPageParam: '',
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo?.hasNextPage ? lastPage.pageInfo.endCursor : undefined,
  });

  const childReflections = useMemo(
    () =>
      childReflectionsData?.pages.flatMap((page) =>
        page.edge.map((edge) => edge.node),
      ),
    [childReflectionsData],
  );

  const handleReplyClick = () => {
    setShowReplyForm(true);
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }, 0);
  };

  const handleReplySubmit = (
    content: IPublishData[],
    topics: string[],
    parentReflectionId?: string,
  ) => {
    onReplySubmit(content, topics, parentReflectionId ?? reflection.id);
    setShowReplyForm(false);
  };

  const loadMoreChildReflections = () => {
    if (hasMoreChildReflections) {
      fetchNextPage();
    }
  };

  return (
    <Box flexGrow={1} sx={{ padding: '10px 0px' }}>
      <Stack spacing={2} sx={{ marginLeft: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            src={reflection.author.akashaProfile?.avatar?.default.src}
            alt={reflection.author.akashaProfile?.name}
            sx={{ width: 32, height: 32 }}
          />
          <Stack>
            <Typography variant="body2">
              {reflection.author.akashaProfile?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {standardDateFormat(reflection.createdAt)}
            </Typography>
          </Stack>
        </Stack>
        {reflection.content.map((block, key) => {
          switch (block.propertyType) {
            case 'slate-block':
              return (
                <>
                  {typeof block.value === 'string' ? (
                    <Typography key={key} variant="body1">
                      {block.value}
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        padding: '0px 25px',
                        minHeight: '55px',
                        color: 'grey.500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '6',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {block.value && <ReadOnlyEditor content={block.value} />}
                    </Box>
                  )}
                </>
              );
            case 'image-block':
              return (
                typeof block.value !== 'string' && (
                  <Image
                    key={key}
                    src={buildIpfsUrl(block.value.images[0].src)}
                    alt={block.value.caption ?? ''}
                    width={block.value.images[0].size.width}
                    height={block.value.images[0].size.height}
                  />
                )
              );
            default:
              return `Unable to render block of type ${(block as any).propertyType}`;
          }
        })}
        <Stack direction="row" spacing={2}>
          <ZuButton
            onClick={handleReplyClick}
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
            <ChatBubbleIcon size={4} />
            Reply
          </ZuButton>
        </Stack>
        {showReplyForm && (
          <div>
            <ReplyForm
              eventId={eventId}
              onCancel={() => setShowReplyForm(false)}
              onReplySubmit={handleReplySubmit}
              replyingTo={reflection.author.akashaProfile?.name}
            />
            <div ref={replyFormRef} />
          </div>
        )}
        {childReflections && childReflections.length > 0 && (
          <Stack spacing={1}>
            {childReflections.map((childReflection) => (
              <Stack
                key={childReflection.id}
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{
                  backgroundColor: 'rgba(215, 255, 196, 0.05)',
                }}
              >
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ ml: 1, width: 2 }}
                  color="#D7FFC4"
                />
                <CommentDetails
                  key={`${childReflection.id}-${childReflection.createdAt}`}
                  eventId={eventId}
                  reflection={childReflection}
                  onReplySubmit={(content, topics) =>
                    handleReplySubmit(content, topics, childReflection.id)
                  }
                />
              </Stack>
            ))}
            {(hasMoreChildReflections ||
              isLoadingChildReflections ||
              isFetchingChildReflections) && (
              <Stack direction="row" justifyContent="center" spacing="10px">
                <ZuButton
                  sx={{
                    width: '150px',
                    display: 'flex',
                    gap: '10px',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '4px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    '& > span': {
                      margin: '0px',
                    },
                  }}
                  onClick={loadMoreChildReflections}
                  disabled={
                    !hasMoreChildReflections ||
                    isLoadingChildReflections ||
                    isFetchingChildReflections
                  }
                >
                  {isLoadingChildReflections || isFetchingChildReflections ? (
                    <div>
                      <CircularProgress size="20px" color="info" />
                      <Typography variant="body2" color="white">
                        Loading...
                      </Typography>
                    </div>
                  ) : hasMoreChildReflections ? (
                    <>Load More</>
                  ) : (
                    <>No More Replies</>
                  )}
                </ZuButton>
              </Stack>
            )}
          </Stack>
        )}
        <Divider />
      </Stack>
    </Box>
  );
};

export default CommentDetails;
