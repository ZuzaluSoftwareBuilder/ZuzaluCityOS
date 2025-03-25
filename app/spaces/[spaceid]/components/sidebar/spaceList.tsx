'use client';

import { useState, useEffect } from 'react';
import { Space } from '@/types';
import { useCeramicContext } from '@/context/CeramicContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image, Tooltip, Skeleton } from '@heroui/react';
import useSpaceAndEvent from '@/hooks/useSpaceAndEvent';

const SpaceItemSkeleton = () => {
  return (
    <div
      className="w-10 h-10 box-content rounded-full flex items-center justify-center relative"
      style={{
        background: 'linear-gradient(90deg, #7DFFD1 0%, #FFCA7A 100%)',
        transform: 'none',
      }}
    >
      <Skeleton className="w-10 h-10 rounded-full bg-[rgba(34,34,34,0.8)]" />
    </div>
  );
};

const SpaceList = () => {
  const { isAuthenticated, profile } = useCeramicContext();
  const [isClientReady, setIsClientReady] = useState(false);

  const { userSpaces, isUserSpacesLoading, isUserSpaceFetched } =
    useSpaceAndEvent();

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  const shouldShowSkeleton =
    isClientReady &&
    (isUserSpacesLoading || !isUserSpaceFetched || !isAuthenticated) &&
    !!profile;

  return (
    <div className="pt-2.5 w-full h-full overflow-y-auto flex flex-col items-center gap-2.5">
      {shouldShowSkeleton ? (
        <>
          <SpaceItemSkeleton />
          <SpaceItemSkeleton />
          <SpaceItemSkeleton />
        </>
      ) : (
        userSpaces.length > 0 &&
        userSpaces.map((space) => <SpaceItem key={space.id} space={space} />)
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
          w-10 h-10 box-content rounded-full flex items-center justify-center cursor-pointer
          hover:shadow-[0_0_0_2px_rgba(255,255,255,0.2)]
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
            <div className="w-10 h-10 rounded-full bg-[#363636]" />
          )}
        </div>
      </Link>
    </Tooltip>
  );
};
