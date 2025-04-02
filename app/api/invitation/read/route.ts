import { NextRequest } from 'next/server';
import { withBasicSessionValidation } from '@/utils/authMiddleware';
import { withInvitationValidation } from '@/middleware/invitationMiddleware';
import { createSuccessResponse } from '@/utils/service/response';
import { InvitationService } from '@/services/invitation/InvitationService';
import { SessionData } from '@/types/session';

export const dynamic = 'force-dynamic';

const handleMarkInvitationAsRead = async (
  req: NextRequest,
  sessionData: SessionData,
) => {
  const { invitation } = sessionData;

  if (!invitation) {
    throw new Error('Invitation not found in session data');
  }

  const invitationService = InvitationService.getInstance();
  const updatedInvitation = await invitationService.updateInvitationStatus(
    invitation.id,
    invitation.status,
    {
      isRead: 'true',
    },
  );

  return createSuccessResponse(
    updatedInvitation,
    'Invitation marked as read successfully',
  );
};

export const POST = withBasicSessionValidation(
  withInvitationValidation(handleMarkInvitationAsRead, {
    validateInvitee: true,
  }),
);
