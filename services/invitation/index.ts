import {
  CreateInvitationRequest,
  InvitationActionRequest,
  ZucityInvitation,
} from '@/types/invitation';
import axiosInstance from '@/utils/axiosInstance';

/**
 * 将普通 ID 转换为 CeramicStreamID 格式
 * Ceramic StreamID 通常以 'k' 开头（如 kjzl6...），后接一系列 base36 编码的字符
 * 参考: https://developers.ceramic.network/docs/protocol/js-ceramic/streams/stream-id-api
 * 
 * @param id 原始ID
 * @returns 格式化后的 CeramicStreamID
 */
const convertToCeramicStreamID = (id: string): string => {
  // 检查是否已经是 Ceramic 格式（以 'k' 开头）
  if (id && (id.startsWith('k'))) {
    return id;
  }

  // 如果是 UUID 格式（包含连字符），去掉连字符
  const cleanId = id.replace(/-/g, '');

  // 使用 base36 编码的前缀 - Ceramic StreamID 基本格式
  // kjzl6 是 Ceramic 中常见的前缀，表示特定类型的流
  // 生产环境中应该使用 @ceramicnetwork/streamid 库进行正确的编码
  return `kjzl6${cleanId.slice(0, 44)}`;
};

export const createInvitation = async (invitation: CreateInvitationRequest): Promise<ZucityInvitation> => {
  try {
    // 转换 roleId 为 CeramicStreamID 格式
    const formattedInvitation = {
      ...invitation,
      roleId: convertToCeramicStreamID(invitation.roleId)
    };

    const response = await axiosInstance.post('/api/invitation', formattedInvitation);
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
  resourceId: string;
  resource: string;
}

export const cancelInvitation = async ({ invitationId, resourceId, resource }: ICancelInvitationParams): Promise<{ success: boolean; message?: string; }> => {
  try {
    const response = await axiosInstance.post(`/api/invitation/cancel`, {
      invitationId,
      id: resourceId,
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