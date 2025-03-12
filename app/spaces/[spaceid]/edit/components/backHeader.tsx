import { CaretLeft } from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';

export interface IBackHeaderProps {
  spaceId: string;
}

const BackHeader = ({ spaceId }: IBackHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(`/spaces/${spaceId}`);
  };

  return (
    <div className="flex items-center gap-[10px] w-full ">
      {/* 返回按钮 */}
      <Button
        className="h-[34px] bg-[#363636] hover:bg-[#424242] rounded-lg px-3.5 flex items-center gap-[5px]"
        onPress={handleBack}
      >
        <CaretLeft size={18} weight="light" format={'Stroke'} className="text-white" />
        <span className="text-white text-[13px] font-medium">Back</span>
      </Button>

      <span className="text-white text-[14px]">Space Settings</span>
    </div>
  );
};

export default BackHeader;
