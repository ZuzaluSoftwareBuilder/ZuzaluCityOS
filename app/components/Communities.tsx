import { Button } from '@/components/base';
import { ArrowCircleRightIcon, BuildingsIcon } from '@/components/icons';

export default function Communities() {
  return (
    <div>
      <div className="flex items-center justify-between px-[20px] py-[10px]">
        <div className="flex gap-[10px] items-center">
          <BuildingsIcon />
          <span className="text-[25px] font-[700] leading-[1.2]">
            Communities
          </span>
          <span className="text-[14px] opacity-60">Newest Communities</span>
        </div>
        <Button variant="light" endContent={<ArrowCircleRightIcon />}>
          View All Spaces
        </Button>
      </div>
    </div>
  );
}
