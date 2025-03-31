'use client';

import React, { useEffect, useState } from 'react';
import {
  acceptInvitation,
  rejectInvitation,
} from '@/services/invitation';
import { Button, Tabs, Tab } from '@heroui/react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Avatar } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useCeramicContext } from '@/context/CeramicContext';
import { InvitationStatus } from '@/types/invitation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_USER_INVITATION_QUERY } from '@/services/graphql/invitation';
import useDid from '@/hooks/useDid';

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

  const {
    data: userInvitations,
    isLoading: isInvitationsLoading,
    refetch,
  } = useGraphQL(
    ['GET_USER_INVITATION_QUERY', userDid],
    GET_USER_INVITATION_QUERY,
    { userDid },
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
  } = React.useMemo(() => {
    if (!userInvitations || userInvitations.length === 0)
      return {
        allInvitations: [],
        pendingInvitations: [],
        acceptedInvitations: [],
        rejectedInvitations: [],
        cancelledInvitations: [],
      };
    const all = [...userInvitations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const pending = userInvitations.filter(
      (inv) => inv.status === InvitationStatus.PENDING,
    );
    const accepted = userInvitations.filter(
      (inv) => inv.status === InvitationStatus.ACCEPTED,
    );
    const rejected = userInvitations.filter(
      (inv) => inv.status === InvitationStatus.REJECTED,
    );
    const cancelled = userInvitations.filter(
      (inv) => inv.status === InvitationStatus.CANCELLED,
    );

    return {
      allInvitations: all,
      pendingInvitations: pending,
      acceptedInvitations: accepted,
      rejectedInvitations: rejected,
      cancelledInvitations: cancelled,
    };
  }, [userInvitations]);

  const handleAccept = async (invitation: Invitation) => {
    try {
      const result = await acceptInvitation({
        invitationId: invitation.id,
        userId: userId,
      });

      if (result.success) {
        refetch();
        if (invitation.resource === 'space' && invitation.space) {
          router.push(`/spaces/${invitation.resourceId}`);
        } else if (invitation.resource === 'event' && invitation.event) {
          router.push(
            `/spaces/${invitation.space?.id}/events/${invitation.resourceId}`,
          );
        }
      } else {
        console.error('Failed to accept invitation:', result.message);
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  const handleReject = async (invitationId: string) => {
    try {
      const result = await rejectInvitation({
        invitationId: invitationId,
        userId: userId,
      });

      if (result.success) {
        refetch();
      } else {
        console.error('Failed to reject invitation:', result.message);
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
  };

  const getResourceName = (invitation: Invitation) => {
    switch (invitation.resource) {
      case 'space':
        return invitation.space?.name || '空间';
      case 'event':
        return invitation.event?.name || '活动';
      default:
        return '未知资源';
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
        locale: zhCN,
      });
    } catch (e) {
      return '未知时间';
    }
  };

  const getInvitationStatusBadge = (status: string) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs py-1 px-2 rounded">
            待处理
          </span>
        );
      case InvitationStatus.ACCEPTED:
        return (
          <span className="bg-green-500/20 text-green-400 text-xs py-1 px-2 rounded">
            已接受
          </span>
        );
      case InvitationStatus.REJECTED:
        return (
          <span className="bg-red-500/20 text-red-400 text-xs py-1 px-2 rounded">
            已拒绝
          </span>
        );
      case InvitationStatus.CANCELLED:
        return (
          <span className="bg-gray-500/20 text-gray-400 text-xs py-1 px-2 rounded">
            已取消
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

  const renderActionButtons = (invitation: Invitation) => {
    if (invitation.status === InvitationStatus.PENDING) {
      return (
        <div className="flex gap-3 mt-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
            onPress={() => handleAccept(invitation)}
          >
            接受
          </Button>
          <Button
            className="bg-transparent border border-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2"
            onPress={() => handleReject(invitation.id)}
          >
            拒绝
          </Button>
        </div>
      );
    } else if (invitation.status === InvitationStatus.ACCEPTED) {
      return (
        <div className="flex gap-3 mt-3">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2"
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
            查看
          </Button>
        </div>
      );
    }

    return null;
  };

  const renderInvitationsList = (invitationsList: Invitation[]) => {
    if (invitationsList.length === 0) {
      return (
        <div className="text-white text-center py-8">
          <p>暂无邀请</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {invitationsList.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-[rgba(44,44,44,0.8)] rounded-lg p-4 border border-[rgba(255,255,255,0.1)]"
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
                    <h3 className="text-white font-medium">
                      {invitation.inviterProfile?.username || '未知用户'}{' '}
                      邀请你加入 {getResourceName(invitation)}
                    </h3>
                    {getInvitationStatusBadge(invitation.status)}
                  </div>
                  <span className="text-gray-400 text-sm">
                    {formatTime(invitation.createdAt)}
                  </span>
                </div>

                {invitation.message && (
                  <p className="text-gray-300 my-2">{invitation.message}</p>
                )}

                {renderActionButtons(invitation)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCurrentTabContent = () => {
    switch (selectedTab) {
      case TabType.ALL:
        return renderInvitationsList(allInvitations || []);
      case TabType.PENDING:
        return renderInvitationsList(pendingInvitations || []);
      case TabType.ACCEPTED:
        return renderInvitationsList(acceptedInvitations || []);
      case TabType.REJECTED:
        return renderInvitationsList(rejectedInvitations || []);
      case TabType.CANCELLED:
        return renderInvitationsList(cancelledInvitations || []);
      default:
        return renderInvitationsList(allInvitations || []);
    }
  };

  if (isInvitationsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-white">通知</h1>
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-white">通知</h1>

      {userInvitations?.length === 0 ? (
        <div className="text-white text-center py-8">
          <p>暂无通知</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Tabs
            aria-label="邀请状态"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as TabType)}
            className="bg-[rgba(44,44,44,0.5)] rounded-xl p-1"
            color="primary"
          >
            <Tab
              key={TabType.ALL}
              title={
                <div className="flex items-center gap-1">
                  <span>全部</span>
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
                    <span>待处理</span>
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
                    <span>已接受</span>
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
                    <span>已拒绝</span>
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
                    <span>已取消</span>
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
