import { Input } from '@heroui/react';

interface DisplayProps {
  roleName: string;
}

export default function Display({ roleName }: DisplayProps) {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-medium text-white">Role Name</label>
        <Input
          variant="bordered"
          className="rounded-lg bg-[rgba(255,255,255,0.05)]"
          value={roleName}
          isDisabled
        />
      </div>
    </div>
  );
}
