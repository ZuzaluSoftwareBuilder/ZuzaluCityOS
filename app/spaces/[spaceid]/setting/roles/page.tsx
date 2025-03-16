'use client';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ViewRole from './components/viewRole';
import RoleDetail from './components/roleDetail';
import { getRoles } from '@/services/role';
import { useQuery } from '@tanstack/react-query';

export default function RolesPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const spaceId = useParams().spaceid;

  const { data, isLoading } = useQuery({
    queryKey: ['getRolesAndMembers'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  return (
    <div className="w-full pc:p-[20px_40px_0] flex flex-col gap-10 p-[20px]">
      {roleParam ? (
        <RoleDetail roleData={data?.data || []} isLoading={isLoading} />
      ) : (
        <ViewRole roleData={data?.data || []} isLoading={isLoading} />
      )}
    </div>
  );
}
