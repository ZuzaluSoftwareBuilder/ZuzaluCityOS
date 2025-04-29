import { getSpaceGatingRepository } from '@/repositories/spaceGating';
import { PermissionName } from '@/types';
import { withSessionValidation } from '@/utils/authMiddleware';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import {
  createErrorResponse,
  createSuccessResponse,
} from '@/utils/service/response';
import { hasRequiredPermission } from '@/utils/service/role';
import { z } from 'zod';

const deleteRuleSchema = z.object({
  id: z.string().min(1, 'Resource ID is required'),
  ruleId: z.string().min(1, 'Rule ID is required'),
});

export const POST = withSessionValidation(async (request, sessionData) => {
  try {
    const body = await request.json();
    const validationResult = deleteRuleSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse(
        'Invalid request parameters',
        400,
        validationResult.error.format(),
      );
    }
    const { id, ruleId } = validationResult.data;

    if (!hasRequiredPermission(sessionData, PermissionName.MANAGE_ACCESS)) {
      return createErrorResponse('Permission denied', 403);
    }

    const error = await authenticateWithSpaceId(id);
    if (error) {
      return createErrorResponse('Error getting private key', 500);
    }
    const result = await getSpaceGatingRepository().delete(ruleId);

    if (result.error) {
      return createErrorResponse('Failed to delete rule', 500);
    }

    return createSuccessResponse('Rule deleted');
  } catch (error: unknown) {
    console.error('Error deleting rule:', error);
    return createErrorResponse('Internal server error', 500);
  }
});
