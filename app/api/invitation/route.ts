import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withSessionValidation } from '@/utils/authMiddleware';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';
import { InvitationStatus } from '@/types/invitation';
import { dayjs } from '@/utils/dayjs';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { composeClient } from '@/constant';

export const dynamic = 'force-dynamic';

const createInvitationSchema = z.object({
  inviteeId: z.string().min(1, 'Invitee ID is required'),
  resourceId: z.string().min(1, 'Resource ID is required'),
  resourceType: z.string().min(1, 'Resource type is required'),
  roleId: z.string().min(1, 'Role ID is required'),
  message: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = createInvitationSchema.safeParse(body);

    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format()
      );
    }

    const { inviteeId, resourceId, resourceType, roleId, message, expiresAt } = validationResult.data;

    // Verify permissions
    if (!hasRequiredPermission(sessionData, PermissionName.INVITE_USERS)) {
      return createErrorResponse('Permission denied', 403);
    }

    // Set expiration time, default is 7 days from now
    const defaultExpiration = dayjs().add(7, 'day');
    const expirationDate = expiresAt ? dayjs(expiresAt) : defaultExpiration;

    // TODO: Check if invited user exists

    // Use ceramic client
    const error = await authenticateWithSpaceId(resourceId);
    if (error) {
      return createErrorResponse('Failed to get private key', 500);
    }

    // Create invitation record
    const newInvitation = {
      inviterId: sessionData.operatorId,
      inviteeId,
      resource: resourceType,
      resourceId,
      roleId,
      status: InvitationStatus.PENDING,
      message: message || '',
      isRead: false,
      createdAt: dayjs().toISOString(),
      expiresAt: expirationDate.toISOString(),
      lastSentAt: dayjs().toISOString(),
    };

    const mutation = `
      mutation CreateInvitation($input: CreateZucityInvitationInput!) {
        createZucityInvitation(input: $input) {
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
            createdAt
            expiresAt
            lastSentAt
          }
        }
      }
    `;

    const result = await composeClient.executeQuery(mutation, {
      input: { content: newInvitation }
    });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const createdInvitation = result.data?.createZucityInvitation?.document;

    return createSuccessResponse(createdInvitation, 'Invitation created successfully');
  } catch (error: any) {
    console.error('Failed to create invitation:', error);
    return createErrorResponse('Failed to create invitation', 500, error.message);
  }
});

// Get invitation list API
export const GET = withSessionValidation(async (request, sessionData) => {
  try {
    const url = new URL(request.url);
    const resourceId = url.searchParams.get('resourceId');
    const resourceType = url.searchParams.get('resourceType');
    const status = url.searchParams.get('status');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    // If resource ID and type are provided, verify user has permission to access invitations for this resource
    if (resourceId && resourceType) {
      if (!hasRequiredPermission(sessionData, PermissionName.INVITE_USERS)) {
        return createErrorResponse('Permission denied', 403);
      }
    }

    let query = `
      query GetInvitations($first: Int, $after: String) {
        zucityInvitationIndex(first: $first, after: $after) {
          edges {
            node {
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
              createdAt
              expiresAt
              updatedAt
              lastSentAt
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `;

    // If filters are provided, modify the query
    if (resourceId || resourceType || status) {
      // Build filter conditions
      const filters = [];

      if (resourceId) {
        filters.push(`resourceId: { equalTo: "${resourceId}" }`);
      }

      if (resourceType) {
        filters.push(`resource: { equalTo: "${resourceType}" }`);
      }

      if (status) {
        filters.push(`status: { equalTo: "${status}" }`);
      }

      const filterString = filters.join(', ');

      query = `
        query GetInvitations($first: Int, $after: String) {
          zucityInvitationIndex(
            first: $first, 
            after: $after, 
            filters: { ${filterString} }
          ) {
            edges {
              node {
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
                createdAt
                expiresAt
                updatedAt
                lastSentAt
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `;
    }

    const paginationVariables = {
      first: limit,
      after: offset > 0 ? `${offset}` : null,
    };

    // Validate and add ceramic DID
    const error = await authenticateWithSpaceId(resourceId || '');
    if (error) {
      return createErrorResponse('Failed to get private key', 500);
    }

    const result = await composeClient.executeQuery(query, paginationVariables);

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const invitationsData = result.data?.zucityInvitationIndex?.edges || [];
    const invitations = invitationsData.map((edge: any) => edge.node);
    const total = invitationsData.length || 0;

    return createSuccessResponse({
      invitations,
      total,
      pagination: {
        offset,
        limit,
        hasMore: result.data?.zucityInvitationIndex?.pageInfo?.hasNextPage || false,
      }
    });
  } catch (error: any) {
    console.error('Failed to get invitation list:', error);
    return createErrorResponse('Failed to get invitation list', 500, error.message);
  }
}); 