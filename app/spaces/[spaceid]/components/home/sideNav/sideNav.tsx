'use client';

import { formatMemberCount } from '@/components/biz/space/SpaceCard';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { Space } from '@/models/space';
import { getWalletAddressFromProfile } from '@/utils/profile';
import { Skeleton } from '@heroui/react';
import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import CustomLink from './customLink';
import DetailItem from './detailItem';
import MemberItem, { MemberItemSkeleton } from './memberItem';
import SocialLink from './socialLink';

export interface ISideNavProps {
  spaceData?: Space;
  inDrawer?: boolean;
}

const ShowRoles = ['owner', 'admin', 'member'];
const ShowRoleOrder: Record<string, number> = {
  owner: 30,
  admin: 20,
  member: 10,
};

const SideNav = ({ spaceData, inDrawer }: ISideNavProps) => {
  const spaceId = useParams()?.spaceid;
  const { owner, members, roles, isLoadingMembers } = useGetSpaceMember(
    spaceId as string,
  );

  const formattedMemberCount = useMemo(() => {
    const totalMembers = spaceData?.userRoles?.length ?? 0;
    return formatMemberCount(totalMembers + 1);
  }, [spaceData?.userRoles]);

  const roleData = useMemo(() => {
    if (!roles?.data) return [];
    return roles.data.filter((role) => ShowRoles.includes(role.role.level));
  }, [roles?.data]);

  const formatedMembers = useMemo(() => {
    let res = [];
    if (owner) {
      const { username, avatar } = owner;
      const ownerProfile = {
        name: username,
        avatarUrl: avatar || '',
        address: getWalletAddressFromProfile(owner),
        roleName: 'Owner',
        order: ShowRoleOrder.owner,
      };
      res.push(ownerProfile);
    }

    if (!members || !members.length) return res;

    members.forEach((member) => {
      const profile = member.userId;
      if (!profile) return;
      const memberRoleId = member.roleId;

      const matchedRole = roleData.find(
        (role) => role.role.id === memberRoleId,
      );

      if (!matchedRole) return;

      const roleName = matchedRole.role.name || 'Member';
      const roleLevel = matchedRole.role.level || 'member';

      const item = {
        name: profile.username,
        avatarUrl: profile.avatar || '',
        address: getWalletAddressFromProfile(profile),
        roleName: roleName,
        order: ShowRoleOrder[roleLevel],
      };
      res.push(item);
    });
    return res.filter((v) => !!v).sort((a, b) => b.order - a.order);
  }, [members, owner, roleData]);

  return (
    <>
      {!inDrawer && (
        <div className="flex h-[42px] shrink-0 items-center border-b border-[rgba(255,255,255,0.10)] px-[20px] backdrop-blur-[20px]">
          <p className="text-[16px] font-bold leading-[1.4] drop-shadow-[0px_5px_10px_rgba(0,0,0,0.15)]">
            About Community
          </p>
        </div>
      )}

      <div className="border-b border-[rgba(255,255,255,0.10)] px-[20px] py-[10px]">
        <p className="text-[13px] font-[500] leading-[1.4] text-white opacity-60">
          Details:
        </p>
        <div className="mt-[20px] flex flex-col gap-[10px]">
          <DetailItem
            title={'Created:'}
            value={
              spaceData?.createdAt
                ? dayjs(spaceData?.createdAt).format('YYYY-MM-DD HH:MM')
                : ''
            }
          />
          <DetailItem
            title={'Access:'}
            value={
              !spaceData
                ? ''
                : spaceData?.gated && String(spaceData?.gated) === '1'
                  ? 'Gated'
                  : 'Open'
            }
          />
          <DetailItem
            title={'Tags:'}
            value={spaceData?.tags?.map((tag) => tag.tag).join(', ') || ''}
            noBorderBottom={true}
          />
        </div>
      </div>

      <div className="flex flex-col gap-[10px] border-b border-[rgba(255,255,255,0.10)] px-[20px] py-[10px]">
        <p className="text-[13px] font-[500] leading-[1.4] text-white opacity-60">
          Links:
        </p>
        <div className="flex gap-0">
          {spaceData?.socialLinks && spaceData?.socialLinks?.length > 0 ? (
            spaceData?.socialLinks?.map((link) => (
              <SocialLink key={link.title} link={link} />
            ))
          ) : (
            <>
              <Skeleton className="size-[40px] rounded-[8px]" />
            </>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          {spaceData?.customLinks && spaceData?.customLinks?.length > 0
            ? spaceData?.customLinks?.map((link) => (
                <CustomLink key={link.title} link={link} />
              ))
            : null}
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
          {!isLoadingMembers &&
          formatedMembers &&
          formatedMembers.length > 0 ? (
            formatedMembers.map((member) => (
              <div key={member.address} className="px-[8px] py-[4px]">
                <MemberItem
                  name={member.name}
                  avatarUrl={member.avatarUrl}
                  address={member.address}
                  roleName={member.roleName}
                />
              </div>
            ))
          ) : (
            <MemberItemSkeleton />
          )}
        </div>
      </div>
    </>
  );
};

export default SideNav;
