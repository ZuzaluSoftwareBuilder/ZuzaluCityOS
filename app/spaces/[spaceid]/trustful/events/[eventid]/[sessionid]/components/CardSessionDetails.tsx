'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Text } from '@chakra-ui/react';
import toast from 'react-hot-toast';
import {
  getSession,
  Session,
} from '@/app/spaces/[spaceid]/trustful/service/backend';
import { useAccount } from 'wagmi';

export const CardSessionDetails = () => {
  const [session, setSession] = useState<Session | undefined>(undefined);
  const params = useParams();
  const { address } = useAccount();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionsData = await getSession({
          eventid: Number(params.eventid),
        });

        if (sessionsData && sessionsData.sessions.length > 0) {
          const sessionById = sessionsData.sessions.find(
            (session) => session.sessionId === Number(params.sessionid),
          );

          if (sessionById) {
            setSession(sessionById);
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchSession();
  }, [address, params.eventid, params.sessionid]);

  if (!address) {
    toast.error('User not found');
    return null;
  }

  return (
    <>
      {session ? (
        <Card
          background={'#F5FFFF0D'}
          className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
        >
          <Text className="text-white mb-2 font-medium leading-none">
            Session Details
          </Text>
          <Card background={'#222222'} className="mb-4 p-4">
            <Text className="text-white font-semibold text-lg">
              {session.name}
            </Text>
            <Text className="text-gray-400">Event ID: {session.eventId}</Text>
            <Text className="text-gray-500 text-sm">
              Host Address: {session.hostAddress}
            </Text>
            <Text className="text-gray-500 text-sm">
              Session ID: {session.sessionId}
            </Text>
            <Text className="text-gray-500 text-sm">
              Created at: {new Date(session.createdAt).toLocaleString()}
            </Text>
          </Card>
        </Card>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};
