import { Role } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import toast from 'react-hot-toast';
import { Address } from 'viem';

interface wrapSessionRequest {
  sessionId: number;
}

export const wrapSession = async ({
  userAddress,
  role,
  sessionId,
}: {
  userAddress: Address;
  role: Role;
  sessionId: number;
}): Promise<Boolean | undefined> => {
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
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions/${sessionId}/wrap?userAddress=${userAddress}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
        } as wrapSessionRequest),
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Boolean = await response.json();
    toast.success('Wrap session successfully!');

    return data;
  } catch (error) {
    console.error('Error wrapping session:', error);
    toast.error('An unexpected error occurred while wrapping the session.');
    throw new Error('Error wrapping session');
  }
};
