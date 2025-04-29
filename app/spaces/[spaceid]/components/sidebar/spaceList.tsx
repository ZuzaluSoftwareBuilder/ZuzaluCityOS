'use client';

import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import useUserSpace from '@/hooks/useUserSpace';
import { Space } from '@/models/space';
import { Image, Skeleton, Tooltip } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SpaceItemSkeleton = () => {
  return (
    <div
      className="relative box-content flex size-10 items-center justify-center rounded-full"
      style={{
        background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
        transform: 'none',
      }}
    >
      <Skeleton className="size-10 rounded-full bg-[rgba(34,34,34,0.8)]" />
    </div>
  );
};

const SpaceList = () => {
  const { isAuthenticated, profile } = useAbstractAuthContext();

  const { userJoinedSpaces, isUserSpaceLoading, isUserSpaceFetched } =
    useUserSpace();

  const isLoggedIn = isAuthenticated && !!profile;
  const hasNoSpaces = isUserSpaceFetched && userJoinedSpaces.length === 0;
  const shouldShowSkeleton = isUserSpaceLoading && isLoggedIn && !hasNoSpaces;

  return (
    <div className="flex size-full flex-col items-center gap-2.5 overflow-y-auto pt-2.5">
      {shouldShowSkeleton ? (
        <>
          <SpaceItemSkeleton />
          <SpaceItemSkeleton />
          <SpaceItemSkeleton />
        </>
      ) : (
        userJoinedSpaces.length > 0 &&
        userJoinedSpaces
          .filter((space) => !!space)
          .map((space) => (
            <SpaceItem
              key={(space as unknown as Space).id}
              space={space as unknown as Space}
            />
          ))
      )}
    </div>
  );
};

export default SpaceList;

const SpaceItem = ({ space }: { space: Space }) => {
  const pathname = usePathname();
  const isActive = pathname?.includes(`/spaces/${space.id}`);

  return (
    <Tooltip
      placement="right"
      classNames={{
        base: ['bg-transparent'],
        content: [
          'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm',
        ],
      }}
      content={space.name}
    >
      <Link href={`/spaces/${space.id}`} className="cursor-pointer">
        <div
          className={`
          box-content flex size-10 cursor-pointer items-center justify-center rounded-full hover:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]
          ${isActive ? 'border-2 border-[#2C2C2C] shadow-[0_0_0_2px_rgba(255,255,255,0.9)] hover:shadow-[0_0_0_2px_rgba(255,255,255,0.9)]' : 'border-none'}
        `}
        >
          {space.avatar ? (
            <Image
              src={space.avatar}
              alt={space.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="size-10 rounded-full bg-[#363636]" />
          )}
        </div>
      </Link>
    </Tooltip>
  );
};
