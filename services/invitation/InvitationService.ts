import { composeClient } from '@/constant';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import {
  Invitation,
  InvitationStatus,
  GraphQLResponse,
  InvitationErrorCode,
} from '@/types/invitation';
import {
  GET_INVITATION_BY_ID_QUERY,
  UPDATE_INVITATION_MUTATION,
} from '@/services/graphql/invitation';

export class InvitationError extends Error {
  constructor(
    public code: InvitationErrorCode,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'InvitationError';
  }
}

export class InvitationService {
  private static instance: InvitationService;

  private constructor() {}

  public static getInstance(): InvitationService {
    if (!InvitationService.instance) {
      InvitationService.instance = new InvitationService();
    }
    return InvitationService.instance;
  }

  async getInvitation(id: string): Promise<Invitation> {
    const result = await composeClient.executeQuery(
      GET_INVITATION_BY_ID_QUERY.toString(),
      { id },
    );

    const invitation = this.handleGraphQLResponse<{ node: Invitation }>(
      result,
    )?.node;

    if (!invitation) {
      throw new InvitationError(
        InvitationErrorCode.NOT_FOUND,
        'Invitation not found',
      );
    }

    return invitation;
  }

  async validateInvitation(
    invitation: Invitation,
    expectedStatus?: InvitationStatus,
  ): Promise<void> {
    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      throw new InvitationError(
        InvitationErrorCode.EXPIRED,
        'Invitation has expired',
      );
    }

    if (expectedStatus && invitation.status !== expectedStatus) {
      throw new InvitationError(
        InvitationErrorCode.INVALID_STATUS,
        `Invalid invitation status, expected ${expectedStatus}`,
      );
    }
  }

  validatePermission(
    invitation: Invitation,
    operatorId: string,
    isInvitee: boolean,
  ): void {
    const targetId = isInvitee
      ? invitation.inviteeId.id
      : invitation.inviterId.id;

    if (String(targetId) !== String(operatorId)) {
      throw new InvitationError(
        InvitationErrorCode.PERMISSION_DENIED,
        'You do not have permission to perform this action',
      );
    }
  }

  async updateInvitationStatus(
    id: string,
    status: InvitationStatus,
    additionalData: Record<string, any> = {},
  ): Promise<Invitation> {
    const invitation = await this.getInvitation(id);

    const error = await authenticateWithSpaceId(invitation.resourceId);
    if (error) {
      throw new InvitationError(
        InvitationErrorCode.INTERNAL_ERROR,
        'Failed to authenticate with space',
      );
    }

    const result = await composeClient.executeQuery(
      UPDATE_INVITATION_MUTATION.toString(),
      {
        input: {
          id,
          content: {
            status,
            updatedAt: dayjs().toISOString(),
            ...additionalData,
          },
        },
      },
    );

    return this.handleGraphQLResponse<{
      updateZucityInvitation: {
        document: Invitation;
      };
    }>(result)?.updateZucityInvitation?.document;
  }

  private handleGraphQLResponse<T>(result: GraphQLResponse<T>): T {
    if (result.errors) {
      throw new InvitationError(
        InvitationErrorCode.INTERNAL_ERROR,
        result.errors.map((e) => e.message).join(', '),
        result.errors,
      );
    }
    return result.data as T;
  }
}
