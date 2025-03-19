import { formatAddressString } from '@/components/layout/UserProfileSection';
import { Avatar } from '@heroui/react';

interface MemberProps {
  avatarUrl: string;
  name: string;
  address: string;
}

export default function Member({ avatarUrl, name, address }: MemberProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        src={avatarUrl || '/user/avatar_p.png'}
        alt={name}
        className="w-8 h-8"
      />
      <span className="text-sm font-semibold text-white">{name}</span>
      <span className="text-[12px] text-white/60">
        {formatAddressString(address)}
      </span>
    </div>
  );
}
