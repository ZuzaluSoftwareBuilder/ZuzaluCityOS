import { memo } from 'react';
import { Avatar, cn } from '@heroui/react';
import { Invitation, InvitationStatus } from '@/types/invitation';
import { InvitationActionButtons } from './InvitationActionButtons';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface InvitationListProps {
  invitations: Invitation[];
  processing: Record<
    string,
    {
      type: 'accept' | 'reject';
      isProcessing: boolean;
    }
  >;
  onAccept: (invitation: Invitation) => Promise<void>;
  onReject: (invitation: Invitation) => Promise<void>;
}

export const InvitationList = memo(
  ({ invitations, processing, onAccept, onReject }: InvitationListProps) => {
    const getResourceName = (invitation: Invitation) => {
      switch (invitation.resource) {
        case 'space':
          return invitation.space?.name || 'space';
        case 'event':
          return invitation.event?.title || 'event';
        default:
          return 'unknown resource';
      }
    };

    const getResourceAvatar = (invitation: Invitation) => {
      switch (invitation.resource) {
        case 'space':
          return invitation.space?.avatar || '/default-space.png';
        case 'event':
          return invitation.event?.imageUrl || '/default-event.png';
        default:
          return '/default-resource.png';
      }
    };

    const formatTime = (dateString: string) => {
      try {
        return formatDistanceToNow(new Date(dateString), {
          addSuffix: true,
          locale: enUS,
        });
      } catch (e) {
        return 'Unknown Time';
      }
    };

    const getInvitationStatusBadge = (status: InvitationStatus) => {
      const commonClassNames = 'rounded px-2 py-1 text-xs';
      const colorMap: Record<InvitationStatus, string> = {
        [InvitationStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400',
        [InvitationStatus.ACCEPTED]: 'bg-green-500/20 text-green-400',
        [InvitationStatus.REJECTED]: 'bg-red-500/20 text-red-400',
        [InvitationStatus.CANCELLED]: 'bg-gray-500/20 text-gray-400',
        [InvitationStatus.INVALID]: 'bg-gray-500/20 text-gray-400',
      };
      const textMap: Record<InvitationStatus, string> = {
        [InvitationStatus.PENDING]: 'Pending',
        [InvitationStatus.ACCEPTED]: 'Accepted',
        [InvitationStatus.REJECTED]: 'Rejected',
        [InvitationStatus.CANCELLED]: 'Cancelled',
        [InvitationStatus.INVALID]: 'Invalid',
      };
      return (
        <span className={cn(commonClassNames, colorMap[status])}>
          {textMap[status]}
        </span>
      );
    };

    if (invitations.length === 0) {
      return (
        <div className="py-8 text-center text-white">
          <p>No Invitations</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex justify-between rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(44,44,44,0.8)] p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar
                src={getResourceAvatar(invitation)}
                alt={getResourceName(invitation)}
                className="size-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getInvitationStatusBadge(invitation.status)}
                    <h3 className="font-medium text-white">
                      {invitation.inviterProfile?.username || 'Unknown User'}{' '}
                      invited you to join {getResourceName(invitation)}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {formatTime(invitation.createdAt)}
                    </span>
                  </div>
                </div>

                {invitation.message && (
                  <p className="my-2 text-sm text-gray-400">
                    {invitation.message}
                  </p>
                )}
              </div>
            </div>

            <InvitationActionButtons
              invitation={invitation}
              processing={processing}
              onAccept={onAccept}
              onReject={onReject}
              getResourceName={getResourceName}
            />
          </div>
        ))}
      </div>
    );
  },
);

InvitationList.displayName = 'InvitationList';
