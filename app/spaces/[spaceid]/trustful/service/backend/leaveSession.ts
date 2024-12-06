import { Role } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import toast from 'react-hot-toast';
import { Address } from 'viem';

type SessionParticipant = {
  sessionParticipantId: number;
  sessionId: number;
  userAddress: string;
  createdAt: Date;
  updatedAt: Date;
};

interface LeaveSessionRequest {
  sessionId: number;
  userAddress?: string;
}

export const leaveSession = async ({
  userAddress,
  role,
  sessionId,
}: {
  userAddress: Address;
  role: Role;
  sessionId: number;
}): Promise<SessionParticipant | undefined> => {
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
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions/${sessionId}/participants?userAddress=${userAddress}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userAddress: userAddress,
        } as LeaveSessionRequest),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: SessionParticipant = await response.json();
    toast.success('Leave session successfully!');

    return data;
  } catch (error) {
    console.error('Error leaving session:', error);
    toast.error('An unexpected error occurred while leaving the session.');
    throw new Error('Error leaving session');
  }
};
