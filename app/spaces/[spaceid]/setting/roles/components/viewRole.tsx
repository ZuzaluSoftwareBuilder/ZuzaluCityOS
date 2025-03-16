import { useParams } from 'next/navigation';
import { getRoles } from '@/services/role';
import { useQuery } from '@tanstack/react-query';
import { RoleItem, RoleItemSkeleton } from './roleItem';

export default function ViewRole() {
  const spaceId = useParams().spaceid;

  const { data, isLoading } = useQuery({
    queryKey: ['getRolesAndMembers'],
    queryFn: () => getRoles('space', spaceId as string),
  });

  return (
    <div className="w-full pc:w-[560px] pc:box-content p-[20px] mx-auto flex flex-col gap-[40px] mobile:p-0">
      <h2 className="text-white text-lg font-semibold leading-[1.2]">
        Fixed Roles
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex items-center w-full gap-[5px]">
          <span className="flex-1 text-white opacity-60 text-sm font-semibold">
            Roles
          </span>
          <span className="flex-1 text-white opacity-60 text-sm font-semibold mobile:w-[100px] mobile:flex-none">
            Members
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <RoleItemSkeleton key={index} />
              ))
            : data?.data.map((item) => <RoleItem key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
