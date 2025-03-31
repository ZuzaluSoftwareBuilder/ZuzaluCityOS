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
      query GetUserInvitations($userId: ID!) {
        zucityInvitationIndex(
          first: 100,
          filters: { where: { inviteeId: { equalTo: $userId }, status: { equalTo: "${InvitationStatus.PENDING}" } } }
        ) {
          edges {
            node {
              id
              author {
                id
              }
              inviterId {
                id
              }
              inviterProfile {
                id
                username
                avatar
              }
              resource
              resourceId
              roleId
              status
              message
              isRead
              createdAt
              expiresAt
              updatedAt
              lastSentAt
              spaceId
              space {
                id
                name
                avatar
              }
              eventId
              event {
                id
                name
                avatar
              }
            }
          }
        }
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

    const invitations = result.data?.zucityInvitationIndex?.edges?.map(edge => edge.node) || [];

    return createSuccessResponse({
      data: invitations,
      count: invitations.length
    });
  } catch (error: any) {
    console.error('Failed to get pending invitations:', error);
    return createErrorResponse('Failed to get pending invitations', 500, error.message);
  }
} 