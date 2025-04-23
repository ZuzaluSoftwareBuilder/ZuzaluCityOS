'use client';
import { Avatar, cn, Image, Skeleton, useDisclosure } from '@heroui/react';

import { formatMemberCount } from '@/components/biz/space/SpaceCard';
import SpaceChip from '@/components/biz/space/SpaceChip';
import useGetShareLink from '@/hooks/useGetShareLink';
import useUserSpace from '@/hooks/useUserSpace';
import { Space } from '@/models/space';
import { Users } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import EditorProWithMore from './EditorProWithMore';
import { JoinSpaceNoGate, JoinSpaceWithGate } from './modal/joinSpace';
import SpaceActions from './spaceActions';

export interface SpaceSectionProps {
  spaceData?: Space;
  isLoading: boolean;
}

const SpaceSection = ({ spaceData }: SpaceSectionProps) => {
  const params = useParams();
  const spaceId = params?.spaceid?.toString() ?? '';
  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();

  const { userJoinedSpaceIds, userFollowedSpaceIds, isUserSpaceFetched } =
    useUserSpace();

  const formattedMemberCount = useMemo(() => {
    const totalMembers = spaceData?.userRoles?.length ?? 0;
    return formatMemberCount(totalMembers + 1);
  }, [spaceData?.userRoles]);

  const { isUserJoined, isUserFollowed } = useMemo(() => {
    const isUserFollowed = userFollowedSpaceIds.has(spaceId);
    const isUserJoined = userJoinedSpaceIds.has(spaceId) && !isUserFollowed;
    return { isUserJoined, isUserFollowed };
  }, [spaceId, userJoinedSpaceIds, userFollowedSpaceIds]);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: spaceData?.name });

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

      {/* Desktop Actions */}
      <SpaceActions
        spaceData={spaceData}
        spaceId={spaceId}
        isUserJoined={isUserJoined}
        isUserFollowed={isUserFollowed}
        isUserSpaceFetched={isUserSpaceFetched}
        shareUrl={shareUrl}
        onJoin={onOpen}
        className="mt-[20px] flex justify-end gap-[10px] mobile:hidden"
      />

      {/* space info: name/desc */}
      <div className="mt-[20px] flex flex-col gap-[10px] mobile:mt-[50px]">
        <div className="flex items-center justify-start gap-[10px]">
          <SpaceChip
            category={spaceData?.category}
            classNames={{
              base: ' h-[30px] gap-[10px] rounded-[8px] bg-[rgba(255,255,255,0.1)] px-[10px]',
              label:
                'text-[14px] font-[600] drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)] ',
            }}
          />

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

      {/*Mobile Actions*/}
      <SpaceActions
        spaceData={spaceData}
        spaceId={spaceId}
        isUserJoined={isUserJoined}
        isUserFollowed={isUserFollowed}
        isUserSpaceFetched={isUserSpaceFetched}
        shareUrl={shareUrl}
        onJoin={onOpen}
        className="mt-[10px] hidden justify-end gap-[10px] mobile:flex"
        isMobile={true}
      />
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
        <Skeleton className="h-[40px] w-[168px] rounded-[8px]" />
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

export default SpaceSection;
