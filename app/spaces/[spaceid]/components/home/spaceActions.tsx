import Copy from '@/components/biz/common/Copy';
import { CheckCircleIcon } from '@/components/icons';
import { followSpace, unFollowSpace } from '@/services/member';
import { addToast, Skeleton } from '@heroui/react';
import { ArrowSquareRight, Heart } from '@phosphor-icons/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/base';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useModal } from '@/context/ModalContext';
import { Space } from '@/models/space';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const { profile, isAuthenticated, showAuthPrompt } = useAbstractAuthContext();
  // TODO wait supabase update , confirm did of space
  const userDid = profile?.did;
  const queryClient = useQueryClient();
  const { showModal } = useModal();

  const [uiState, setUiState] = useState<'loading' | 'buttons' | ''>('loading');

  const isLoggedIn = isAuthenticated && !!profile;

  useEffect(() => {
    if (isUserSpaceFetched && isLoggedIn && spaceData) {
      setUiState('buttons');
    } else if (isUserSpaceFetched) {
      setUiState('');
    }
  }, [isUserSpaceFetched, isLoggedIn, spaceData]);

  useEffect(() => {
    if (!isLoggedIn) {
      const timer = setTimeout(() => setUiState(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const showFollowButton = !isUserJoined;

  const showJoinButton = useMemo(() => {
    return (
      spaceData?.gated === '0' || (spaceData?.spaceGating?.length ?? 0) > 0
    );
  }, [spaceData?.gated, spaceData?.spaceGating?.length]);

  const followMutation = useMutation({
    mutationFn: () => followSpace(spaceId, userDid!),
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
    mutationFn: () => unFollowSpace(spaceId, userDid!),
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
    if (!isAuthenticated || !userDid) {
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
        confirmAction: () => unfollowMutation.mutateAsync(),
      });
    } else {
      followMutation.mutate();
    }
  }, [
    followMutation,
    isAuthenticated,
    isFollowPending,
    isUserFollowed,
    userDid,
    showAuthPrompt,
    showModal,
    spaceData?.name,
    unfollowMutation,
  ]);

  return (
    <>
      <div className={className}>
        {uiState === 'buttons' ? (
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
                isDisabled={isUserJoined}
                onPress={onJoin}
                className={isMobile ? 'w-full flex-1 shrink-0' : ''}
              >
                {isUserJoined ? 'Joined' : 'Join Community'}
              </Button>
            )}
          </>
        ) : uiState === 'loading' ? (
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
