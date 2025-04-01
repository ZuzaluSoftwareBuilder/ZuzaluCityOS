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
            <span className="bg-yellow-500/20 text-yellow-400 text-xs py-1 px-2 rounded">
              Pending
            </span>
          );
        case InvitationStatus.ACCEPTED:
          return (
            <span className="bg-green-500/20 text-green-400 text-xs py-1 px-2 rounded">
              Accepted
            </span>
          );
        case InvitationStatus.REJECTED:
          return (
            <span className="bg-red-500/20 text-red-400 text-xs py-1 px-2 rounded">
              Rejected
            </span>
          );
        case InvitationStatus.CANCELLED:
          return (
            <span className="bg-gray-500/20 text-gray-400 text-xs py-1 px-2 rounded">
              Cancelled
            </span>
          );
        default:
          return (
            <span className="bg-gray-500/20 text-gray-400 text-xs py-1 px-2 rounded">
              {status}
            </span>
          );
      }
    };

    if (invitations.length === 0) {
      return (
        <div className="text-white text-center py-8">
          <p>No Invitations</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex justify-between bg-[rgba(44,44,44,0.8)] rounded-lg p-4 border border-[rgba(255,255,255,0.1)]"
          >
            <div className="flex items-start gap-3">
              <Avatar
                src={getResourceAvatar(invitation)}
                alt={getResourceName(invitation)}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    {getInvitationStatusBadge(invitation.status)}
                    <h3 className="text-white font-medium">
                      {invitation.inviterProfile?.username || 'Unknown User'}{' '}
                      invited you to join {getResourceName(invitation)}
                    </h3>
                    <span className="text-gray-400 text-sm">
                      {formatTime(invitation.createdAt)}
                    </span>
                  </div>
                </div>

                {invitation.message && (
                  <p className="text-gray-400 my-2 text-sm">{invitation.message}</p>
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
