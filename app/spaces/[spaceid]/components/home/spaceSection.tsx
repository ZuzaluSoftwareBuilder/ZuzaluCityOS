'use client';
import { Space } from '@/types';
import { addToast, Avatar, cn, Image, Skeleton } from '@heroui/react';
import { Button } from '@/components/base';
import {
  ArrowSquareRight,
  Heart,
  ShareFat,
  Buildings,
} from '@phosphor-icons/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useGetShareLink from '@/hooks/useGetShareLink';
import { useParams } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';
import EditorPro from '@/components/editorPro';
import useUserSpace from '@/hooks/useUserSpace';
import { CheckCircleIcon } from '@/components/icons';

export interface SpaceSectionProps {
  spaceData?: Space;
  isLoading: boolean;
}

const SpaceSection = ({ spaceData, isLoading }: SpaceSectionProps) => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

  const { userJoinedSpaceIds, userFollowedSpaceIds } = useUserSpace();

  const { isUserJoined, isUserFollowed } = useMemo(() => {
    const isUserJoined = userJoinedSpaceIds.has(spaceId);
    const isUserFollowed = userFollowedSpaceIds.has(spaceId);
    return { isUserJoined, isUserFollowed };
  }, [spaceId, userJoinedSpaceIds, userFollowedSpaceIds]);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: spaceData?.name });

  const onJoin = () => {
    //   TODO join event
    console.log('join event');
  };
  const onFollow = () => {
    //   TODO follow event
    console.log('follow event');
  };

  const onCopy = useCallback(() => {
    addToast({
      title: 'Copy share link to clipboard',
      color: 'success',
    });
  }, []);

  if (!spaceData) {
    // TODO: show skeleton
    return (
      <div className="flex flex-col gap-[20px] border-b border-[rgba(255,255,255,0.10)] bg-[#2C2C2C] p-[20px] backdrop-blur-[20px] mobile:p-[14px]">
        <Skeleton className="aspect-[3.4] rounded-[10px] object-cover mobile:aspect-[2.4]" />

        <div className="flex justify-end gap-[10px]">
          <Skeleton className="h-[40px] w-[178px] rounded-[8px]" />
          <Skeleton className="size-[40px] rounded-[8px]" />
        </div>
      </div>
    );
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

      <div className="mt-[20px] flex justify-end gap-[10px] mobile:hidden">
        {!isUserJoined && (
          <Button
            startContent={<Heart weight="fill" format="Stroke" size={20} />}
            onPress={onFollow}
          >
            {isUserFollowed ? 'Following' : 'Follow'}
          </Button>
        )}
        <Button
          startContent={
            isUserJoined ? (
              <CheckCircleIcon size={4} />
            ) : (
              <ArrowSquareRight weight="fill" format="Stroke" size={20} />
            )
          }
          onPress={onJoin}
        >
          {isUserJoined ? 'Joined' : 'Join Community'}
        </Button>
        <CopyToClipboard text={shareUrl!} onCopy={onCopy}>
          <Button
            startContent={<ShareFat weight="fill" format="Stroke" size={20} />}
            isIconOnly
          ></Button>
        </CopyToClipboard>
      </div>

      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <div className="flex items-center justify-start gap-[10px]">
          <div className="flex h-[30px] items-center gap-[10px] rounded-[8px] bg-[rgba(255,255,255,0.1)] px-[10px]">
            <Buildings weight="fill" format="Stroke" size={20} />
            <span className="text-[14px] font-[600] leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">
              Community
            </span>
          </div>

          {/*TODO wait for count member*/}
          {/*<div className="flex items-center gap-[6px] opacity-50">*/}
          {/*  <Users weight="fill" format="Stroke" size={20} />*/}
          {/*  <span className="text-[14px] leading-[1.4] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ">*/}
          {/*    {spaceData.members?.length || 0}*/}
          {/*  </span>*/}
          {/*</div>*/}
        </div>

        <p className="text-[25px] font-bold leading-[1.2] text-white drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] mobile:text-[20px] ">
          {spaceData.name}
        </p>

        <EditorPro
          value={spaceData.description}
          isEdit={false}
          className={cn('bg-w-5')}
          collapsable={true}
          collapseHeight={150}
          collapsed={isCollapsed}
          onCollapse={(canCollapse) => {
            setIsCanCollapse(canCollapse);
          }}
        />

        {/*<p className="text-[14px] leading-[1.6] text-white opacity-80 drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] mobile:text-[13px]">*/}
        {/*  {spaceData.description}*/}
        {/*  */}
        {/*</p>*/}
      </div>

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

      <div className="mt-[10px] hidden gap-[10px] mobile:flex">
        <Button
          startContent={
            <ArrowSquareRight weight="fill" format="Stroke" size={20} />
          }
          className="w-full"
        >
          {isUserJoined ? 'Joined' : 'Join Community'}
        </Button>
        <CopyToClipboard text={shareUrl!} onCopy={onCopy}>
          <Button
            startContent={<ShareFat weight="fill" format="Stroke" size={20} />}
            isIconOnly
          ></Button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default SpaceSection;
