import { RolePermission, UserRole } from '@/models/role';
import { RoleItem, RoleItemSkeleton } from './roleItem';

export default function ViewRole({
  roleData,
  isLoading,
  members,
}: {
  roleData: RolePermission[];
  isLoading: boolean;
  members: UserRole[];
}) {
  return (
    <div className="mx-auto flex w-full flex-col gap-[40px] p-[20px] pc:box-content pc:w-[560px] mobile:p-0">
      <h2 className="text-lg font-semibold leading-[1.2] text-white">
        Fixed Roles
      </h2>

      <div className="flex flex-col gap-5">
        <div className="flex w-full items-center gap-[5px]">
          <span className="flex-1 text-sm font-semibold text-white opacity-60">
            Roles
          </span>
          <span className="flex-1 text-sm font-semibold text-white opacity-60 mobile:w-[100px] mobile:flex-none">
            Members
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <RoleItemSkeleton key={index} />
              ))
            : roleData.map((item) => (
                <RoleItem key={item.id} item={item} members={members} />
              ))}
        </div>
      </div>
    </div>
  );
}
