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
      className={`flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-[10px] text-[14px] leading-[1.6] text-white ${noBorderBottom ? 'border-none' : ''}`}
    >
      <span>{title}</span>
      {value ? (
        <span>{value}</span>
      ) : (
        <Skeleton className="h-[22px] w-[50px]" />
      )}
    </div>
  );
};

export default DetailItem;
