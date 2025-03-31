import React, { useEffect, useState } from 'react';
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

  // TODO fetch unread count

  if (unreadCount === 0) {
    return (
      <Link href="/profile/invitations" className={`relative ${className}`}>
        <NotificationIcon className="w-5 h-5 text-gray-600 hover:text-blue-500" />
      </Link>
    );
  }

  return (
    <Link href="/profile/invitations" className={`relative ${className}`}>
      <NotificationIcon className="w-5 h-5 text-blue-500" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </Link>
  );
};

export default NotificationBadge;
