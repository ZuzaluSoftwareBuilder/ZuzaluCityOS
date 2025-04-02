'use client';

import React, { useEffect, useMemo } from 'react';
import { Avatar, Spinner } from '@heroui/react';
import { Button } from '@/components/base';
import { Plus } from '@phosphor-icons/react';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useParams } from 'next/navigation';
import { CreateInvitationDrawer } from '@/app/spaces/[spaceid]/setting/member/components/CreateInvitationDrawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import { useAccount } from 'wagmi';
import { getWalletAddressFromDid } from '@/utils/did';

const MemberListPage = () => {
  const params = useParams<{ spaceid: string }>();
  const spaceId = params?.spaceid || '';
  const { members, owner, isLoading, refetchMembers, roles } =
    useGetSpaceMember(spaceId);
  const { open, handleOpen, handleClose } = useOpenDraw();
  const { address } = useAccount();

  useEffect(() => {
    console.log('members', members);
  }, [members]);

  const membersList = useMemo(() => {
    const allMembers = [];
    const processedDids = new Set();

    if (owner) {
      const ownerDid = owner?.author?.id;
      if (ownerDid) {
        processedDids.add(ownerDid);
        allMembers.push({
          id: owner.id,
          name: owner.username || 'Unknown',
          avatar: owner.avatar || '/user/avatar_p.png',
          address: address,
          role: 'Owner',
          did: ownerDid,
        });
      }
    }

    if (members && members.length > 0) {
      members.forEach((member) => {
        if (member.userId.zucityProfile) {
          const profile = member.userId.zucityProfile;
          if (!profile) return null;
          if (profile.id === owner?.id) return;

          const did = profile.author?.id;
          if (!did || processedDids.has(did)) return;

          processedDids.add(did);
          const roleName =
            roles?.data?.find((role) => role.role.id === member.roleId)?.role
              .name || 'Member';

          allMembers.push({
            id: profile.id,
            name: profile.username || 'Unknown',
            avatar: profile.avatar || '/user/avatar_p.png',
            address: getWalletAddressFromDid(did),
            role: roleName,
            did: did,
          });
        }
      });
    }

    return allMembers;
  }, [members, owner, roles, address]);

  return (
    <div className="flex w-full flex-col gap-6 p-[24px]">
      <div className="flex items-center justify-between">
        <Button
          className="rounded-full"
          startContent={<Plus size={20} />}
          onPress={handleOpen}
        >
          Create Invitation
        </Button>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl bg-[rgba(34,34,34,0.6)]">
        <div className="flex w-full items-center border-b border-[rgba(255,255,255,0.1)] px-4 py-3">
          <span className="flex-1 text-sm font-semibold text-white/60">
            User
          </span>
          <span className="w-[100px] text-center text-sm font-semibold text-white/60">
            Role
          </span>
          {/*<span className="w-[100px] text-sm font-semibold text-white/60 text-center">操作</span>*/}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Spinner color="default" />
          </div>
        ) : membersList.length > 0 ? (
          <div className="flex flex-col">
            {membersList.map((member) => (
              <div
                key={member.did}
                className="flex w-full items-center border-b border-[rgba(255,255,255,0.05)] px-4 py-3 last:border-b-0"
              >
                <div className="flex flex-1 items-center gap-3">
                  <Avatar src={member.avatar} alt={member.name} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {member.name}
                    </span>
                    <span className="text-xs text-white/60">
                      {member.address}
                    </span>
                  </div>
                </div>
                <div className="w-[100px] text-center">
                  <span className="text-sm text-white/80">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-white/60">
            No members found
          </div>
        )}
      </div>

      <CreateInvitationDrawer
        isOpen={open}
        onClose={handleClose}
        spaceId={spaceId}
        onSuccess={() => {
          handleClose();
          refetchMembers();
        }}
      />
    </div>
  );
};

export default MemberListPage;
