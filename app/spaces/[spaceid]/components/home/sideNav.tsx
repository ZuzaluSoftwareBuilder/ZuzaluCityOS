'use client';

import Link from 'next/link';
import { Link as ILink, Space } from '@/types';
import {
  XLogo,
  GithubLogo,
  TelegramLogo,
  DiscordLogo,
  ArrowUpRight,
} from '@phosphor-icons/react';
import FarcasterIcon from '../../../../../components/icons/Farcaster';
import { NostrIcon } from '@/components/icons/Nostr';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useParams } from 'next/navigation';
import { MemberProps } from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import { useEffect, useMemo } from 'react';
import { getWalletAddressFromDid } from '@/utils/did';
import { Avatar, cn } from '@heroui/react';
import { formatAddressString } from '@/components/layout/UserProfileSection';

export interface ISideNavProps {
  spaceData?: Space;
}

const SideNav = ({ spaceData }: ISideNavProps) => {
  const spaceId = useParams()?.spaceid;
  const { owner, members, roles } = useGetSpaceMember(spaceId as string);
  const roleData = roles?.data || [];

  useEffect(() => {
    console.log('owner, members, roles', owner, members, roles);
  }, [owner, members, roles]);

  const formatedMembers = useMemo(() => {
    if (!owner) return [];
    const { username, avatar, author } = owner;
    const ownerProfile = {
      name: username,
      avatarUrl: avatar || '',
      address: getWalletAddressFromDid(author?.id),
      roleName: 'Owner',
    };
    let res = [ownerProfile];
    if (!members || !members.length) return res;

    members.forEach((member) => {
      const profile = member.userId.zucityProfile;
      if (!profile) return null;
      const roleId = member.roleId;
      const roleName =
        roleData.find((role) => role.id === roleId)?.role.name || 'Member';
      const did = profile.author?.id;
      const item = {
        name: profile.username,
        avatarUrl: profile.avatar || '',
        address: getWalletAddressFromDid(did),
        roleName: roleName,
      };
      res.push(item);
    });
    return res.filter((v) => !!v);
  }, [members, owner]);

  return (
    <div className="flex w-[330px] flex-col gap-[10px] border-l border-[rgba(255,255,255,0.1)] bg-[#222] tablet:hidden mobile:hidden">
      <div className="flex h-[42px] items-center border-b border-[rgba(255,255,255,0.10)] px-[20px] backdrop-blur-[20px]">
        <p className="text-[16px] font-bold leading-[1.4] drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
          About Community
        </p>
      </div>

      <div className="border-b border-[rgba(255,255,255,0.10)] px-[20px] py-[10px]">
        <p className="text-[13px] font-[500] leading-[1.4] text-white opacity-60">
          Details:
        </p>
        <div className="mt-[20px] flex flex-col gap-[10px]">
          <DetailItem title={'Created:'} value={'Created value'} />
          <DetailItem title={'Access:'} value={'Access vale'} />
          <DetailItem
            title={'Tags:'}
            value={'Tags value'}
            noBorderBottom={true}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[10px] border-b border-[rgba(255,255,255,0.10)] px-[20px] py-[10px]">
        <p className="text-[13px] font-[500] leading-[1.4] text-white opacity-60">
          Links:
        </p>
        <div className="flex gap-[20px] p-[10px]">
          {spaceData?.socialLinks?.map((link) => (
            <SocialLink key={link.title} link={link} />
          ))}
        </div>

        <div className="flex flex-col gap-[10px]">
          {spaceData?.customLinks?.map((link) => (
            <CustomLink key={link.title} link={link} />
          ))}
        </div>
      </div>

      <div className="p-[10px]">
        <div className="flex items-center justify-between px-[10px]">
          <span className="text-[16px] font-[600] leading-[1.6] text-white">
            Members
          </span>
          <span className="text-[14px] font-[600] leading-[1.6] text-white opacity-60">
            {formatedMembers.length}
          </span>
        </div>

        <div className="mt-[20px] flex flex-col gap-[4px]">
          {formatedMembers?.map((member) => (
            <div key={member.address} className="px-[8px] py-[4px]">
              <MemberItem
                name={member.name}
                avatarUrl={member.avatarUrl}
                address={member.address}
                roleName={member.roleName}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  title,
  value,
  noBorderBottom,
}: {
  title: string;
  value: string;
  noBorderBottom?: boolean;
}) => {
  return (
    <div
      className={`flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-[10px] text-[14px] leading-[1.6] text-white ${noBorderBottom ? 'border-none' : ''}`}
    >
      <span>{title}</span>
      <span>{value}</span>
    </div>
  );
};

const SocialLink = ({ link }: { link: ILink }) => {
  const iconMap: Record<string, React.ReactNode> = {
    telegram: <TelegramLogo size={20} weight="fill" format="Stroke" />,
    github: <GithubLogo size={20} weight="fill" format="Stroke" />,
    twitter: <XLogo size={20} weight="fill" format="Stroke" />,
    discord: <DiscordLogo size={20} weight="fill" format="Stroke" />,
    nostr: <NostrIcon />,
    farcaster: <FarcasterIcon />,
  };
  const icon = iconMap[link.title.toLowerCase()] || null;
  return icon ? (
    <Link href={link.links} className={'cursor-pointer opacity-80'}>
      {icon}
    </Link>
  ) : null;
};

const CustomLink = ({ link }: { link: ILink }) => {
  return (
    <Link
      href={link.links}
      className={
        'flex cursor-pointer items-start rounded-[10px] p-[10px] opacity-80 hover:bg-[rgba(255,255,255,0.05)]'
      }
    >
      <div className="flex-1">
        <p className="text-[14px] leading-[1.6] text-white">{link.title}</p>
        <p className="mt-[5px] text-[12px] leading-[1.6] text-white opacity-50">
          {link.links}
        </p>
      </div>
      <ArrowUpRight weight="light" size={20} format="Stroke" />
    </Link>
  );
};

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
          className="size-8"
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

export default SideNav;
