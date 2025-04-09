import { Space } from '@/types';
import { addToast, Button, Skeleton } from '@heroui/react';
import { ArrowSquareRight, Heart } from '@phosphor-icons/react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followSpace, unFollowSpace } from '@/services/member';
import Copy from '@/components/biz/copy';
import { CheckCircleIcon } from '@/components/icons';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModal } from '@/context/ModalContext';

interface SpaceActionsProps {
  spaceData?: Space;
  spaceId: string;
  isUserJoined: boolean;
  isUserFollowed: boolean;
  isUserSpaceFetched: boolean;
  shareUrl?: string;
  onJoin: () => void;
  className?: string;
  isMobile?: boolean;
}

const SpaceActions = ({
  spaceData,
  spaceId,
  isUserJoined,
  isUserFollowed,
  isUserSpaceFetched,
  shareUrl,
  onJoin,
  className,
  isMobile = false,
}: SpaceActionsProps) => {
  const { profile, isAuthenticated, showAuthPrompt } = useCeramicContext();
  const queryClient = useQueryClient();
  const { showModal } = useModal();

  const [showButtonsSkeleton, setShowButtonsSkeleton] = useState(true);
  const [showButtons, setShowButtons] = useState(false);

  const isLoggedIn = isAuthenticated && !!profile;

  // hack: handle not login case
  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) {
        setShowButtonsSkeleton(false);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    if (isUserSpaceFetched && isLoggedIn && spaceData) {
      setShowButtons(true);
    }
    if (isUserSpaceFetched) {
      setShowButtonsSkeleton(false);
    }
  }, [isUserSpaceFetched, isLoggedIn, spaceData]);

  const showFollowButton = !isUserJoined;

  const showJoinButton = useMemo(() => {
    return (
      spaceData?.gated === '0' ||
      (spaceData?.spaceGating?.edges?.length ?? 0) > 0
    );
  }, [spaceData?.gated, spaceData?.spaceGating?.edges?.length]);

  const followMutation = useMutation({
    mutationFn: () => followSpace(spaceId, profile!.author!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GET_USER_ROLES_QUERY'],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      addToast({
        title: error.message || 'Fail to follow',
        color: 'danger',
      });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unFollowSpace(spaceId, profile!.author!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['GET_USER_ROLES_QUERY'],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      addToast({
        title: error.message || 'Fail to unfollow',
        color: 'danger',
      });
      return Promise.reject(error);
    },
  });

  const isFollowPending = followMutation.isPending;

  const onFollow = useCallback(async () => {
    if (!isAuthenticated || !profile?.author?.id) {
      showAuthPrompt('connectButton');
      return;
    }

    if (isFollowPending) {
      return;
    }

    if (isUserFollowed) {
      showModal({
        title: 'Unfollow Confirm',
        contentText: `unfollow space ${spaceData?.name}`,
        confirmAction: () => {
          return new Promise<void>((resolve, reject) => {
            unfollowMutation.mutate(undefined, {
              onSuccess: () => {
                resolve();
              },
              onError: (error) => {
                reject(error);
              },
            });
          });
        },
      });
    } else {
      followMutation.mutate();
    }
  }, [
    followMutation,
    isAuthenticated,
    isFollowPending,
    isUserFollowed,
    profile?.author?.id,
    showAuthPrompt,
    showModal,
    spaceData?.name,
    unfollowMutation,
  ]);

  return (
    <>
      <div className={className}>
        {showButtons ? (
          <>
            {showFollowButton && (
              <Button
                startContent={
                  isFollowPending ? null : (
                    <Heart
                      weight={isUserFollowed ? 'fill' : 'light'}
                      format="Stroke"
                      size={20}
                      className={isMobile ? 'shrink-0' : ''}
                    />
                  )
                }
                onPress={onFollow}
                isLoading={isFollowPending}
                isDisabled={isFollowPending}
                className={isMobile ? 'w-full flex-1 shrink-0' : ''}
              >
                {isUserFollowed ? 'Following' : 'Follow'}
              </Button>
            )}
            {showJoinButton && (
              <Button
                startContent={
                  isUserJoined ? (
                    <CheckCircleIcon size={5} />
                  ) : (
                    <ArrowSquareRight
                      weight="fill"
                      format="Stroke"
                      size={20}
                      className={isMobile ? 'shrink-0' : ''}
                    />
                  )
                }
                onPress={onJoin}
                className={isMobile ? 'w-full flex-1 shrink-0' : ''}
              >
                {isUserJoined ? 'Joined' : 'Join Community'}
              </Button>
            )}
          </>
        ) : showButtonsSkeleton ? (
          <>
            <Skeleton className="h-[40px] w-[100px] rounded-[8px] mobile:w-full" />
            <Skeleton className="h-[40px] w-[168px] rounded-[8px] mobile:hidden" />
          </>
        ) : null}

        <Copy text={shareUrl!} />
      </div>
    </>
  );
};

export default SpaceActions;
