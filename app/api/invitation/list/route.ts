import { NextRequest } from 'next/server';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import { composeClient } from '@/constant';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return createErrorResponse('User ID is required', 400);
    }

    // 获取发送给用户的所有邀请，不限制状态
    const query = `
      query GetUserAllInvitations($userId: ID!) {
        zucityInvitationIndex(
          first: 100,
          sortBy: CREATED_AT_DESC,
          filters: { where: { inviteeId: { equalTo: $userId } } }
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

    // 使用一个默认空间ID进行认证
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
    console.error('Failed to get user invitations:', error);
    return createErrorResponse('Failed to get user invitations', 500, error.message);
  }
} 