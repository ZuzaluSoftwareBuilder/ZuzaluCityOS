import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { InvitationStatus } from '@/types/invitation';
import { composeClient } from '@/constant';

export const dynamic = 'force-dynamic';

const rejectInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = rejectInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format()
      );
    }

    const { invitationId } = validationResult.data;
    const operatorId = sessionData.operatorId;

    if (!operatorId) {
      return createErrorResponse('Failed to get user information', 401);
    }

    const query = `
      query GetInvitation($id: ID!) {
        node(id: $id) {
          ... on ZucityInvitation {
            id
            inviterId
            inviteeId
            resource
            resourceId
            roleId
            status
            createdAt
            expiresAt
          }
        }
      }
    `;

    const result = await composeClient.executeQuery(query, { id: invitationId });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const invitation = result.data?.node;

    if (!invitation) {
      return createErrorResponse('Invitation not found', 404);
    }

    // Validate the invitation is expired
    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      return createErrorResponse('Invitation has expired', 400);
    }

    // Validate the invitation status
    if (invitation.status !== InvitationStatus.PENDING) {
      return createErrorResponse('Invalid invitation status, cannot be rejected', 400);
    }

    // Validate the invitee is the current user
    if (invitation.inviteeId !== operatorId) {
      return createErrorResponse('You do not have permission to reject this invitation', 403);
    }

    // Update invitation status
    const updateMutation = `
      mutation UpdateInvitation($input: UpdateZucityInvitationInput!) {
        updateZucityInvitation(input: $input) {
          document {
            id
            author {
              id
            }
            inviterId
            inviteeId
            resource
            resourceId
            roleId
            status
            message
            isRead
            inviterProfileId
            inviterProfile {
              id
              username
              avatar
            }
            inviteeProfileId
            inviteeProfile {
              id
              username
              avatar
            }
            createdAt
            expiresAt
            updatedAt
            lastSentAt
          }
        }
      }
    `;

    // Authenticate with resource ID
    const error = await authenticateWithSpaceId(invitation.resourceId);
    if (error) {
      return createErrorResponse('Failed to get private key', 500);
    }

    // Update invitation status to rejected
    const updateResult = await composeClient.executeQuery(updateMutation, {
      input: {
        id: invitationId,
        content: {
          status: InvitationStatus.REJECTED,
          isRead: true,
          updatedAt: dayjs().toISOString(),
        },
      },
    });

    if (updateResult.errors) {
      throw new Error(updateResult.errors.map((e: any) => e.message).join(', '));
    }

    const updatedInvitation = updateResult.data?.updateZucityInvitation?.document;
    return createSuccessResponse(updatedInvitation, 'Invitation rejected successfully');
  } catch (error: any) {
    console.error('Failed to reject invitation:', error);
    return createErrorResponse('Failed to reject invitation', 500, error.message);
  }
}); 