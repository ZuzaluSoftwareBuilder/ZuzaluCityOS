import { Announcement } from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

export type AnnouncementsWithPagination = {
  announcements: Announcement[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor?: string;
  };
};

export const getSpaceAnnouncements = async (spaceId: string) => {
  try {
    const response = await axiosInstance.get('/api/space/announcement', {
      params: {
        id: spaceId,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error(
        'An unknown error occurred while fetching space announcements',
      );
    }
  }
};
