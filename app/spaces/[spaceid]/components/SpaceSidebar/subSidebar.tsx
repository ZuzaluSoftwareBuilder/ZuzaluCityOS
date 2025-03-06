'use client';
import { useParams, useRouter } from 'next/navigation';
import { Image } from '@heroui/react';
import { getSpaceEventsQuery } from '@/services/space';
import { Event, Space, SpaceEventData } from '@/types';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useCeramicContext } from '@/context/CeramicContext';
import useGetShareLink from '@/hooks/useGetShareLink';

const NewSubSidebar = () => {
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const theme = useTheme();
  const router = useRouter();
  const { composeClient, ceramic } = useCeramicContext();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const [space, setSpace] = useState<Space>();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState<boolean>(true);
  const [currentHref, setCurrentHref] = useState('');

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const { shareUrl } = useGetShareLink({ id: spaceId, name: space?.name });

  const getSpaceByID = async () => {
    setIsEventsLoading(true);
    const spaceId = params.spaceid.toString();

    const response: any = await composeClient.executeQuery(
      getSpaceEventsQuery(),
      {
        id: spaceId,
      },
    );
    const spaceData: Space = response.data.node as Space;
    setSpace(spaceData);
    const eventData: SpaceEventData = response.data.node
      .events as SpaceEventData;
    const fetchedEvents: Event[] = eventData.edges.map((edge) => edge.node);
    setEvents(fetchedEvents);
    return spaceData;
  };
  useEffect(() => {
    const fetchData = async () => {
      setCurrentHref(window.location.href);
      const space = await getSpaceByID();
      document.title = space?.name + ' - ' + 'Zuzalu City';
      const admins =
        space?.admins?.map((admin) => admin.id.toLowerCase()) || [];
      const superAdmins =
        space?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) ||
        [];
      const userDID = ceramic?.did?.parent.toString().toLowerCase() || '';
      if (admins.includes(userDID) || superAdmins.includes(userDID)) {
        setIsAdmin(true);
      }
    };

    fetchData()
      .catch((error) => {
        console.error('An error occurred:', error);
      })
      .finally(() => {
        setIsEventsLoading(false);
      });
  }, [ceramic?.did?.parent]);

  // border-right: 1px solid #363636;
  return (
    <div className="w-[260px] h-[calc(100vh-50px)] border-r border-[#363636]">
      <div className="w-[259px] h-[55px] flex justify-between items-center">
        <Image src={space?.avatar} alt={space?.name} width={35} height={35} />
        {space?.name}
      </div>
    </div>
  );
};

export default NewSubSidebar;
