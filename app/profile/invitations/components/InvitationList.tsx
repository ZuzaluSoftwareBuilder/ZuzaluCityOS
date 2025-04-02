import { memo } from 'react';
import { Avatar } from '@heroui/react';
import { InvitationStatus } from '@/types/invitation';
import { InvitationActionButtons } from './InvitationActionButtons';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface Invitation {
  id: string;
  inviterProfile?: {
    username?: string;
    avatar?: string;
  };
  space?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  event?: {
    id?: string;
    name?: string;
    avatar?: string;
  };
  resource: string;
  resourceId: string;
  status: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  inviteeId: string;
}

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
          return invitation.event?.name || 'event';
        default:
          return 'unknown resource';
      }
    };

    const getResourceAvatar = (invitation: Invitation) => {
      switch (invitation.resource) {
        case 'space':
          return invitation.space?.avatar || '/default-space.png';
        case 'event':
          return invitation.event?.avatar || '/default-event.png';
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

    const getInvitationStatusBadge = (status: string) => {
      switch (status) {
        case InvitationStatus.PENDING:
          return (
            <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">
              Pending
            </span>
          );
        case InvitationStatus.ACCEPTED:
          return (
            <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
              Accepted
            </span>
          );
        case InvitationStatus.REJECTED:
          return (
            <span className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-400">
              Rejected
            </span>
          );
        case InvitationStatus.CANCELLED:
          return (
            <span className="rounded bg-gray-500/20 px-2 py-1 text-xs text-gray-400">
              Cancelled
            </span>
          );
        default:
          return (
            <span className="rounded bg-gray-500/20 px-2 py-1 text-xs text-gray-400">
              {status}
            </span>
          );
      }
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
