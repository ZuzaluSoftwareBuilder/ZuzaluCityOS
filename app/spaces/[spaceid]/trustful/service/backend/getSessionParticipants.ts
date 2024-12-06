import { Role } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import toast from 'react-hot-toast';
import { Address } from 'viem';

type SessionParticipantResponse = {
  sessionParticipantId: number;
  sessionId: number;
  userAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

interface getSessionRequest {
  userAddress: Address;
  role: Role;
  sessionId: number;
}

export const getSessionParticipants = async ({
  userAddress,
  role,
  sessionId,
}: getSessionRequest): Promise<SessionParticipantResponse[] | undefined> => {
  if (role === Role.NO_ROLE) {
    toast.error("User Address doesn't have a role");
    return;
  } else if (
    role !== Role.MANAGER &&
    role !== Role.ROOT &&
    role !== Role.VILLAGER
  ) {
    toast.error('User Address is not a manager, root or villager');
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions/${sessionId}/participants`,
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
    const data: SessionParticipantResponse[] = await response.json();

    return data;
  } catch (error) {
    console.error('Error getting session:', error);
    toast.error(
      'An unexpected error occurred while get the session participants.',
    );
    throw new Error(`Error getting session id ${sessionId}`);
  }
};
