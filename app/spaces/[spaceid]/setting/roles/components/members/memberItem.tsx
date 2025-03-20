import { formatAddressString } from '@/components/layout/UserProfileSection';
import { Avatar, Skeleton } from '@heroui/react';

interface MemberProps {
  avatarUrl: string;
  name: string;
  address: string;
}

export const MemberItem: React.FC<MemberProps> = ({ avatarUrl, name, address }) => {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        src={avatarUrl || '/user/avatar_p.png'}
        alt={name}
        className="w-8 h-8"
      />
      <span className="text-[14px] font-semibold text-[#BFFF66]">{name}</span>
      <span className="text-[12px] text-white/60">
        {formatAddressString(address)}
      </span>
    </div>
  );
};

export const MemberSkeleton = () => {
  return (
    <div className="flex items-center gap-2.5 p-[4px_8px] h-[48px]">
      <Skeleton className="rounded-full w-8 h-8" />
      <Skeleton className="h-[22px] w-24 rounded-md" />
      <Skeleton className="h-[22px] w-20 rounded-md" />
    </div>
  );
};

export const MemberEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10 gap-2">
      <div className="w-16 h-16 bg-[rgba(255,255,255,0.05)] rounded-full flex items-center justify-center mb-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="white"
            strokeOpacity="0.4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-white/60 text-base font-medium">No members found</p>
      <p className="text-white/40 text-sm text-center max-w-xs">
        There are no members with this role yet. Add members to assign this
        role.
      </p>
    </div>
  );
};
