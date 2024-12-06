'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Text } from '@chakra-ui/react';
import {
  getSession,
  GetSessionResponse,
} from '@/app/spaces/[spaceid]/trustful/service/';
import { useAccount } from 'wagmi';

export const CardSession = () => {
  const [sessions, setSessions] = useState<GetSessionResponse[] | undefined>(
    [],
  );
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const actualURL = `/spaces/${spaceId}/trustful/events/${params.eventid}`;
  const { push } = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const allEventSessionsData = await getSession({
          eventid: Number(params.eventid),
        });
        if (allEventSessionsData) {
          setSessions([allEventSessionsData]);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchAllEvents();
  }, [address]);

  return (
    <>
      {sessions && sessions.length > 0 && (
        <Card
          background={'#F5FFFF0D'}
          className="w-full border border-[#F5FFFF14] border-opacity-[8] p-4 gap-2"
        >
          <Text className="text-white mb-2 font-medium leading-none">
            Sessions
          </Text>
          {sessions.map(
            (session, index) =>
              session &&
              session.sessions && (
                <Card
                  key={index}
                  background={'#222222'}
                  className="mb-4 p-4 cursor-pointer"
                  onClick={() =>
                    push(`${actualURL}/${session.sessions[index].sessionId}`)
                  }
                >
                  {session.sessions[index] && (
                    <>
                      <Text className="text-white font-semibold text-lg">
                        {session.sessions[index].name}
                      </Text>

                      <Text className="text-gray-500 text-sm">
                        Event ID: {session.sessions[index].eventId}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        Created at:{' '}
                        {new Date(
                          session.sessions[index].createdAt,
                        ).toLocaleString()}
                      </Text>
                    </>
                  )}
                </Card>
              ),
          )}
        </Card>
      )}
    </>
  );
};
