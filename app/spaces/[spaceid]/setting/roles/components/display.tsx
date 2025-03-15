import { Input } from '@heroui/react';

interface DisplayProps {
  roleName: string;
}

export default function Display({ roleName }: DisplayProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] font-medium">Role Name</label>
        <Input
          variant="bordered"
          className="bg-[rgba(255,255,255,0.05)] rounded-lg"
          value={roleName}
          isDisabled
        />
      </div>
    </div>
  );
}
