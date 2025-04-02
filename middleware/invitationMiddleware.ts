import { NextRequest, NextResponse } from 'next/server';
import {
  InvitationService,
  InvitationError,
} from '@/services/invitation/InvitationService';
import { createErrorResponse } from '@/utils/service/response';
import { InvitationStatus } from '@/types/invitation';
import { SessionData } from '@/types/session';

type InvitationHandler = (
  req: NextRequest,
  sessionData: SessionData,
) => Promise<NextResponse>;

interface WithInvitationOptions {
  expectedStatus?: InvitationStatus;
  validateInvitee?: boolean;
  validateInviter?: boolean;
}

export const withInvitationValidation = (
  handler: InvitationHandler,
  options: WithInvitationOptions = {},
) => {
  return async (
    req: NextRequest,
    sessionData: SessionData,
  ): Promise<NextResponse> => {
    try {
      const invitationService = InvitationService.getInstance();
      const body = await req.json();
      const invitationId = body?.invitationId;

      if (!invitationId) {
        return createErrorResponse('Invitation ID is required', 400);
      }

      if (!sessionData.operatorId) {
        return createErrorResponse('Failed to get user information', 401);
      }

      const invitation = await invitationService.getInvitation(invitationId);

      await invitationService.validateInvitation(
        invitation,
        options.expectedStatus,
      );

      if (options.validateInvitee) {
        invitationService.validatePermission(
          invitation,
          sessionData.operatorId,
          true,
        );
      }

      if (options.validateInviter) {
        invitationService.validatePermission(
          invitation,
          sessionData.operatorId,
          false,
        );
      }

      const enhancedSessionData: SessionData = {
        ...sessionData,
        invitation,
      };

      return handler(req, enhancedSessionData);
    } catch (error) {
      if (error instanceof InvitationError) {
        return createErrorResponse(error.message, 400, {
          code: error.code,
          details: error.details,
        });
      }
      console.error('Invitation middleware error:', error);
      return createErrorResponse('Internal server error', 500);
    }
  };
};
