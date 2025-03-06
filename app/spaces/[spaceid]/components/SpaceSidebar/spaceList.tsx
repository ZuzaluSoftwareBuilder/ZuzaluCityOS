'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSpacesQuery } from '@/services/space';
import { Space, SpaceData } from '@/types';
import { isUserAssociated } from '@/utils/permissions';
import { useCeramicContext } from '@/context/CeramicContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Image } from '@heroui/react';

const SpaceList = () => {
  const [selected, setSelected] = useState('Spaces');
  const { isAuthenticated, composeClient, ceramic } = useCeramicContext();

  const userDID = ceramic?.did?.parent?.toString();

  const { data: spacesData, isLoading: isSpacesLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      try {
        const response: any = await composeClient.executeQuery(getSpacesQuery);
        if ('zucitySpaceIndex' in response.data) {
          const spaceData: SpaceData = response.data as SpaceData;

          return spaceData.zucitySpaceIndex.edges.map((edge) => edge.node);
        } else {
          console.error('Invalid data structure:', response.data);
          return [];
        }
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        throw error;
      }
    },
    enabled: isAuthenticated,
  });

  const userSpaces = useMemo(() => {
    if (!spacesData || !userDID) return [];

    return spacesData.filter((space) => isUserAssociated(space, userDID));
  }, [spacesData, userDID]);

  return (
    <div className="mt-2.5 w-full h-full overflow-y-auto flex flex-col items-center gap-2.5">
      {userSpaces.length > 0 &&
        userSpaces.map((space) => <SpaceItem key={space.id} space={space} />)}
    </div>
  );
};

export default SpaceList;

const SpaceItem = ({ space }: { space: Space }) => {
  const pathname = usePathname();
  const isActive = pathname.includes(`/spaces/${space.id}`);

  return (
    // TODO active state ui
    <Link href={`/spaces/${space.id}`} className="cursor-pointer">
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
          ${isActive ? 'border-2 border-white' : 'border-none'}
        `}
      >
        {space.avatar ? (
          <Image src={space.avatar} alt={space.name} width={40} height={40} className='rounded-full object-cover' />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#363636]" />
        )}
      </div>
    </Link>
  );
};
