import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withBasicSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { InvitationStatus } from '@/types/invitation';
import { composeClient } from '@/constant';
import {
  GET_INVITATION_BY_ID_QUERY,
  UPDATE_INVITATION_MUTATION,
} from '@/services/graphql/invitation';

export const dynamic = 'force-dynamic';

const rejectInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
});

export const POST = withBasicSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = rejectInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }

    const { invitationId } = validationResult.data;
    const operatorId = sessionData.operatorId;

    if (!operatorId) {
      return createErrorResponse('Failed to get user information', 401);
    }

    const invitationResult = await composeClient.executeQuery(
      GET_INVITATION_BY_ID_QUERY.toString(),
      {
        id: invitationId,
      },
    );

    if (invitationResult.errors) {
      throw new Error(
        invitationResult.errors.map((e: any) => e.message).join(', '),
      );
    }

    const invitation = invitationResult.data?.node;

    if (!invitation) {
      return createErrorResponse('Invitation not found', 404);
    }

    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      return createErrorResponse('Invitation has expired', 400);
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      return createErrorResponse(
        'Invalid invitation status, cannot be rejected',
        400,
      );
    }

    if (invitation.inviteeId.id !== operatorId) {
      return createErrorResponse(
        'You do not have permission to reject this invitation',
        403,
      );
    }

    try {
      const error = await authenticateWithSpaceId(invitation.resourceId);
      if (error) {
        return createErrorResponse('Failed to get private key', 500);
      }

      const updateResult = await composeClient.executeQuery(
        UPDATE_INVITATION_MUTATION.toString(),
        {
          input: {
            id: invitationId,
            content: {
              status: InvitationStatus.REJECTED,
              isRead: 'true',
              updatedAt: dayjs().toISOString(),
            },
          },
        },
      );

      if (updateResult.errors) {
        throw new Error(
          updateResult.errors.map((e: any) => e.message).join(', '),
        );
      }

      const updatedInvitation =
        updateResult.data?.updateZucityInvitation?.document;
      return createSuccessResponse(
        updatedInvitation,
        'Invitation rejected successfully',
      );
    } catch (error: any) {
      console.error('Failed to reject invitation:', error);
      return createErrorResponse(
        'Failed to reject invitation',
        500,
        error.message,
      );
    }
  } catch (error: any) {
    console.error('Failed to reject invitation:', error);
    return createErrorResponse(
      'Failed to reject invitation',
      500,
      error.message,
    );
  }
});
