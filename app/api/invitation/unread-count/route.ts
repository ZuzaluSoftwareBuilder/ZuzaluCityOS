import { NextRequest } from 'next/server';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { composeClient } from '@/constant';
import { InvitationStatus } from '@/types/invitation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    const query = `
      query GetUnreadInvitationsCount($userId: ID!) {
        zucityInvitationCount(
          filters: { 
            where: { 
              inviteeId: { equalTo: $userId }, 
              status: { equalTo: "${InvitationStatus.PENDING}" },
              isRead: { equalTo: false }
            } 
          }
        )
      }
    `;

    const error = await authenticateWithSpaceId('');
    if (error) {
      return createErrorResponse('Failed to authenticate with Ceramic', 500);
    }

    const result = await composeClient.executeQuery(query, { userId });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const count = result.data?.zucityInvitationCount || 0;

    return createSuccessResponse({ count });
  } catch (error: any) {
    console.error('Failed to get unread invitations count:', error);
    return createErrorResponse('Failed to get unread invitations count', 500, error.message);
  }
} 