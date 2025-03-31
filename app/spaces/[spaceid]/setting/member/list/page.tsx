'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Spinner } from '@heroui/react';
import { Button } from '@/components/base'
import { Plus, X } from '@phosphor-icons/react';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useParams } from 'next/navigation';
import { CreateInvitationDrawer } from '@/app/spaces/[spaceid]/setting/member/components/CreateInvitationDrawer';
import useOpenDraw from '@/hooks/useOpenDraw';
import { useAccount } from 'wagmi';
import { getWalletAddressFromDid } from '@/utils/did';

const MemberListPage = () => {
  const params = useParams<{ spaceid: string }>();
  const spaceId = params?.spaceid || '';
  const { members, owner, isLoading, refetchMembers, roles } = useGetSpaceMember(spaceId);
  const { open, handleOpen, handleClose } = useOpenDraw();
  const { address } = useAccount()

  useEffect(() => {
    console.log('members', members)
  }, [members])

  const membersList = useMemo(() => {
    const allMembers = [];

    if (owner) {
      allMembers.push({
        id: owner.id,
        name: owner.username || 'Unknown',
        avatar: owner.avatar || '/user/avatar_p.png',
        address: address,
        role: 'Owner',
        did: owner?.author?.id || '',
      });
    }

    if (members && members.length > 0) {
      members.forEach((member) => {
        if (member.userId.zucityProfile) {
          const profile = member.userId.zucityProfile;
          if (!profile) return null;
          if (profile.id === owner?.id) return;
          const did = profile.author?.id;
          const roleName = roles?.data?.find(role => role.role.id === member.roleId)?.role.name || 'Member';

          allMembers.push({
            id: profile.id,
            name: profile.username || 'Unknown',
            avatar: profile.avatar || '/user/avatar_p.png',
            address: getWalletAddressFromDid(did),
            role: roleName,
            did: profile?.author?.id || '',
          });
        }
      });
    }

    return allMembers;
  }, [members, owner, roles, address]);

  return (
    <div className="flex flex-col w-full gap-6 p-[24px]">
      <div className="flex justify-between items-center">
        <Button
          className="rounded-full"
          startContent={<Plus size={20} />}
          onPress={handleOpen}
        >
          Create Invitation
        </Button>
      </div>

      <div className="flex flex-col mt-4 bg-[rgba(34,34,34,0.6)] rounded-2xl overflow-hidden">
        <div className="flex items-center w-full px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
          <span className="flex-1 text-sm font-semibold text-white/60">User</span>
          <span className="w-[100px] text-sm font-semibold text-white/60 text-center">Role</span>
          {/*<span className="w-[100px] text-sm font-semibold text-white/60 text-center">操作</span>*/}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Spinner color="default" />
          </div>
        ) : membersList.length > 0 ? (
          <div className="flex flex-col">
            {membersList.map((member) => (
              <div
                key={member.id}
                className="flex items-center w-full px-4 py-3 border-b border-[rgba(255,255,255,0.05)] last:border-b-0"
              >
                <div className="flex items-center flex-1 gap-3">
                  <Avatar src={member.avatar} alt={member.name} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{member.name}</span>
                    <span className="text-xs text-white/60">{member.address}</span>
                  </div>
                </div>
                <div className="w-[100px] text-center">
                  <span className="text-sm text-white/80">{member.role}</span>
                </div>
                {/*<div className="w-[100px] flex justify-center">*/}
                {/*  {member.role !== 'Owner' && (*/}
                {/*    <Button*/}
                {/*      isIconOnly*/}
                {/*      variant="light"*/}
                {/*      className="bg-[rgba(255,255,255,0.05)] w-8 h-8 min-w-0 rounded-full"*/}
                {/*    >*/}
                {/*      <X size={16} className="text-white" />*/}
                {/*    </Button>*/}
                {/*  )}*/}
                {/*</div>*/}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center p-8 text-white/60">
            没有找到成员
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