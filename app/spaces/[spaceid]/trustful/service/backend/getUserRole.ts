import { Role } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { Address } from 'viem';

interface UserRoleResponse {
  role: Role;
}

export const getUserRole = async (
  userAddress: Address,
): Promise<UserRoleResponse | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/users/role?userAddress=${userAddress}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: UserRoleResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching getUserRole:', error);
    throw new Error('Error fetching getUserRole');
  }
};
