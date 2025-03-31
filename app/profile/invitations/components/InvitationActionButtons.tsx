import { memo } from 'react';
import { Button } from '@/components/base';
import { InvitationStatus } from '@/types/invitation';
import { useRouter } from 'next/navigation';

interface InvitationActionButtonsProps {
  invitation: {
    id: string;
    status: string;
    resource: string;
    resourceId: string;
    space?: {
      id?: string;
    };
    event?: {
      id?: string;
    };
  };
  processing: Record<
    string,
    {
      type: 'accept' | 'reject';
      isProcessing: boolean;
    }
  >;
  onAccept: (invitation: any) => Promise<void>;
  onReject: (invitation: any) => Promise<void>;
  getResourceName: (invitation: any) => string;
}

export const InvitationActionButtons = memo(
  ({
    invitation,
    processing,
    onAccept,
    onReject,
    getResourceName,
  }: InvitationActionButtonsProps) => {
    const router = useRouter();
    const curProcess = processing[invitation.id];
    const isProcessing = curProcess && curProcess.isProcessing;
    const isProcessAccept = isProcessing && curProcess.type === 'accept';
    const isProcessReject = isProcessing && curProcess.type === 'reject';

    if (invitation.status === InvitationStatus.PENDING) {
      return (
        <div className="flex gap-3 mt-3">
          <Button
            color="submit"
            onPress={() => onAccept(invitation)}
            isDisabled={isProcessing}
            isLoading={isProcessAccept}
          >
            {isProcessAccept ? 'Processing...' : 'Accept'}
          </Button>
          <Button
            color="dark"
            className="bg-transparent border border-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2"
            onPress={() => onReject(invitation)}
            isDisabled={isProcessing}
            isLoading={isProcessReject}
          >
            {isProcessReject ? 'Processing...' : 'Reject'}
          </Button>
        </div>
      );
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      return (
        <div className="flex gap-3 mt-3">
          <Button
            color="primary"
            onPress={() => {
              if (invitation.resource === 'space' && invitation.resourceId) {
                router.push(`/spaces/${invitation.resourceId}`);
              } else if (invitation.resource === 'event' && invitation.event) {
                router.push(
                  `/spaces/${invitation.space?.id}/events/${invitation.resourceId}`,
                );
              }
            }}
          >
            View {getResourceName(invitation)}
          </Button>
        </div>
      );
    }

    return null;
  },
);

InvitationActionButtons.displayName = 'InvitationActionButtons';
