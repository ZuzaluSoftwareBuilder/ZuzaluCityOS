import { z } from 'zod';
import { Space, Event } from '@/types';

export interface Invitation {
  id: string;
  author: {
    id: string;
  };
  inviterId: {
    id: string;
  };
  inviteeId: {
    id: string;
  };
  resource: string;
  resourceId: string;
  roleId: string;
  status: InvitationStatus;
  message?: string;
  isRead: 'true' | 'false';
  inviterProfileId?: string;
  inviteeProfileId?: string;
  inviterProfile?: ProfileInfo;
  inviteeProfile?: ProfileInfo;
  eventId?: string;
  event?: Event;
  spaceId?: string;
  space?: Space;
  createdAt: string;
  expiresAt: string;
  updatedAt?: string;
  lastSentAt: string;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  INVALID = 'invalid',
}

export interface CreateInvitationRequest {
  inviteeId: string;
  id: string;
  resource: string;
  roleId: string;
  message?: string;
  expiresAt?: string;
}

export interface InvitationActionRequest {
  invitationId: string;
  userId: string;
}

export interface ProfileInfo {
  id: string;
  username: string;
  avatar?: string;
  author: {
    id: string;
  };
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: string[];
  }>;
}

export const createInvitationSchema = z.object({
  inviteeId: z.string().min(1, 'Invitee ID is required'),
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
  roleId: z.string().min(1, 'Role ID is required'),
  message: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const invitationActionSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
});

export interface InvitationResponse {
  success: boolean;
  data?: Invitation | null;
  message?: string;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
}

export enum InvitationErrorCode {
  NOT_FOUND = 'INVITATION_NOT_FOUND',
  EXPIRED = 'INVITATION_EXPIRED',
  INVALID_STATUS = 'INVALID_STATUS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
