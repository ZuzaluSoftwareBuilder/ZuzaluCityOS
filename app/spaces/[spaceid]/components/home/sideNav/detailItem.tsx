import { Skeleton } from '@heroui/react';

const DetailItem = ({
  title,
  value,
  noBorderBottom,
}: {
  title: string;
  value: string;
  noBorderBottom?: boolean;
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-[10px] border-b border-[rgba(255,255,255,0.1)] pb-[10px] text-[14px] leading-[1.6] text-white ${noBorderBottom ? 'border-none' : ''}`}
    >
      <span className="shrink-0">{title}</span>
      {value ? (
        <span className="text-right">{value}</span>
      ) : (
        <Skeleton className="h-[22px] w-[50px] rounded-[4px]" />
      )}
    </div>
  );
};

export default DetailItem;
