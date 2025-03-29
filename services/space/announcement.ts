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

export interface CreateAnnouncementParams {
  spaceId: string;
  title: string;
  description: string;
  tags?: string[];
}

export const createSpaceAnnouncement = async (
  params: CreateAnnouncementParams,
) => {
  try {
    const response = await axiosInstance.post(
      '/api/space/announcement/create',
      {
        ...params,
        id: params.spaceId,
        resource: 'space',
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error(
        'An unknown error occurred while creating space announcement',
      );
    }
  }
};

export interface UpdateAnnouncementParams {
  spaceId: string;

  announcementId: string;
  title: string;
  description: string;
  tags?: string[];
}

export const updateSpaceAnnouncement = async (
  params: UpdateAnnouncementParams,
) => {
  try {
    const response = await axiosInstance.put('/api/space/announcement/update', {
      ...params,
      id: params.spaceId,
      resource: 'space',
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error(
        'An unknown error occurred while updating space announcement',
      );
    }
  }
};

export interface RemoveAnnouncementParams {
  spaceId: string;

  announcementId: string;
}

export const removeSpaceAnnouncement = async (
  params: RemoveAnnouncementParams,
) => {
  try {
    const response = await axiosInstance.post(
      '/api/space/announcement/remove',
      {
        id: params.spaceId,
        resource: 'space',
        announcementId: params.announcementId,
      },
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error(
        'An unknown error occurred while removing space announcement',
      );
    }
  }
};
