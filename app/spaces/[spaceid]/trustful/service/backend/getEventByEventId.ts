import toast from 'react-hot-toast';
import { Event } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { Address } from 'viem';

export const getEventByEventId = async ({
  userAddress,
  spaceId,
}: {
  spaceId: string | number;
  userAddress: Address;
}): Promise<Event | undefined> => {
  const spaceIdZuCity = 1; // TODO : REFACTOR TO GET THE SPACE ID CORRECTLY NOW STRING IS ENABLED

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/events/${spaceIdZuCity}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          userAddress: `${userAddress}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Event = await response.json();

    return data;
  } catch (error) {
    console.error('Error getting events:', error);
    toast.error('An unexpected error occurred while get the events.');
    throw new Error(`Error getting events information`);
  }
};
