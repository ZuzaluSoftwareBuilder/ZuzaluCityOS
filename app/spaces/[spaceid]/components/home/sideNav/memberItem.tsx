import { MemberProps } from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import { formatAddressString } from '@/components/layout/Header/UserProfileSection';
import { Avatar, cn, Skeleton } from '@heroui/react';

export interface IMemberItemProps extends MemberProps {
  roleName: string;
}

const MemberItem: React.FC<IMemberItemProps> = ({
  avatarUrl,
  name,
  address,
  color,
  roleName,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <Avatar
          src={avatarUrl || '/user/avatar_p.png'}
          alt={name}
          className="size-[32px]"
        />
        <span
          className={cn(
            'text-[14px] font-semibold',
            color ? `text-[${color}]` : 'text-white',
          )}
        >
          {name ? name : formatAddressString(address)}
        </span>
      </div>
      <span className="text-[12px] leading-[1.6] text-white opacity-60">
        {roleName}
      </span>
    </div>
  );
};

export const MemberItemSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between gap-[10px] px-[10px] py-[4px]">
      <div className="flex flex-1 items-center gap-[10px]">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-[22px] flex-1 rounded-[4px]" />
      </div>
      <Skeleton className="h-[22px] w-[50px] rounded-[4px]" />
    </div>
  );
};

export default MemberItem;
