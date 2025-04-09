'use client';
import { Space } from '@/types';
import {
  addToast,
  Avatar,
  cn,
  Image,
  Skeleton,
  useDisclosure,
} from '@heroui/react';
import {
  Button,
  CommonModalHeader,
  Modal,
  ModalFooter,
  ModalBody,
} from '@/components/base';
import { ArrowSquareRight, Heart, Users } from '@phosphor-icons/react';
import useGetShareLink from '@/hooks/useGetShareLink';
import { useParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import useUserSpace from '@/hooks/useUserSpace';
import { CheckCircleIcon } from '@/components/icons';
import { formatMemberCount } from '@/app/components/SpaceCard';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followSpace, unFollowSpace } from '@/services/member';
import Copy from '@/components/biz/copy';
import EditorProWithMore from './EditorProWithMore';
import { Categories } from '@/app/spaces/create/components/constant';
import { ModalContent } from '@/components/base/modal';
import useOpenDraw from '@/hooks/useOpenDraw';
import { JoinSpaceNoGate, JoinSpaceWithGate } from './modal/joinSpace';

export interface SpaceSectionProps {
  spaceData?: Space;
  isLoading: boolean;
}

const SpaceSection = ({ spaceData }: SpaceSectionProps) => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';
  const { profile, isAuthenticated, showAuthPrompt } = useCeramicContext();
  const queryClient = useQueryClient();
  const { open, handleOpen, handleClose } = useOpenDraw();

  const { userJoinedSpaceIds, userFollowedSpaceIds, isUserSpaceFetched } =
    useUserSpace();
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();

  const formattedMemberCount = useMemo(() => {
    const totalMembers =
      spaceData?.userRoles?.edges.map((item) => item.node).length ?? 0;
    return formatMemberCount(totalMembers + 1);
  }, [spaceData?.userRoles]);

  const { isUserJoined, isUserFollowed } = useMemo(() => {
    const isUserFollowed = userFollowedSpaceIds.has(spaceId);
    const isUserJoined = userJoinedSpaceIds.has(spaceId) && !isUserFollowed;
    return { isUserJoined, isUserFollowed };
  }, [spaceId, userJoinedSpaceIds, userFollowedSpaceIds]);

  const isLoggedIn = useMemo(() => {
    return isAuthenticated && !!profile;
  }, [isAuthenticated, profile]);

  const showActionButtons = useMemo(() => {
    if (isLoggedIn) {
      return true;
    } else {
      return isUserSpaceFetched;
    }
  }, [isLoggedIn, isUserSpaceFetched]);

  const showFollowButton = useMemo(() => {
    return !isUserJoined;
  }, [isUserJoined]);

  const showJoinButton = useMemo(() => {
    return (
      spaceData?.gated === '0' ||
      (spaceData?.spaceGating?.edges?.length ?? 0) > 0
    );
  }, [spaceData?.gated, spaceData?.spaceGating?.edges?.length]);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: spaceData?.name });

  const onJoin = useCallback(() => {
    if (!isUserJoined) {
      onOpen();
    }
  }, [onOpen, isUserJoined]);

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

  if (!spaceData) {
    return <SpaceHomeSkeleton />;
  }

  return (
    <div className="flex flex-col border-b border-[rgba(255,255,255,0.10)] bg-[#2C2C2C] p-[20px] backdrop-blur-[20px] mobile:p-[14px]">
      {spaceData.gated === '1' ? (
        <JoinSpaceWithGate
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />
      ) : (
        <JoinSpaceNoGate
          isOpen={isOpen}
          onClose={onClose}
          onOpenChange={onOpenChange}
        />
      )}
      <div className="relative">
        <Image
          src={spaceData.banner}
          alt={spaceData?.name}
          width={'100%'}
          height={'100%'}
          className="aspect-[3.4] rounded-[10px] object-cover mobile:aspect-[2.4]"
        />
        <Avatar
          src={spaceData.avatar}
          alt={spaceData?.name}
          icon={null}
          classNames={{
            base: [
              'box-content absolute bottom-[-30px] left-[27px] z-10',
              'size-[90px] rounded-full border-[4px] border-[#2E2E2E]',
              'mobile:size-[70px] mobile:bottom-[-40px] mobile:left-[17px]',
            ],
          }}
        />
      </div>

      {/* join/follow actions */}
      <div className="mt-[20px] flex justify-end gap-[10px] mobile:hidden">
        {showActionButtons ? (
          <>
            {showFollowButton && (
              <Button
                startContent={
                  isFollowPending ? null : (
                    <Heart
                      weight={isUserFollowed ? 'fill' : 'light'}
                      format="Stroke"
                      size={20}
                    />
                  )
                }
                onPress={onFollow}
                isLoading={isFollowPending}
                isDisabled={isFollowPending}
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
                    <ArrowSquareRight weight="fill" format="Stroke" size={20} />
                  )
                }
                onPress={onJoin}
              >
                {isUserJoined ? 'Joined' : 'Join Community'}
              </Button>
            )}
          </>
        ) : isLoggedIn ? (
          <>
            <Skeleton className="h-[40px] w-[100px] rounded-[8px]" />
          </>
        ) : null}

        <Copy text={shareUrl!} />
      </div>

      {/* space info: name/desc */}
      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <div className="flex items-center justify-start gap-[10px]">
          <SpaceChip category={spaceData?.category} />

          <div className="flex items-center gap-[6px] opacity-50">
            <Users weight="fill" format="Stroke" size={20} />
            <span className="text-[14px] leading-[1.4] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">
              {formattedMemberCount}
            </span>
          </div>
        </div>

        <p className="text-[25px] font-bold leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] mobile:text-[20px] ">
          {spaceData.name}
        </p>

        <EditorProWithMore
          value={spaceData.description}
          isEdit={false}
          className={{
            base: 'bg-transparent',
            editorWrapper: 'p-0',
          }}
          collapseHeight={150}
          defaultCollapsed={true}
        />
      </div>

      {/*tags*/}
      <div className="mt-[20px] flex flex-wrap gap-[6px]">
        {spaceData?.tags?.map((tag) => (
          <span
            key={tag.tag}
            className="text-[10px] leading-[1.2] text-white opacity-50 drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)]"
          >
            {tag.tag}
          </span>
        ))}
      </div>

      {/*Mobile join/share actions*/}
      <div className="mt-[10px] hidden justify-end gap-[10px] mobile:flex">
        {showActionButtons ? (
          <>
            {showFollowButton && (
              <Button
                startContent={
                  isFollowPending ? null : (
                    <Heart
                      weight={isUserFollowed ? 'fill' : 'light'}
                      format="Stroke"
                      size={20}
                      className="shrink-0"
                    />
                  )
                }
                onPress={onFollow}
                isLoading={isFollowPending}
                isDisabled={isFollowPending}
                className="w-full flex-1 shrink-0"
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
                      className="shrink-0"
                    />
                  )
                }
                className="w-full flex-1 shrink-0"
              >
                {isUserJoined ? 'Joined' : 'Join Community'}
              </Button>
            )}
          </>
        ) : isLoggedIn ? (
          <>
            <Skeleton className="h-[40px] w-full rounded-[8px]" />
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
    </div>
  );
};

const SpaceHomeSkeleton = () => {
  return (
    <div className="flex flex-col border-b border-[rgba(255,255,255,0.10)] bg-[#2C2C2C] p-[20px] backdrop-blur-[20px] mobile:p-[14px]">
      <div className="relative">
        <Skeleton className="relative aspect-[3.4] rounded-[10px] object-cover mobile:aspect-[2.4]" />
        <Skeleton
          className={cn(
            'box-content absolute bottom-[-30px] left-[27px] z-10',
            'size-[90px] rounded-full border-[4px] border-[#2E2E2E]',
            'mobile:size-[70px] mobile:bottom-[-40px] mobile:left-[17px]',
          )}
        />
      </div>

      <div className="mt-[20px] flex justify-end gap-[10px] mobile:hidden">
        <Skeleton className="h-[40px] w-[100px] rounded-[8px]" />
        <Skeleton className="size-[40px] rounded-[8px]" />
      </div>

      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <Skeleton className="h-[30px] w-[178px] rounded-[8px]" />
        <Skeleton className="h-[30px] w-[200px] rounded-[4px]" />
        <Skeleton className="h-[22px] w-2/5 rounded-[4px]" />
        <Skeleton className="h-[22px] w-2/5 rounded-[4px]" />
      </div>

      <div className="mt-[20px] flex flex-wrap gap-[6px]">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[12px] w-[80px] rounded-[4px]" />
        ))}
      </div>

      <div className="mt-[10px] hidden gap-[10px] mobile:flex">
        <Skeleton className="h-[40px] w-full rounded-[8px]" />
        <Skeleton className="size-[40px] rounded-[8px]" />
      </div>
    </div>
  );
};

const SpaceChip = ({ category }: { category?: string }) => {
  const categoryInfo = useMemo(
    () => Categories.find((c) => c.value === category),
    [category],
  );
  const displayIcon = React.cloneElement(
    categoryInfo ? categoryInfo.icon : Categories[0].icon,
    {
      size: 20,
      weight: 'fill',
    },
  );
  const displayLabel = categoryInfo ? categoryInfo.label : Categories[0].label;

  return (
    <div className="flex h-[30px] items-center gap-[10px] rounded-[8px] bg-[rgba(255,255,255,0.1)] px-[10px]">
      {displayIcon}
      <span className="text-[14px] font-[600] leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">
        {displayLabel}
      </span>
    </div>
  );
};

export default SpaceSection;
