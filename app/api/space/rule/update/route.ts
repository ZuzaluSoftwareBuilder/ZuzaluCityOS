import { UPDATE_SPACE_GATING_RULE } from '@/services/graphql/spaceGating';
import { PermissionName } from '@/types';
import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId, executeQuery } from '@/utils/ceramic';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { z } from 'zod';

const updateRuleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  ruleId: z.string().min(1, 'Rule ID is required'),
  gatingStatus: z.string().optional(),
  poapsId: z.array(z.number()).nullable().optional(),
  zuPassInfo: z
    .object({
      registration: z.string().min(1, 'Registration is required'),
      eventId: z.string().min(1, 'Event ID is required'),
      eventName: z.string().min(1, 'Event name is required'),
    })
    .nullable()
    .optional(),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = updateRuleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { poapsId, zuPassInfo, ruleId, gatingStatus, id } =
      validationResult.data;

    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_ACCESS)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    const updateRule = !!poapsId || !!zuPassInfo;
    const result = await executeQuery(UPDATE_SPACE_GATING_RULE, {
      input: {
        id: ruleId,
        content: {
          ...(updateRule && {
            poapsId: null,
            zuPassInfo: null,
          }),
          ...(poapsId && { poapsId: poapsId.map((id) => ({ poapId: id })) }),
          ...(zuPassInfo && { zuPassInfo }),
          ...(gatingStatus && { gatingStatus }),
        },
      },
    });

    if (result.errors) {
      return createErrorResponse('Failed to update rule', 500);
    }

    return createSuccessResponse('Rule updated');
  } catch (error: unknown) {
    console.error('Error updating rule:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
