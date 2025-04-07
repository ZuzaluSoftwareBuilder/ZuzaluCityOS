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
import { NostrIcon } from '@/components/icons/Nostr';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useParams } from 'next/navigation';
import { MemberProps } from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';
import { useEffect, useMemo } from 'react';
import { getWalletAddressFromDid } from '@/utils/did';
import { Avatar, cn } from '@heroui/react';
import { formatAddressString } from '@/components/layout/UserProfileSection';
import { formatMemberCount } from '@/app/components/SpaceCard';
import dayjs from 'dayjs';
import { ISocialType } from '@/constant';

export interface ISideNavProps {
  spaceData?: Space;
}

const ShowRoles = ['owner', 'admin', 'member'];
const ShowRoleOrder: Record<string, number> = {
  owner: 30,
  admin: 20,
  member: 10,
};

const SideNav = ({ spaceData }: ISideNavProps) => {
  const spaceId = useParams()?.spaceid;
  const { owner, members, roles } = useGetSpaceMember(spaceId as string);

  const formattedMemberCount = useMemo(() => {
    const totalMembers =
      spaceData?.userRoles?.edges.map((item) => item.node).length ?? 0;
    return formatMemberCount(totalMembers + 1);
  }, [spaceData?.userRoles]);

  const roleData = useMemo(() => {
    if (!roles?.data) return [];
    return roles.data.filter((role) => ShowRoles.includes(role.role.level));
  }, [roles?.data]);

  useEffect(() => {
    console.log('owner', owner);
    console.log('members', members);
    console.log('roles', roles);
  }, [owner, members, roles]);

  const formatedMembers = useMemo(() => {
    let res = [];
    if (owner) {
      const { username, avatar, author } = owner;
      const ownerProfile = {
        name: username,
        avatarUrl: avatar || '',
        address: getWalletAddressFromDid(author?.id),
        roleName: 'Owner',
        order: ShowRoleOrder.owner,
      };
      res.push(ownerProfile);
    }

    if (!members || !members.length) return res;

    members.forEach((member) => {
      const profile = member.userId.zucityProfile;
      if (!profile) return;
      const memberRoleId = member.roleId;

      const matchedRole = roleData.find(
        (role) => role.role.id === memberRoleId,
      );

      if (!matchedRole) return;

      const roleName = matchedRole.role.name || 'Member';
      const roleLevel = matchedRole.role.level || 'member';

      const did = profile.author?.id;
      const item = {
        name: profile.username,
        avatarUrl: profile.avatar || '',
        address: getWalletAddressFromDid(did),
        roleName: roleName,
        order: ShowRoleOrder[roleLevel],
      };
      res.push(item);
    });
    return res.filter((v) => !!v).sort((a, b) => b.order - a.order);
  }, [members, owner, roleData]);

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
          <DetailItem
            title={'Created:'}
            value={dayjs(spaceData?.createdAt).format('YYYY-MM-DD HH:MM')}
          />
          <DetailItem
            title={'Access:'}
            value={spaceData?.gated ? 'Gated' : 'Open'}
          />
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
            {formattedMemberCount}
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
  const iconMap: Record<ISocialType, React.ReactNode> = {
    telegram: <TelegramLogo size={20} weight="fill" format="Stroke" />,
    github: <GithubLogo size={20} weight="fill" format="Stroke" />,
    twitter: <XLogo size={20} weight="fill" format="Stroke" />,
    discord: <DiscordLogo size={20} weight="fill" format="Stroke" />,
    nostr: <NostrIcon />,
    lens: <ArrowUpRight size={20} weight="fill" format="Stroke" />,
    other: <ArrowUpRight size={20} weight="fill" format="Stroke" />,
  };
  const icon = iconMap[link.title.toLowerCase() as ISocialType] || null;
  return icon ? (
    <Link href={link.links} className={'size-[20px] cursor-pointer opacity-80'}>
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
