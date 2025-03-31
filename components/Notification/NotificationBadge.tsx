import React, { useEffect, useState } from 'react';
import { getUnreadInvitationCount } from '@/services/invitation';
import Link from 'next/link';
import { NotificationIcon } from '@/components/icons/Notification';
import { useCeramicContext } from '@/context/CeramicContext';

interface NotificationBadgeProps {
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  className = '',
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { profile } = useCeramicContext();
  const userId = profile?.author?.id || '';

  useEffect(() => {
    // 如果用户已登录，则获取未读邀请数量
    if (userId) {
      fetchUnreadCount();

      // 设置定时器，每30秒刷新一次未读数量
      const intervalId = setInterval(fetchUnreadCount, 30000);

      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const result = await getUnreadInvitationCount(userId);
      if (result.success) {
        setUnreadCount(result.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch unread invitation count:', error);
    }
  };

  if (unreadCount === 0) {
    return (
      <Link href="/notifications" className={`relative ${className}`}>
        <NotificationIcon className="w-5 h-5 text-gray-600 hover:text-blue-500" />
      </Link>
    );
  }

  return (
    <Link href="/notifications" className={`relative ${className}`}>
      <NotificationIcon className="w-5 h-5 text-blue-500" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </Link>
  );
};

export default NotificationBadge;
