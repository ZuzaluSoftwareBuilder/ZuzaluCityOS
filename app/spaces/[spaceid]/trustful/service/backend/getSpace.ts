import { Address } from 'viem';

interface Space {
  spaceId: string | number;
  zucityId: number | null;
  name: string;
  description: string;
  resolverAddress: Address;
  userAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export const getSpace = async ({
  userAddress,
}: {
  userAddress: Address;
}): Promise<Space[] | undefined> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/spaces`,
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
    const data: Space[] = await response.json();

    return data;
  } catch (error) {
    console.error('Error getting events:', error);
    throw new Error(`Error getting events information`);
  }
};
