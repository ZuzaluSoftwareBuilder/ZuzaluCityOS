import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '通知 | Zuzalu City',
  description: '查看您的邀请和通知',
};

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-[#181818]">{children}</main>
    </div>
  );
} 