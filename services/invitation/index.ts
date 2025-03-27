import {
  CreateInvitationRequest,
  InvitationActionRequest,
  ZucityInvitation,
} from '@/types/invitation';
import axiosInstance from '@/utils/axiosInstance';

export const createInvitation = async (invitation: CreateInvitationRequest): Promise<ZucityInvitation> => {
  try {
    const response = await axiosInstance.post('/api/invitation', invitation);
    return response.data.data;
  } catch (error) {
    console.error('Failed to create invitation:', error);
    throw error;
  }
};

export const acceptInvitation = async (params: InvitationActionRequest): Promise<{ success: boolean; message?: string; }> => {
  try {
    const response = await axiosInstance.post('/api/invitation/accept', params);
    return {
      success: true,
      ...response.data
    };
  } catch (error: any) {
    console.error('Failed to accept invitation:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to accept invitation'
    };
  }
};

export const rejectInvitation = async (params: InvitationActionRequest): Promise<{ success: boolean; message?: string; }> => {
  try {
    const response = await axiosInstance.post('/api/invitation/reject', params);
    return {
      success: true,
      ...response.data
    };
  } catch (error: any) {
    console.error('Failed to reject invitation:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to reject invitation'
    };
  }
};

export const cancelInvitation = async (invitationId: string): Promise<{ success: boolean; message?: string; }> => {
  try {
    const response = await axiosInstance.post(`/api/invitation/${invitationId}/cancel`);
    return {
      success: true,
      ...response.data
    };
  } catch (error: any) {
    console.error('Failed to cancel invitation:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to cancel invitation'
    };
  }
};

export const getInvitationsByResource = async (
  resourceId: string,
  resourceType: string,
  pagination?: { offset: number; limit: number; }
): Promise<{ invitations: ZucityInvitation[]; total: number; }> => {
  try {
    const response = await axiosInstance.get('/api/invitation', {
      params: {
        resourceId,
        resourceType,
        ...pagination
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get invitation list:', error);
    throw error;
  }
};

export const getPendingInvitationsForUser = async (userId: string): Promise<ZucityInvitation[]> => {
  try {
    const response = await axiosInstance.get('/api/invitation/pending', {
      params: { userId }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to get pending invitations:', error);
    throw error;
  }
};

export const markInvitationAsRead = async (invitationId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(`/api/invitation/${invitationId}/read`);
    return response.data.success;
  } catch (error) {
    console.error('Failed to mark invitation as read:', error);
    throw error;
  }
};

export const getUnreadInvitationCount = async (userId: string): Promise<number> => {
  try {
    const response = await axiosInstance.get('/api/invitation/unread-count', {
      params: { userId }
    });
    return response.data.count || 0;
  } catch (error) {
    console.error('Failed to get unread invitation count:', error);
    return 0;
  }
}; 