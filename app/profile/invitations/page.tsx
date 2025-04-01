'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { acceptInvitation, rejectInvitation } from '@/services/invitation';
import { Tabs, Tab, addToast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { InvitationStatus } from '@/types/invitation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_INVITATION_QUERY } from '@/services/graphql/invitation';
import useDid from '@/hooks/useDid';
import Loading from '@/app/loading';
import { InvitationList } from './components/InvitationList';

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

enum TabType {
  ALL = 'all',
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

const NotificationsPage: React.FC = () => {
  const { did: userDid } = useDid();
  const { profile } = useCeramicContext();
  const userId = profile?.author?.id || '';
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.ALL);
  const [processing, setProcessing] = useState<
    Record<
      string,
      {
        type: 'accept' | 'reject';
        isProcessing: boolean;
      }
    >
  >({});

  const {
    data: userInvitations,
    isLoading: isInvitationsLoading,
    refetch,
  } = useGraphQL(
    ['GET_USER_INVITATION_QUERY', userDid],
    GET_USER_INVITATION_QUERY,
    { inviteeId: userDid },
    {
      enabled: !!userDid,
      select: (data) =>
        data?.data?.zucityInvitationIndex?.edges
          ?.map((item) => item?.node)
          .filter((e) => !!e) || [],
    },
  );

  useEffect(() => {
    console.log('userInvitations', userInvitations);
  }, [userInvitations]);

  const {
    allInvitations,
    pendingInvitations,
    acceptedInvitations,
    rejectedInvitations,
    cancelledInvitations,
  } = useMemo(() => {
    if (!userInvitations || userInvitations.length === 0)
      return {
        allInvitations: [],
        pendingInvitations: [],
        acceptedInvitations: [],
        rejectedInvitations: [],
        cancelledInvitations: [],
      };

    const mapInvitation = (inv: any): Invitation => ({
      id: inv.id,
      inviterProfile: inv.inviterProfile
        ? {
            username: inv.inviterProfile.username,
            avatar: inv.inviterProfile.avatar,
          }
        : undefined,
      space: inv.space,
      event: inv.event,
      resource: inv.resource,
      resourceId: inv.resourceId,
      status: inv.status,
      message: inv.message,
      isRead: inv.isRead,
      createdAt: inv.createdAt,
      inviteeId: userId,
    });

    const all = [...userInvitations]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map(mapInvitation);

    const pending = userInvitations
      .filter((inv) => inv.status === InvitationStatus.PENDING)
      .map(mapInvitation);

    const accepted = userInvitations
      .filter((inv) => inv.status === InvitationStatus.ACCEPTED)
      .map(mapInvitation);

    const rejected = userInvitations
      .filter((inv) => inv.status === InvitationStatus.REJECTED)
      .map(mapInvitation);

    const cancelled = userInvitations
      .filter((inv) => inv.status === InvitationStatus.CANCELLED)
      .map(mapInvitation);

    return {
      allInvitations: all,
      pendingInvitations: pending,
      acceptedInvitations: accepted,
      rejectedInvitations: rejected,
      cancelledInvitations: cancelled,
    };
  }, [userId, userInvitations]);

  const handleAccept = useCallback(
    async (invitation: Invitation) => {
      setProcessing({
        ...processing,
        [invitation.id]: {
          type: 'accept',
          isProcessing: true,
        },
      });
      try {
        const result = await acceptInvitation({
          invitationId: invitation.id,
          userId: invitation.inviteeId,
        });

        if (result.success) {
          addToast({
            title: 'Invitation accepted',
            description: 'You have successfully accepted the invitation',
            color: 'success',
          });
          refetch();
          if (invitation.resource === 'space' && invitation.space) {
            router.push(`/spaces/${invitation.resourceId}`);
          } else if (invitation.resource === 'event' && invitation.event) {
            router.push(
              `/spaces/${invitation.space?.id}/events/${invitation.resourceId}`,
            );
          }
        } else {
          addToast({
            title: 'Operation failed',
            description:
              result.message ||
              'Failed to accept invitation, please try again later',
            color: 'danger',
          });
        }
      } catch (error) {
        addToast({
          title: 'Operation failed',
          description: 'Failed to accept invitation, please try again later',
          color: 'danger',
        });
      } finally {
        const process = { ...processing };
        delete process[invitation.id];
        setProcessing(process);
      }
    },
    [processing, refetch, router],
  );

  const handleReject = useCallback(
    async (invitation: Invitation) => {
      setProcessing({
        ...processing,
        [invitation.id]: {
          type: 'reject',
          isProcessing: true,
        },
      });
      try {
        const result = await rejectInvitation({
          invitationId: invitation.id,
          userId: invitation.inviteeId,
        });

        if (result.success) {
          addToast({
            title: 'Invitation rejected',
            description: 'You have successfully rejected the invitation',
            color: 'primary',
          });
          refetch();
        } else {
          addToast({
            title: 'Operation failed',
            description:
              result.message ||
              'Failed to reject invitation, please try again later',
            color: 'danger',
          });
        }
      } catch (error) {
        addToast({
          title: 'Operation failed',
          description: 'Failed to reject invitation, please try again later',
          color: 'danger',
        });
      } finally {
        const process = { ...processing };
        delete process[invitation.id];
        setProcessing(process);
      }
    },
    [processing, refetch],
  );

  const getCurrentTabContent = useCallback(() => {
    switch (selectedTab) {
      case TabType.ALL:
        return (
          <InvitationList
            invitations={allInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case TabType.PENDING:
        return (
          <InvitationList
            invitations={pendingInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case TabType.ACCEPTED:
        return (
          <InvitationList
            invitations={acceptedInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case TabType.REJECTED:
        return (
          <InvitationList
            invitations={rejectedInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      case TabType.CANCELLED:
        return (
          <InvitationList
            invitations={cancelledInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
      default:
        return (
          <InvitationList
            invitations={allInvitations || []}
            processing={processing}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        );
    }
  }, [
    acceptedInvitations,
    allInvitations,
    cancelledInvitations,
    handleAccept,
    handleReject,
    pendingInvitations,
    processing,
    rejectedInvitations,
    selectedTab,
  ]);

  return (
    <div className="container mx-auto p-[24px]">
      <h1 className="text-2xl font-semibold mb-6 text-white">Notification</h1>

      {isInvitationsLoading ? (
        <Loading />
      ) : userInvitations?.length === 0 ? (
        <div className="text-white text-center py-8">
          <p>No Notification</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs
            aria-label="invitation status"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as TabType)}
            className="bg-[rgba(44,44,44,0.5)] rounded-xl p-1"
            color="primary"
          >
            <Tab
              key={TabType.ALL}
              title={
                <div className="flex items-center gap-1">
                  <span>All</span>
                  <span className="bg-gray-800 text-white text-xs rounded-full px-2 py-0.5">
                    {allInvitations.length}
                  </span>
                </div>
              }
            />
            {pendingInvitations.length > 0 && (
              <Tab
                key={TabType.PENDING}
                title={
                  <div className="flex items-center gap-1">
                    <span>Pending</span>
                    <span className="bg-yellow-500/30 text-yellow-400 text-xs rounded-full px-2 py-0.5">
                      {pendingInvitations.length}
                    </span>
                  </div>
                }
              />
            )}
            {acceptedInvitations.length > 0 && (
              <Tab
                key={TabType.ACCEPTED}
                title={
                  <div className="flex items-center gap-1">
                    <span>Accepted</span>
                    <span className="bg-green-500/30 text-green-400 text-xs rounded-full px-2 py-0.5">
                      {acceptedInvitations.length}
                    </span>
                  </div>
                }
              />
            )}
            {rejectedInvitations.length > 0 && (
              <Tab
                key={TabType.REJECTED}
                title={
                  <div className="flex items-center gap-1">
                    <span>Rejected</span>
                    <span className="bg-red-500/30 text-red-400 text-xs rounded-full px-2 py-0.5">
                      {rejectedInvitations.length}
                    </span>
                  </div>
                }
              />
            )}
            {cancelledInvitations.length > 0 && (
              <Tab
                key={TabType.CANCELLED}
                title={
                  <div className="flex items-center gap-1">
                    <span>Cancelled</span>
                    <span className="bg-gray-500/30 text-gray-400 text-xs rounded-full px-2 py-0.5">
                      {cancelledInvitations.length}
                    </span>
                  </div>
                }
              />
            )}
          </Tabs>

          <div className="mt-6">{getCurrentTabContent()}</div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
