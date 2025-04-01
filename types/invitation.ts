export interface ZucityInvitation {
  id: string;
  author: {
    id: string;
  };
  inviterId: string;
  inviteeId: string;
  resource: string;
  resourceId: string;
  roleId: string;
  status: InvitationStatus;
  message?: string;
  isRead: string;

  createdAt: string;
  expiresAt: string;
  updatedAt?: string;
  lastSentAt?: string;

  customAttributes?: Array<{ tbd?: string }>;

  inviterProfile?: ProfileInfo | null;
  inviteeProfile?: ProfileInfo | null;

  eventId?: string;
  event?: any;
  spaceId?: string;
  space?: any;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
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