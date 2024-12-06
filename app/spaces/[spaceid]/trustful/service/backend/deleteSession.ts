import { Role } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import toast from 'react-hot-toast';
import { Address } from 'viem';

type Session = {
  name: string;
  sessionId: number;
  createdAt: Date;
  updatedAt: Date;
  zucityId: number | null;
  hostAddress: string;
  eventId: number;
  endAt: Date | null;
};

interface DeleteSessionRequest {
  sessionId: number;
  userAddress: string;
}

export const deleteSession = async ({
  userAddress,
  role,
  sessionId,
}: {
  userAddress: Address;
  role: Role;
  sessionId: number;
}): Promise<Session | undefined> => {
  if (role === Role.NO_ROLE) {
    toast.error("User Address doesn't have a role");
    return;
  } else if (role !== Role.ROOT) {
    toast.error('User Address is not a root.');
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions/${sessionId}?userAddress=${userAddress}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userAddress: userAddress,
        } as DeleteSessionRequest),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Session = await response.json();
    toast.success('Deleted session successfully!');

    return data;
  } catch (error) {
    console.error('Error deleting session:', error);
    toast.error('An unexpected error occurred while delete the session.');
    throw new Error('Error deleting session');
  }
};
