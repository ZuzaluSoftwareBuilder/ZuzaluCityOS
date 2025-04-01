'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/base'
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  CommonDrawerHeader,
} from '@/components/base/drawer';
import {
  Input,
  Select,
  SelectItem,
  Avatar,
  Spinner,
  cn,
  addToast,
  Radio,
  RadioGroup,
} from '@heroui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchUsers, SearchUser } from '@/hooks/useSearchUsers';
import { Event, RolePermission, Space } from '@/types';
import { InvitationStatus } from '@/types/invitation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { createInvitation } from '@/services/invitation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import { getSpaceEvents } from '@/services/event';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { executeQuery } from '@/utils/ceramic';
import { CHECK_EXISTING_ROLE_QUERY } from '@/services/graphql/role';
import { MemberEmpty } from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';

// 资源类型枚举
enum ResourceType {
  SPACE = 'space',
  EVENT = 'event',
}

interface CreateInvitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
  onSuccess?: () => void;
}

export const CreateInvitationDrawer = ({
  isOpen,
  onClose,
  spaceId,
  onSuccess,
}: CreateInvitationDrawerProps) => {
  const [selectedUser, setSelectedUser] = useState<SearchUser | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceType, setResourceType] = useState<ResourceType>(
    ResourceType.SPACE,
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string>(spaceId);

  const {
    searchQuery,
    setSearchQuery,
    searchedUsers,
    isLoading: isSearchLoading,
    error: searchError,
    clearSearch,
  } = useSearchUsers();

  const { isOwner, isAdmin, isMember } = useSpacePermissions();

  const {
    isLoading: isRoleLoading,
    owner,
    roles,
    members,
  } = useGetSpaceMember(spaceId as string);

  const ownerAssignableRoles = useMemo(() => {
    return roles?.data.filter((role) => role.role.level !== 'owner');
  }, [roles]);

  const adminAssignableRoles = useMemo(() => {
    return roles?.data.filter(
      (role) => !['owner', 'admin'].includes(role.role.level),
    );
  }, [roles]);

  const assignableRoles = useMemo(() => {
    return isOwner ? ownerAssignableRoles : isAdmin ? adminAssignableRoles : [];
  }, [isOwner, ownerAssignableRoles, isAdmin, adminAssignableRoles]);

  useEffect(() => {
    console.log('roles', roles);
  }, [roles]);

  const { data: spaceData, isLoading: isEventsLoading } = useGraphQL(
    ['getSpaceAndEvents', spaceId],
    GET_SPACE_AND_EVENTS_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => {
        return data?.data?.node as Space;
      },
      enabled: !!spaceId && isOpen && resourceType === ResourceType.EVENT,
    },
  );

  const spaceEvents = useMemo(() => {
    return (spaceData?.events?.edges.map((edge) => edge.node) || []) as Event[];
  }, [spaceData]);

  // 当资源类型变更时，重置选中的资源ID和角色ID
  useEffect(() => {
    if (resourceType === ResourceType.SPACE) {
      setSelectedResourceId(spaceId);
    } else {
      setSelectedResourceId('');
      setSelectedRoleId('');
    }
  }, [resourceType, spaceId]);

  const createInvitationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser || !selectedRoleId || !selectedResourceId) {
        throw new Error('Please complete all required fields');
      }

      return createInvitation({
        inviteeId: selectedUser.did,
        id: selectedResourceId,
        resource: resourceType,
        roleId: selectedRoleId,
        message: message || '',
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });
    },
    onSuccess: () => {
      addToast({
        title: 'Invitation is sent successfully',
        description: 'User will receive your invitation email',
        color: 'success',
      });
      resetForm();
      onSuccess?.();
    },
    onError: (error: any) => {
      addToast({
        title: 'Failed to send invitation',
        description: error.response?.data?.message || 'Please try again later',
        color: 'danger',
      });
    },
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedRoleId('');
    setMessage('');
    setResourceType(ResourceType.SPACE);
    setSelectedResourceId(spaceId);
    clearSearch();
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createInvitationMutation.mutateAsync();
    } catch (error) {
      console.error('创建邀请失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    selectedUser !== null && selectedRoleId !== '' && selectedResourceId !== '';

  const renderResourceSelector = () => {
    if (resourceType === ResourceType.SPACE) {
      return (
        <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg">
          <span className="text-sm text-white">Current Space</span>
        </div>
      );
    } else if (resourceType === ResourceType.EVENT) {
      return (
        <div className="flex flex-col gap-3">
          <Select
            placeholder="Select event"
            selectedKeys={selectedResourceId ? [selectedResourceId] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              if (selectedKey) {
                setSelectedResourceId(selectedKey);
              }
            }}
            classNames={{
              trigger:
                'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white',
              listbox: 'bg-[#333] text-white',
            }}
            isDisabled={isEventsLoading || isSubmitting}
          >
            {isEventsLoading ? (
              <SelectItem key="loading">Loading...</SelectItem>
            ) : spaceEvents && spaceEvents.length > 0 ? (
              spaceEvents.map((event: any) => (
                <SelectItem key={event.id}>
                  {event.name || event.title || '未命名事件'}
                </SelectItem>
              ))
            ) : (
              <SelectItem key="empty">No Available Event</SelectItem>
            )}
          </Select>
        </div>
      );
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerContent>
        <CommonDrawerHeader
          title="Invite Members"
          onClose={onClose}
          isDisabled={isSubmitting}
        />
        <DrawerBody className="px-5 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-white text-sm font-medium">Resource Type</p>
              <RadioGroup
                value={resourceType}
                onValueChange={(value) =>
                  setResourceType(value as ResourceType)
                }
                orientation="horizontal"
                classNames={{
                  wrapper: 'gap-4',
                }}
              >
                <Radio value={ResourceType.SPACE}>Space</Radio>
                <Radio value={ResourceType.EVENT}>Event</Radio>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-white text-sm font-medium">Resource</p>
              {renderResourceSelector()}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-white text-sm font-medium">Role</p>
              <Select
                placeholder="Select the role to be assigned."
                selectedKeys={selectedRoleId ? [selectedRoleId] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  if (selectedKey) {
                    setSelectedRoleId(selectedKey);
                  }
                }}
                classNames={{
                  trigger:
                    'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-white',
                  listbox: 'bg-[#333] text-white',
                }}
                isDisabled={
                  isRoleLoading || isSubmitting || !selectedResourceId
                }
              >
                {isRoleLoading ? (
                  <SelectItem key="loading">Loading...</SelectItem>
                ) : assignableRoles && assignableRoles.length > 0 ? (
                  assignableRoles.map((rolePermission: any) => (
                    <SelectItem key={rolePermission.role.id}>
                      {rolePermission.role.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="empty">No Available Role</SelectItem>
                )}
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-white text-sm font-medium">
                Invitation Message（optional）
              </p>
              <Input
                placeholder="Input invitation message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                classNames={{
                  inputWrapper:
                    'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]',
                  input: 'text-white',
                }}
                isDisabled={isSubmitting}
              />
            </div>

            <p className="text-white text-sm font-medium">Search User</p>
            <Input
              placeholder="Search Members By Fullname Or Wallet Address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={
                <MagnifyingGlass size={16} className="text-white/60" />
              }
              classNames={{
                inputWrapper:
                  'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]',
                input: 'text-white',
              }}
            />
            <div className="flex flex-col gap-2 min-h-[120px] max-h-[250px] overflow-y-auto">
              {isSearchLoading ? (
                <div className="flex justify-center items-center p-4">
                  <Spinner size="sm" color="default" />
                </div>
              ) : searchError ? (
                <p className="text-red-500 text-sm">{searchError}</p>
              ) : searchedUsers.length > 0 ? (
                searchedUsers.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg cursor-pointer',
                      selectedUser?.id === user.id
                        ? 'bg-[rgba(255,255,255,0.1)]'
                        : 'hover:bg-[rgba(255,255,255,0.05)]',
                    )}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar src={user.avatar} alt={user.username} size="sm" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {user.username}
                      </span>
                      <span className="text-xs text-white/60">
                        {user.address}
                      </span>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <MemberEmpty />
              ) : null}
            </div>
          </div>

          {/*{selectedUser && (*/}
          {/*  <div className="flex flex-col gap-3">*/}
          {/*    <p className="text-white text-sm font-medium">Selected User</p>*/}
          {/*    <div className="flex items-center gap-3 p-3 bg-[rgba(255,255,255,0.05)] rounded-lg">*/}
          {/*      <Avatar*/}
          {/*        src={selectedUser.avatar}*/}
          {/*        alt={selectedUser.username}*/}
          {/*        size="sm"*/}
          {/*      />*/}
          {/*      <div className="flex flex-col">*/}
          {/*        <span className="text-sm font-medium text-white">*/}
          {/*          {selectedUser.username}*/}
          {/*        </span>*/}
          {/*        <span className="text-xs text-white/60">*/}
          {/*          {selectedUser.address}*/}
          {/*        </span>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}

          <div className="flex justify-end mt-4">
            <Button
              color="primary"
              className={cn(
                'h-[38px] rgba(103,219,255,0.10) text-[#67DBFF] border border-[rgba(103,219,255,0.2)] rounded-[10px] text-[14px] font-bold leading-[1.6]',
                'w-[120px] mobile:flex-1'
              )}
              onPress={handleSubmit}
              isDisabled={!isFormValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Send
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
