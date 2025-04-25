'use client';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useParams, useSearchParams } from 'next/navigation';
import RoleDetail from './components/roleDetail';
import ViewRole from './components/viewRole';

export default function RolesPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams?.get('role');
  const spaceId = useParams()?.spaceid;
  const { isLoading, owner, roles, members } = useGetSpaceMember(
    spaceId as string,
  );

  return (
    <div className="flex w-full flex-col gap-10 p-[20px] pc:p-[20px_40px_0]">
      {roleParam ? (
        <RoleDetail
          roleData={roles?.data || []}
          isLoading={isLoading}
          members={members || []}
          owner={owner!}
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
