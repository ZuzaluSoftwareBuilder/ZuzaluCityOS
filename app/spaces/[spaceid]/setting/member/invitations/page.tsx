'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_INVITATIONS_QUERY } from '@/services/graphql/invitation';
import {
  Card,
  CardBody,
  Chip,
  Avatar,
  Spinner,
  useDisclosure,
} from '@heroui/react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/base'
import { useCeramicContext } from '@/context/CeramicContext';
import { cancelInvitation } from '@/services/invitation';
import { format } from 'date-fns';
import { X } from '@phosphor-icons/react';

// 定义完整的类型用于类型安全
interface InvitationProfile {
  id?: string;
  username?: string;
  avatar?: string | null;
  address?: string;
  __typename?: string;
}

interface Invitation {
  id: string;
  status: string;
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
        data.data?.zucityInvitationIndex?.edges?.map((item) => item?.node) ||
        [],
      enabled: !!spaceId,
    },
  );

  const handleCancelInvitation = async () => {
    if (!selectedInvitation) return;

    try {
      setIsLoading(true);
      const { id, resourceId, resource } = selectedInvitation;
      const result = await cancelInvitation({
        invitationId: id,
        resourceId: resourceId as string,
        resource: resource as string
      });
      if (result.success) {
        console.log('邀请已成功取消:', result);
        refetch();
        onClose();
      } else {
        console.error('取消邀请失败:', result.message);
      }
    } catch (error) {
      console.error('取消邀请出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    onOpen();
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'default';

    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return '未知状态';

    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '未知时间';

    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-[24px]">
      {isInvitationsLoading ? (
        <div className="flex justify-center items-center p-10">
          <Spinner size="lg" color="primary" />
        </div>
      ) : !invitations || invitations.length === 0 ? (
        <Card className="bg-white/[0.02] border border-white/10">
          <CardBody className="p-6 text-center text-white/60">
            <p>暂无邀请记录</p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {invitations.map((invitation) => {
            if (!invitation) return null;
            return (
              <Card
                key={invitation.id}
                className="bg-white/[0.02] border border-white/10"
              >
                <CardBody className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={
                          invitation.inviteeProfile?.avatar ||
                          '/user/avatar_p.png'
                        }
                        fallback="U"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-white font-medium">
                          {invitation.inviteeProfile?.username || 'Unknown User'}
                        </p>
                        <Chip
                          color={getStatusColor(invitation.status)}
                          variant="flat"
                          size="sm"
                          className="mt-1"
                        >
                          {getStatusText(invitation.status)}
                        </Chip>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-white/60 text-sm mb-1">
                        Invite Time: {formatDate(invitation.createdAt)}
                      </p>
                      <p className="text-white/60 text-sm">
                        Expired Time: {formatDate(invitation.expiresAt)}
                      </p>

                    </div>
                  </div>

                  {invitation.message && (
                    <div className="mt-3 p-3 bg-white/5 rounded-md">
                      <p className="text-white/80 text-sm">
                        {invitation.message}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    {invitation.status === 'pending' &&
                      currentUserDid &&
                      invitation.inviterId?.id === currentUserDid && (
                        <Button
                          color="danger"
                          variant="flat"
                          size="sm"
                          className="mt-2"
                          startContent={<X size={16} />}
                          onPress={() =>
                            openCancelModal(invitation as Invitation)
                          }
                        >
                          Cancel Invitation
                        </Button>
                      )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="text-white p-[20px]">Cancel Invitation Confirm</ModalHeader>
          <ModalBody className="text-white/80">
            <p>
              Are you sure you want to cancel the invitation sent to {selectedInvitation?.inviteeProfile?.username || '此用户'}{' '}?
            </p>
            <p className="text-white/60 mt-2 text-sm">This operation cannot be revoked.</p>
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
