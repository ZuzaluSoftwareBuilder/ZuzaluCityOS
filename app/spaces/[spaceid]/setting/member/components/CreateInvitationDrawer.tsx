'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/base';
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  CommonDrawerHeader,
  Select,
  SelectItem,
} from '@/components/base';
import {
  Input,
  Avatar,
  Spinner,
  cn,
  addToast,
  Radio,
  RadioGroup,
  Checkbox,
} from '@heroui/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useSearchUsers, SearchUser } from '@/hooks/useSearchUsers';
import { Event, Space } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { createInvitation } from '@/services/invitation';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { MemberEmpty } from '@/app/spaces/[spaceid]/setting/roles/components/members/memberItem';

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

interface ExtendedSearchUser extends SearchUser {
  name?: string;
  id: string;
}

export const CreateInvitationDrawer = ({
  isOpen,
  onClose,
  spaceId,
  onSuccess,
}: CreateInvitationDrawerProps) => {
  const [selectedUser, setSelectedUser] = useState<ExtendedSearchUser | null>(
    null,
  );
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
        message: message || ' ',
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
        <div className="flex items-center gap-3 rounded-lg bg-[rgba(255,255,255,0.05)] p-3">
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

  const displayedMembers = useMemo(() => {
    return searchedUsers.map((user) => ({
      did: user.did,
      avatar: user.avatar,
      name: user.username,
      address: user.address,
      id: user.id,
    }));
  }, [searchedUsers]);

  const LoadingSkeleton = () => (
    <div className="flex items-center justify-center p-4">
      <Spinner size="sm" color="default" />
    </div>
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right">
      <DrawerContent>
        <CommonDrawerHeader
          title="Invite Members"
          onClose={onClose}
          isDisabled={isSubmitting}
        />
        <DrawerBody className="flex flex-col gap-6 px-5 py-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Resource Type</p>
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
                <Radio value={ResourceType.EVENT} isDisabled={true}>
                  Event
                </Radio>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Resource</p>
              {renderResourceSelector()}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-white">Role</p>
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
              <p className="text-sm font-medium text-white">
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

            <div className="">
              <p className="text-sm font-medium text-white">Invite User</p>
              <div className="relative my-[10px] w-full">
                <Input
                  variant="bordered"
                  classNames={{
                    base: 'bg-[rgba(34,34,34,0.05)] border-[rgba(255,255,255,0.1)]',
                    input: 'text-white',
                  }}
                  placeholder="Search Members By Fullname Or Wallet Address"
                  radius="md"
                  value={searchQuery}
                  startContent={
                    <MagnifyingGlass className="size-[20px] text-white opacity-50" />
                  }
                  onChange={(e) => setSearchQuery(e.target.value)}
                  isDisabled={isSubmitting}
                />
              </div>

              <div className="flex h-[200px] w-full flex-col gap-[4px] overflow-y-auto">
                {isSearchLoading ? (
                  Array.from({ length: 1 }).map((_, index) => (
                    <LoadingSkeleton key={`skeleton-${index}`} />
                  ))
                ) : displayedMembers.length > 0 ? (
                  displayedMembers.map((member) => (
                    <div
                      key={member.did}
                      className={`flex w-full cursor-pointer items-center rounded-[8px] px-[8px] py-[4px] hover:bg-[rgba(255,255,255,0.03)] ${
                        selectedUser?.did === member.did
                          ? 'bg-[rgba(255,255,255,0.05)]'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedUser({
                          did: member.did,
                          username: member.name,
                          avatar: member.avatar,
                          address: member.address,
                          id: member.id,
                        })
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex w-full items-center gap-3">
                        <Checkbox
                          color="default"
                          isSelected={selectedUser?.did === member.did}
                          className="pointer-events-none"
                        />
                        <Avatar
                          src={member.avatar || '/user/avatar_p.png'}
                          alt={member.name || 'User avatar'}
                          size="sm"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white">
                            {member.name}
                          </span>
                          <span className="text-xs text-white/60">
                            {member.address}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <MemberEmpty />
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              color="primary"
              className={cn(
                'h-[38px] rgba(103,219,255,0.10) text-[#67DBFF] border border-[rgba(103,219,255,0.2)] rounded-[10px] text-[14px] font-bold leading-[1.6]',
                'w-[120px] mobile:flex-1',
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
