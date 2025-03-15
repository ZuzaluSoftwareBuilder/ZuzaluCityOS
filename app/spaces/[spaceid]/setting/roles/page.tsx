'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import ViewRole from './components/viewRole';
import RoleDetail from './components/roleDetail';

export default function RolesPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  return (
    <div className="w-full h-full p-[20px_40px_0] flex flex-col gap-10 mobile:p-[20px]">
      <div className="w-full">{roleParam ? <RoleDetail /> : <ViewRole />}</div>
    </div>
  );
}
