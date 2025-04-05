import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import { z } from 'zod';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { PermissionName } from '@/types';
import { CREATE_SPACE_GATING_RULE } from '@/services/graphql/spaceGating';

const createRuleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  poapsId: z.array(z.number()).optional(),
  zuPassInfo: z
    .object({
      registration: z.string().min(1, 'Registration is required'),
      eventId: z.string().min(1, 'Event ID is required'),
      eventName: z.string().min(1, 'Event name is required'),
    })
    .optional(),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = createRuleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, poapsId, zuPassInfo } = validationResult.data;

    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_ACCESS)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    const result = await executeQuery(CREATE_SPACE_GATING_RULE, {
      input: {
        content: {
          spaceId: id,
          ...(poapsId && { poapsId: poapsId.map((id) => ({ poapId: id })) }),
          ...(zuPassInfo && { zuPassInfo }),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to create rule', 500);
    }

    return createSuccessResponse('Rule created');
  } catch (error: unknown) {
    console.error('Error creating rule:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
