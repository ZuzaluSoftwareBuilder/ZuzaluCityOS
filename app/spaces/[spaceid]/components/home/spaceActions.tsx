import { Space } from '@/types';
import { addToast, Button, Skeleton } from '@heroui/react';
import { ArrowSquareRight, Heart } from '@phosphor-icons/react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followSpace, unFollowSpace } from '@/services/member';
import Copy from '@/components/biz/copy';
import { CheckCircleIcon } from '@/components/icons';
import {
  CommonModalHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/base';
import useOpenDraw from '@/hooks/useOpenDraw';
import { useEffect, useMemo, useState } from 'react';

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
  const { open, handleOpen, handleClose } = useOpenDraw();

  const [showButtonsSkeleton, setShowButtonsSkeleton] = useState(true);
  const [showButtons, setShowButtons] = useState(false);

  const isLoggedIn = useMemo(() => {
    return isAuthenticated && !!profile;
  }, [isAuthenticated, profile]);

  // hack: handle not login case
  useEffect(() => {
    setTimeout(() => {
      if (!isLoggedIn) {
        setShowButtonsSkeleton(false);
      }
    }, 1500);
  }, []);

  useEffect(() => {
    if (isUserSpaceFetched && isLoggedIn && spaceData) {
      setShowButtons(true);
    }
    if (isUserSpaceFetched) {
      setShowButtonsSkeleton(false);
    }
  }, [isUserSpaceFetched, isLoggedIn, spaceData]);

  const showFollowButton = useMemo(() => {
    return !isUserJoined;
  }, [isUserJoined]);

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
      handleClose();
    },
    onError: (error: Error) => {
      console.error(error);
      addToast({
        title: error.message || 'Fail to unfollow',
        color: 'danger',
      });
    },
  });

  const isFollowPending = followMutation.isPending;

  const onFollow = async () => {
    if (!isAuthenticated || !profile?.author?.id) {
      showAuthPrompt('connectButton');
      return;
    }

    if (isFollowPending) {
      return;
    }

    if (isUserFollowed) {
      handleOpen();
    } else {
      followMutation.mutate();
    }
  };

  const confirmUnFollow = () => {
    unfollowMutation.mutate();
  };

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
          </>
        ) : null}

        <Copy text={shareUrl!} />
      </div>

      <Modal isOpen={open} hideCloseButton onOpenChange={handleOpen}>
        <ModalContent>
          <CommonModalHeader
            title="UnFollow Confirm"
            onClose={handleClose}
            isDisabled={unfollowMutation.isPending}
          />
          <ModalBody className="gap-5 p-[0_20px]">
            <p className="text-sm text-white/70">
              unfollow space {spaceData?.name}
            </p>
          </ModalBody>
          <ModalFooter className="p-[20px]">
            <div className="flex w-full justify-between gap-2.5">
              <Button
                className="h-[38px] flex-1 border border-[rgba(255,255,255,0.1)] bg-transparent font-bold text-white"
                radius="md"
                onPress={handleClose}
                disabled={unfollowMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="h-[38px] flex-1 border border-[rgba(255,94,94,0.2)] bg-[rgba(255,94,94,0.1)] font-bold text-[#FF5E5E]"
                radius="md"
                onPress={confirmUnFollow}
                isLoading={unfollowMutation.isPending}
                disabled={unfollowMutation.isPending}
              >
                UnFollow
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SpaceActions;
