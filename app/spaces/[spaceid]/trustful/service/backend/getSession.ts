import toast from 'react-hot-toast';
import { Address } from 'viem';

export type Session = {
  name: string;
  sessionId: number;
  createdAt: Date;
  updatedAt: Date;
  zucityId: number | null;
  hostAddress: string;
  eventId: number;
  endAt: Date | null;
};

export interface GetSessionResponse {
  sessions: Session[];
  total: number;
  page: number;
  totalPages: number;
}

interface getSessionRequest {
  userAddress?: Address;
  eventid: number;
  page?: number;
  limit?: number;
  filters?: {
    eventId?: number;
    hostAddress?: string;
    fromDate?: Date;
    toDate?: Date;
  };
}
/**
 *
 * The hostAddress must be in LowerCase
 * Page & Limit are not optional
 */
export const getSession = async ({
  userAddress,
  eventid,
  page = 1,
  limit = 100,
  filters,
}: getSessionRequest): Promise<GetSessionResponse | undefined> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      eventId: eventid.toString(),
      hostAddress: userAddress ? userAddress.toLowerCase() : '',
    });

    if (filters) {
      if (filters.eventId)
        queryParams.append('eventId', filters.eventId.toString());
      if (filters.hostAddress)
        queryParams.append('hostAddress', filters.hostAddress);
      if (filters.fromDate)
        queryParams.append('fromDate', filters.fromDate.toISOString());
      if (filters.toDate)
        queryParams.append('toDate', filters.toDate.toISOString());
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_RAILWAY_TRUSTFUL}/sessions?${queryParams.toString()}`,
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
    const data: GetSessionResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting session:', error);
    toast.error('An unexpected error occurred while getting the session.');
    throw new Error(`Error getting session information`);
  }
};
