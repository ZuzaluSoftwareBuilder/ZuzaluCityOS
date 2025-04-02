'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  acceptInvitation,
  rejectInvitation,
  markInvitationAsRead,
} from '@/services/invitation';
import { Button, Tabs, Tab, addToast, Badge, Image, cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { InvitationStatus } from '@/types/invitation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_INVITATION_QUERY } from '@/services/graphql/invitation';
import useDid from '@/hooks/useDid';
import Loading from '@/app/loading';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

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
  isRead: 'true' | 'false';
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

const InvitationItem: React.FC<{
  invitation: Invitation;
  isSelected: boolean;
  onClick: () => void;
}> = ({ invitation, isSelected, onClick }) => {
  const title = useMemo(() => {
    if (invitation.resource === 'space') {
      return `Invitation to ${invitation.space?.name ? `【${invitation.space?.name}】 Space` : 'space'}`;
    } else if (invitation.resource === 'event') {
      return `Invitation to ${invitation.event?.name || ''} Event `;
    }
    return 'Invitation';
  }, [invitation]);

  const preview = useMemo(() => {
    if (invitation.message) {
      return invitation.message.length > 30
        ? `${invitation.message.substring(0, 30)}...`
        : invitation.message;
    }
    return 'You received an invitation';
  }, [invitation.message]);

  const avatarSrc = useMemo(() => {
    if (invitation.resource === 'space' && invitation.space?.avatar) {
      return invitation.space.avatar;
    } else if (invitation.resource === 'event' && invitation.event?.avatar) {
      return invitation.event.avatar;
    } else if (invitation.inviterProfile?.avatar) {
      return invitation.inviterProfile.avatar;
    }
    return '/user/avatar_icon.png';
  }, [invitation]);

  const formattedTime = useMemo(() => {
    return formatDistanceToNow(new Date(invitation.createdAt), {
      addSuffix: true,
    });
  }, [invitation.createdAt]);

  return (
    <div
      className={`relative cursor-pointer border-b border-white/10 p-4 transition-colors hover:bg-white/5 ${
        isSelected ? 'bg-white/10' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Badge
          isInvisible={String(invitation.isRead) === 'true'}
          content={1}
          color="danger"
        >
          <Image
            src={avatarSrc}
            alt={title}
            width={40}
            height={40}
            className="object-cover"
          />
        </Badge>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Button
                className={`h-[30px] min-w-0 px-[8px] py-[2px] text-[12px] ${
                  invitation.status === InvitationStatus.PENDING
                    ? 'text-yellow-400'
                    : invitation.status === InvitationStatus.ACCEPTED
                      ? 'text-green-400'
                      : invitation.status === InvitationStatus.REJECTED
                        ? 'text-red-400'
                        : 'text-gray-400'
                }`}
              >
                {invitation.status.charAt(0).toUpperCase() +
                  invitation.status.slice(1)}
              </Button>
              <h3 className="truncate pr-2 font-medium text-white">{title}</h3>
            </div>
            <span className="text-xs text-white/50">{formattedTime}</span>
          </div>
          <p className="mt-1 truncate text-sm text-white/70">{preview}</p>
        </div>
      </div>
      {!invitation.isRead && (
        <div className="absolute right-4 top-4 size-2.5 rounded-full bg-red-500"></div>
      )}
    </div>
  );
};

const InvitationDetail: React.FC<{
  invitation: Invitation;
  onAccept: (invitation: Invitation) => void;
  onReject: (invitation: Invitation) => void;
  onBack: () => void;
  processing: Record<
    string,
    { type: 'accept' | 'reject'; isProcessing: boolean }
  >;
}> = ({ invitation, onAccept, onReject, onBack, processing }) => {
  const title = useMemo(() => {
    if (invitation.resource === 'space') {
      return `Invitation to ${invitation.space?.name ? `【${invitation.space?.name}】 Space` : 'space'}`;
    } else if (invitation.resource === 'event') {
      return `Invitation to ${invitation.event?.name || ''} Event `;
    }
    return 'Invitation';
  }, [invitation]);

  const avatarSrc = useMemo(() => {
    if (invitation.resource === 'space' && invitation.space?.avatar) {
      return invitation.space.avatar;
    } else if (invitation.resource === 'event' && invitation.event?.avatar) {
      return invitation.event.avatar;
    } else if (invitation.inviterProfile?.avatar) {
      return invitation.inviterProfile.avatar;
    }
    return '/user/avatar_icon.png';
  }, [invitation]);

  const formattedTime = useMemo(() => {
    return new Date(invitation.createdAt).toLocaleString();
  }, [invitation.createdAt]);

  const isProcessing = processing[invitation.id];
  const canRespond = invitation.status === InvitationStatus.PENDING;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 p-4">
        <Button
          isIconOnly
          variant="light"
          className="md:hidden"
          onPress={onBack}
        >
          <ArrowLeftIcon className="size-5 text-white" />
        </Button>
        <h2 className="text-xl font-semibold text-white">Details</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative size-[40px] shrink-0 overflow-hidden rounded-full">
            <Image
              src={avatarSrc}
              alt={title}
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            {invitation.inviterProfile?.username && (
              <p className="text-white/70">
                From: {invitation.inviterProfile.username}
              </p>
            )}
            <p className="text-sm text-white/50">{formattedTime}</p>
          </div>
        </div>

        {invitation.message && (
          <div className="mb-6 rounded-xl bg-white/5 p-4">
            <p className="whitespace-pre-wrap text-white/90">
              {invitation.message}
            </p>
          </div>
        )}

        <div className="mb-6 rounded-xl bg-white/5 p-4">
          <h4 className="mb-2 font-medium text-white">Invitation Details</h4>
          <div className="space-y-2 text-sm">
            <p className="text-white/70">
              <span className="text-white/50">Type:</span>{' '}
              {invitation.resource.charAt(0).toUpperCase() +
                invitation.resource.slice(1)}
            </p>
            <p className="text-white/70">
              <span className="text-white/50">Status:</span>{' '}
              <span
                className={`${
                  invitation.status === InvitationStatus.PENDING
                    ? 'text-yellow-400'
                    : invitation.status === InvitationStatus.ACCEPTED
                      ? 'text-green-400'
                      : invitation.status === InvitationStatus.REJECTED
                        ? 'text-red-400'
                        : 'text-gray-400'
                }`}
              >
                {invitation.status.charAt(0).toUpperCase() +
                  invitation.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {canRespond && (
          <div className="flex gap-3">
            <Button
              variant="flat"
              onPress={() => onReject(invitation)}
              isLoading={
                isProcessing?.type === 'reject' && isProcessing?.isProcessing
              }
              className={cn(
                'flex-1 h-[38px] bg-[rgba(255,255,255,0.05)] border-none rounded-[10px] text-white text-[14px] font-bold leading-[1.6]',
              )}
            >
              Reject
            </Button>
            <Button
              onPress={() => onAccept(invitation)}
              isLoading={
                isProcessing?.type === 'accept' && isProcessing?.isProcessing
              }
              className={cn(
                'flex-1 h-[38px] rgba(103,219,255,0.10) text-[#67DBFF] border border-[rgba(103,219,255,0.2)] rounded-[10px] text-[14px] font-bold leading-[1.6]',
              )}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const { did: userDid } = useDid();
  const { profile } = useCeramicContext();
  const userId = profile?.author?.id || '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.ALL);
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
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
    isFetched: isInvitationsFetched,
  } = useGraphQL(
    ['GET_USER_INVITATION_QUERY', userDid],
    GET_USER_INVITATION_QUERY,
    { inviteeId: userDid },
    {
      enabled: !!userDid,
      select: (data) =>
        data?.data?.zucityInvitationIndex?.edges
          ?.map((item) => item?.node)
          .filter((e) => !!e)
          .sort(
            (a, b) =>
              new Date(b?.createdAt || '').getTime() -
              new Date(a?.createdAt || '').getTime(),
          ) || [],
    },
  );

  useEffect(() => {
    console.log('userInvitations', userInvitations);
  }, [userInvitations]);

  const handleMarkAsRead = useCallback(
    async (invitation: Invitation) => {
      if (String(invitation.isRead) === 'false') {
        try {
          console.log('markInvitationAsRead invitation.id', invitation.id);
          const result = await markInvitationAsRead(invitation.id);
          if (result.success) {
            await queryClient.invalidateQueries({
              queryKey: ['GET_UNREAD_INVITATIONS_COUNT', userDid],
            });
            refetch();
          } else {
            console.error('Failed to mark invitation as read:', result.message);
          }
        } catch (error) {
          console.error('Failed to mark invitation as read:', error);
        }
      }
    },
    [refetch, queryClient, userDid],
  );

  const handleSelectInvitation = useCallback(
    (invitation: Invitation) => {
      setSelectedInvitation(invitation);
      handleMarkAsRead(invitation);
    },
    [handleMarkAsRead],
  );

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
          await queryClient.invalidateQueries({
            queryKey: ['GET_USER_INVITATION_QUERY', userDid],
          });
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
    [processing, queryClient, router, userDid],
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
          await queryClient.invalidateQueries({
            queryKey: ['GET_USER_INVITATION_QUERY', userDid],
          });
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
    [processing, queryClient, userDid],
  );

  const currentTabInvitations = useMemo(() => {
    switch (selectedTab) {
      case TabType.ALL:
        return allInvitations;
      case TabType.PENDING:
        return pendingInvitations;
      case TabType.ACCEPTED:
        return acceptedInvitations;
      case TabType.REJECTED:
        return rejectedInvitations;
      case TabType.CANCELLED:
        return cancelledInvitations;
      default:
        return allInvitations;
    }
  }, [
    selectedTab,
    allInvitations,
    pendingInvitations,
    acceptedInvitations,
    rejectedInvitations,
    cancelledInvitations,
  ]);

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] p-[24px]">
      <h1 className="mb-6 text-2xl font-semibold text-white">Notifications</h1>

      {isInvitationsLoading ? (
        <Loading />
      ) : isInvitationsFetched && userInvitations?.length === 0 ? (
        <div className="py-8 text-center text-white">
          <p>No Notifications</p>
        </div>
      ) : (
        <div className="flex h-[calc(100%-70px)] flex-col">
          <Tabs
            aria-label="invitation status"
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              setSelectedTab(key as TabType);
              setSelectedInvitation(null);
            }}
            className="rounded-xl backdrop-blur-md"
            color="primary"
            classNames={{
              base: 'w-full',
              tabList: 'gap-1 px-1 py-1 rounded-xl border border-white/10',
              cursor: 'bg-white/10 rounded-lg transition-all',
              tab: 'px-3 py-1.5 rounded-lg text-white/60 data-[selected=true]:text-white font-medium text-sm',
              panel: 'pt-3 h-full',
            }}
          >
            <Tab
              key={TabType.ALL}
              title={
                <div className="flex items-center gap-1.5">
                  <span>All</span>
                  <span className="flex min-w-[20px] justify-center rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                    {allInvitations.length}
                  </span>
                </div>
              }
            />
            {pendingInvitations.length > 0 && (
              <Tab
                key={TabType.PENDING}
                title={
                  <div className="flex items-center gap-1.5">
                    <span>Pending</span>
                    <span className="flex min-w-[20px] justify-center rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
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
                  <div className="flex items-center gap-1.5">
                    <span>Accepted</span>
                    <span className="flex min-w-[20px] justify-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
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
                  <div className="flex items-center gap-1.5">
                    <span>Rejected</span>
                    <span className="flex min-w-[20px] justify-center rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
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
                  <div className="flex items-center gap-1.5">
                    <span>Cancelled</span>
                    <span className="flex min-w-[20px] justify-center rounded-full bg-gray-500/20 px-2 py-0.5 text-xs text-gray-400">
                      {cancelledInvitations.length}
                    </span>
                  </div>
                }
              />
            )}
          </Tabs>

          <div className="mt-4 flex flex-1 overflow-hidden rounded-xl bg-black/20 backdrop-blur-md">
            <div
              className={`max-h-full overflow-y-auto border-r border-white/10 ${selectedInvitation ? 'md:w-2/5 w-1/3' : 'w-full'}`}
            >
              {currentTabInvitations.map((invitation) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  isSelected={selectedInvitation?.id === invitation.id}
                  onClick={() => handleSelectInvitation(invitation)}
                />
              ))}
            </div>

            {selectedInvitation && (
              <div className="md:w-3/5 max-h-full w-2/3 overflow-hidden">
                <InvitationDetail
                  invitation={selectedInvitation}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onBack={() => setSelectedInvitation(null)}
                  processing={processing}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
