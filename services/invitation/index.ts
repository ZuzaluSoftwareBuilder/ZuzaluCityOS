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

export interface ICancelInvitationParams {
  invitationId: string;
  id: string;
  resource: string;
}

export const cancelInvitation = async ({ invitationId, id, resource }: ICancelInvitationParams): Promise<{ success: boolean; message?: string; }> => {
  try {
    const response = await axiosInstance.post(`/api/invitation/cancel`, {
      invitationId,
      id,
      resource
    });
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
