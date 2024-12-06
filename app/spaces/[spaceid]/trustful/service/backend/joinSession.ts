import toast from 'react-hot-toast';
import { Address } from 'viem';

type SessionParticipant = {
  sessionParticipantId: number;
  sessionId: number;
  userAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

interface joinSessionRequest {
  sessionId: number;
  userAddress: string;
}

export const joinSession = async ({
  userAddress,
  sessionId,
}: {
  userAddress: Address;
  sessionId: number;
}): Promise<SessionParticipant | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions/${sessionId}/participants`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          userAddress: `${userAddress}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userAddress: userAddress,
        } as joinSessionRequest),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: SessionParticipant = await response.json();

    return data;
  } catch (error) {
    console.error('Error joining session:', error);
    toast.error('An unexpected error occurred while joining the session.');
    throw new Error('Error joining session');
  }
};
