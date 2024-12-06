import toast from 'react-hot-toast';
import { Address } from 'viem';

interface createSessionResponse {
  sessionId: number;
  name: string;
  hostAddress: Address;
  eventId: number;
  zucityId: string;
  createdAt: Date;
  updatedAt: Date;
  endAt: Date;
}

interface createSessionRequest {
  name: string;
  hostAddress: Address;
  eventId: number;
  zucityId?: string;
}

export const createSession = async ({
  name,
  hostAddress,
  eventId,
  zucityId,
}: createSessionRequest): Promise<createSessionResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions?userAddress=${hostAddress}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          hostAddress: hostAddress,
          eventId: eventId,
          zucityId: zucityId,
        } as createSessionRequest),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: createSessionResponse = await response.json();
    toast.success('Session created successfully!');

    return data;
  } catch (error: any) {
    console.error('Error creating session:', error.message);
    toast.error('An unexpected error occurred while creating the session.');
    throw new Error('Error creating session');
  }
};
