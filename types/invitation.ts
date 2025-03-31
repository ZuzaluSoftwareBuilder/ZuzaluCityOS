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

export interface InvitationEdge {
  node: ZucityInvitation;
}

export interface InvitationData {
  zucityInvitationIndex: {
    edges: InvitationEdge[];
  };
}

export interface InvitationResponse {
  data: ZucityInvitation;
  success: boolean;
  message?: string;
}

export interface CreateInvitationRequest {
  inviteeId: string;
  id: string;
  resource: string;
  roleId: string;
  message?: string;
  expiresAt?: string;
}

export interface GetAssignableRolesRequest {
  userId: string;
  resourceId: string;
  resourceType: string;
}

export interface InvitationActionRequest {
  invitationId: string;
  userId: string;
}

export interface InvitationQueryParams {
  resourceId?: string;
  resourceType?: string;
  status?: InvitationStatus;
  offset?: number;
  limit?: number;
}

export interface ProfileInfo {
  id: string;
  username: string;
  avatar?: string;
  author: {
    id: string;
  };
} 