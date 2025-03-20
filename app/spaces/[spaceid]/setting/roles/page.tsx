'use client';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ViewRole from './components/viewRole';
import RoleDetail from './components/roleDetail';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';

export default function RolesPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role');
  const spaceId = useParams()?.spaceid;
  const { isLoading, owner, roles, members } = useGetSpaceMember(
    spaceId as string,
  );

  return (
    <div className="w-full pc:p-[20px_40px_0] flex flex-col gap-10 p-[20px]">
      {roleParam ? (
        <RoleDetail
          roleData={roles?.data || []}
          isLoading={isLoading}
          members={members || []}
          owner={owner}
        />
      ) : (
        <ViewRole
          roleData={roles?.data || []}
          isLoading={isLoading}
          members={members || []}
        />
      )}
    </div>
  );
}
