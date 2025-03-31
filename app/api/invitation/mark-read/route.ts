import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { composeClient } from '@/constant';

export const dynamic = 'force-dynamic';

const reqBodySchema = z.object({
  invitationId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证请求体
    const validationResult = reqBodySchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse('Invalid request body', 400, validationResult.error.errors);
    }

    const { invitationId } = validationResult.data;

    const mutation = `
      mutation MarkInvitationAsRead($invitationId: ID!) {
        updateZucityInvitation(input: {
          id: $invitationId,
          content: {
            isRead: true
          }
        }) {
          document {
            id
            isRead
          }
        }
      }
    `;

    const error = await authenticateWithSpaceId('');
    if (error) {
      return createErrorResponse('Failed to authenticate with Ceramic', 500);
    }

    const result = await composeClient.executeQuery(mutation, { invitationId });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    if (!result.data?.updateZucityInvitation?.document) {
      return createErrorResponse('Invitation not found', 404);
    }

    return createSuccessResponse({
      message: 'Invitation marked as read successfully',
      data: result.data.updateZucityInvitation.document
    });
  } catch (error: any) {
    console.error('Failed to mark invitation as read:', error);
    return createErrorResponse('Failed to mark invitation as read', 500, error.message);
  }
} 