'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_INVITATIONS_QUERY } from '@/services/graphql/invitation';
import {
  Card,
  CardBody,
  Chip,
  Avatar,
  Spinner,
  useDisclosure,
  addToast,
} from '@heroui/react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/base';
import { useCeramicContext } from '@/context/CeramicContext';
import { format } from 'date-fns';
import { X } from '@phosphor-icons/react';
import { InvitationStatus } from '@/types/invitation';
import { cancelInvitation } from '@/services/invitation';

interface InvitationProfile {
  id?: string;
  username?: string;
  avatar?: string | null;
  address?: string;
  __typename?: string;
}

interface Invitation {
  id: string;
  status: InvitationStatus;
  message?: string | null;
  createdAt: string;
  expiresAt: string;
  inviterId?: {
    id: string;
  };
  inviterProfile?: InvitationProfile | null;
  inviteeProfile?: InvitationProfile | null;
  resource?: string;
  resourceId?: string;
  isRead?: string;
  __typename?: string;
}

const InvitationsPage = () => {
  const params = useParams();
  const spaceId = params?.spaceid as string;
  const { profile } = useCeramicContext();
  const currentUserDid = profile?.author?.id;
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    data: invitations,
    isLoading: isInvitationsLoading,
    refetch,
  } = useGraphQL(
    ['GET_INVITATIONS_QUERY', spaceId],
    GET_INVITATIONS_QUERY,
    {
      resourceId: spaceId,
    },
    {
      select: (data) =>
        data.data?.zucityInvitationIndex?.edges
          ?.map((item) => item?.node)
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(b?.createdAt || '').getTime() -
              new Date(a?.createdAt || '').getTime(),
          ) || [],
      enabled: !!spaceId,
    },
  );

  useEffect(() => {
    console.log('space invitations', invitations);
  }, [invitations]);

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) return;

    try {
      setIsLoading(true);
      const result = await cancelInvitation({
        invitationId: selectedInvitation.id,
      });
      if (result.success) {
        console.log('Invitation has been successfully cancelled:', result);
        addToast({
          title: 'Invitation has been successfully cancelled',
          color: 'primary',
        });
        refetch();
        onClose();
      } else {
        console.error('Failed to cancel invitation:', result.message);
      }
    } catch (error) {
      addToast({
        title: 'Failed to cancel invitation',
        color: 'danger',
      });
      console.error('Failed to cancel invitation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    onOpen();
  };

  const getStatusColor = (status: InvitationStatus) => {
    if (!status) return 'default';
    const statusLowerCase = status.toLowerCase() as InvitationStatus;
    const statusColorMap: Record<InvitationStatus, string> = {
      [InvitationStatus.PENDING]: 'warning',
      [InvitationStatus.ACCEPTED]: 'success',
      [InvitationStatus.REJECTED]: 'danger',
      [InvitationStatus.CANCELLED]: 'default',
    };
    return statusColorMap[statusLowerCase] || 'default';
  };

  const getStatusText = (status: InvitationStatus) => {
    if (!status) return 'Unknown Status';
    const statusLowerCase = status.toLowerCase() as InvitationStatus;
    const statusTextMap: Record<InvitationStatus, string> = {
      [InvitationStatus.PENDING]: 'Pending',
      [InvitationStatus.ACCEPTED]: 'Accepted',
      [InvitationStatus.REJECTED]: 'Rejected',
      [InvitationStatus.CANCELLED]: 'Cancelled',
    };
    return statusTextMap[statusLowerCase] || 'Unknown Status';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown Date';

    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-[24px]">
      {isInvitationsLoading ? (
        <div className="flex items-center justify-center p-10">
          <Spinner size="lg" color="primary" />
        </div>
      ) : !invitations || invitations.length === 0 ? (
        <Card className="border border-white/10 bg-white/[0.02]">
          <CardBody className="p-6 text-center text-white/60">
            <p>No invitations found</p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {invitations.map((invitation) => {
            if (!invitation) return null;
            return (
              <Card
                key={invitation.id}
                className="border border-white/10 bg-white/[0.02]"
              >
                <CardBody className="p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-3">
                      <Avatar
                        src={
                          invitation.inviteeProfile?.avatar ||
                          '/user/avatar_p.png'
                        }
                        fallback="U"
                        className="size-8 shrink-0 rounded-full"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Chip
                            color={
                              getStatusColor(
                                invitation.status as InvitationStatus,
                              ) as any
                            }
                            variant="flat"
                            size="sm"
                          >
                            {getStatusText(
                              invitation.status as InvitationStatus,
                            )}
                          </Chip>
                          <p className="text-sm font-medium text-white">
                            {invitation.inviteeProfile?.username ||
                              'Unknown User'}
                          </p>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4">
                          <p className="text-xs text-white/60">
                            Invite: {formatDate(invitation.createdAt)}
                          </p>
                          <p className="text-xs text-white/60">
                            Expire: {formatDate(invitation.expiresAt)}
                          </p>
                        </div>
                        {invitation.message && (
                          <div className="mt-2">
                            <p className="line-clamp-2 text-xs text-white/80">
                              {invitation.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {invitation.status === 'pending' &&
                        currentUserDid &&
                        invitation.inviterId?.id === currentUserDid && (
                          <Button
                            variant="flat"
                            size="sm"
                            startContent={<X size={14} />}
                            onPress={() =>
                              openCancelModal(invitation as Invitation)
                            }
                          >
                            Cancel
                          </Button>
                        )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="p-[20px] text-white">
            Cancel Invitation Confirm
          </ModalHeader>
          <ModalBody className="text-white/80">
            <p>
              Are you sure you want to cancel the invitation sent to{' '}
              {selectedInvitation?.inviteeProfile?.username || 'the user'} ?
            </p>
            <p className="mt-2 text-sm text-white/60">
              This operation cannot be revoked.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              variant="flat"
              onPress={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={handleCancelInvitation}
              isLoading={isLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InvitationsPage;
