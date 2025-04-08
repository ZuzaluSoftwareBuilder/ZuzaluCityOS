'use client';
import { Space } from '@/types';
import { addToast, Avatar, Image, Skeleton } from '@heroui/react';
import { Button } from '@/components/base';
import {
  ArrowSquareRight,
  Heart,
  Buildings,
  Users,
} from '@phosphor-icons/react';
import useGetShareLink from '@/hooks/useGetShareLink';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import EditorPro from '@/components/editorPro';
import useUserSpace from '@/hooks/useUserSpace';
import { CheckCircleIcon } from '@/components/icons';
import { formatMemberCount } from '@/app/components/SpaceCard';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followSpace, unFollowSpace } from '@/services/member';
import Copy from '@/components/base/copy';

export interface SpaceSectionProps {
  spaceData?: Space;
  isLoading: boolean;
}

const SpaceSection = ({ spaceData, isLoading }: SpaceSectionProps) => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';
  const { profile, isAuthenticated, showAuthPrompt } = useCeramicContext();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

  const { userJoinedSpaceIds, userFollowedSpaceIds } = useUserSpace();

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

  const { shareUrl } = useGetShareLink({ id: spaceId, name: spaceData?.name });

  const onJoin = () => {
    //   TODO join event
    console.log('join event');
  };

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
    },
  });

  const isPending = followMutation.isPending || unfollowMutation.isPending;

  const onFollow = async () => {
    if (!isAuthenticated || !profile?.author?.id) {
      showAuthPrompt('connectButton');
      return;
    }

    if (isPending) {
      return;
    }

    if (isUserFollowed) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  if (!spaceData) {
    return <SpaceHomeSkeleton />;
  }

  return (
    <div className="flex flex-col border-b border-[rgba(255,255,255,0.10)] bg-[#2C2C2C] p-[20px] backdrop-blur-[20px] mobile:p-[14px]">
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
        {isAuthenticated && !isUserJoined && (
          <Button
            startContent={
              isPending ? null : (
                <Heart
                  weight={isUserFollowed ? 'fill' : 'light'}
                  format="Stroke"
                  size={20}
                />
              )
            }
            onPress={onFollow}
            isLoading={isPending}
            isDisabled={isPending}
          >
            {isUserFollowed ? 'Following' : 'Follow'}
          </Button>
        )}
        {isAuthenticated && (
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

        <Copy text={shareUrl!} />
      </div>

      {/* space info: name/desc */}
      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <div className="flex items-center justify-start gap-[10px]">
          <div className="flex h-[30px] items-center gap-[10px] rounded-[8px] bg-[rgba(255,255,255,0.1)] px-[10px]">
            <Buildings weight="fill" format="Stroke" size={20} />
            <span className="text-[14px] font-[600] leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">
              Community
            </span>
          </div>

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

        <EditorPro
          value={spaceData.description}
          isEdit={false}
          className={{
            base: 'bg-transparent',
            editorWrapper: 'p-0',
          }}
          collapsable={true}
          collapseHeight={150}
          collapsed={isCollapsed}
          onCollapse={(canCollapse) => {
            setIsCanCollapse(canCollapse);
          }}
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
      <div className="mt-[10px] hidden gap-[10px] mobile:flex">
        {isAuthenticated && !isUserJoined && (
          <Button
            startContent={
              isPending ? null : (
                <Heart
                  weight={isUserFollowed ? 'fill' : 'light'}
                  format="Stroke"
                  size={20}
                />
              )
            }
            onPress={onFollow}
            isLoading={isPending}
            isDisabled={isPending}
            className="w-full flex-1 shrink-0"
          >
            {isUserFollowed ? 'Following' : 'Follow'}
          </Button>
        )}
        {isAuthenticated && (
          <Button
            startContent={
              isUserJoined ? (
                <CheckCircleIcon size={5} />
              ) : (
                <ArrowSquareRight weight="fill" format="Stroke" size={20} />
              )
            }
            className="w-full flex-1 shrink-0"
          >
            {isUserJoined ? 'Joined' : 'Join Community'}
          </Button>
        )}

        <Copy text={shareUrl!} />
      </div>
    </div>
  );
};

const SpaceHomeSkeleton = () => {
  return (
    <div className="flex flex-col border-b border-[rgba(255,255,255,0.10)] bg-[#2C2C2C] p-[20px] backdrop-blur-[20px] mobile:p-[14px]">
      <Skeleton className="aspect-[3.4] rounded-[10px] object-cover mobile:aspect-[2.4]" />

      <div className="mt-[20px] flex justify-end gap-[10px] mobile:hidden">
        <Skeleton className="h-[40px] w-[178px] rounded-[8px]" />
        <Skeleton className="size-[40px] rounded-[8px]" />
      </div>

      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <div className="flex items-center justify-start gap-[10px]">
          <div className="flex h-[30px] items-center gap-[10px] rounded-[8px] bg-[rgba(255,255,255,0.1)] px-[10px]">
            <Buildings weight="fill" format="Stroke" size={20} />
            <span className="text-[14px] font-[600] leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">
              Community
            </span>
          </div>
        </div>

        <Skeleton className="h-[30px] w-4/5 rounded-[4px]" />

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

export default SpaceSection;
