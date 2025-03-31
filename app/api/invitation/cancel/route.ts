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

const cancelInvitationSchema = z.object({
  invitationId: z.string().min(1, 'Invitation ID is required'),
  id: z.string().min(1, 'Resource ID is required'),
  resource: z.string().min(1, 'Resource type is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = cancelInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format()
      );
    }

    const { invitationId, id, resource } = validationResult.data;
    const operatorId = sessionData.operatorId;

    if (!operatorId) {
      return createErrorResponse('Failed to get user information', 401);
    }

    console.log('Current user DID:', operatorId);

    const query = `
      query GetInvitation($id: ID!) {
        node(id: $id) {
          ... on ZucityInvitation {
            id
            inviterId {
              id
            }
            inviteeId {
              id
            }
            resource
            resourceId
            roleId
            status
            createdAt
            expiresAt
            author {
              id
            }
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

    console.log('Invitation data:', JSON.stringify(invitation, null, 2));

    // 验证邀请是否过期
    const expiresAt = dayjs(invitation.expiresAt);
    if (expiresAt.isBefore(dayjs())) {
      return createErrorResponse('Invitation has expired', 400);
    }

    // 验证邀请状态
    if (invitation.status !== InvitationStatus.PENDING) {
      return createErrorResponse('Invalid invitation status, cannot be cancelled', 400);
    }

    // 获取邀请者DID
    const inviterDid = invitation.inviterId?.id;
    const authorDid = invitation.author?.id;

    console.log('Inviter DID:', inviterDid);
    console.log('Author DID:', authorDid);
    console.log('Comparing with operatorId:', operatorId);

    // 验证当前用户是邀请发送者或作者
    // 使用字符串比较确保类型一致
    const isInviter = String(inviterDid) === String(operatorId);

    if (!isInviter) {
      return createErrorResponse('You do not have permission to cancel this invitation', 403);
    }

    // 更新邀请状态
    const updateMutation = `
      mutation UpdateInvitation($input: UpdateZucityInvitationInput!) {
        updateZucityInvitation(input: $input) {
          document {
            id
            author {
              id
            }
            inviterId {
              id
            }
            inviteeId {
              id
            }
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

    // 使用资源ID进行认证
    const error = await authenticateWithSpaceId(invitation.resourceId);
    if (error) {
      return createErrorResponse('Failed to get private key', 500);
    }

    // 更新邀请状态为已取消
    const updateResult = await composeClient.executeQuery(updateMutation, {
      input: {
        id: invitationId,
        content: {
          status: InvitationStatus.CANCELLED,
          updatedAt: dayjs().toISOString(),
        },
      },
    });

    if (updateResult.errors) {
      throw new Error(updateResult.errors.map((e: any) => e.message).join(', '));
    }

    const updatedInvitation = updateResult.data?.updateZucityInvitation?.document;
    return createSuccessResponse(updatedInvitation, '邀请已成功取消');
  } catch (error: any) {
    console.error('Failed to cancel invitation:', error);
    return createErrorResponse('Failed to cancel invitation', 500, error.message);
  }
}); 