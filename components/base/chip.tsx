import { extendVariants, Chip as HChip } from '@heroui/react';

const Chip = extendVariants(HChip, {
  variants: {
    // 尺寸变体
    size: {
      sm: {
        base: 'text-[10px] px-[8px] py-[4px] gap-[5px]',
      },
      md: {
        base: 'text-[14px]  px-[10px] py-[5px] gap-[5px]',
      },
      lg: {
        base: 'text-[16px] px-[10px] py-[10px] gap-[5px]',
      },
    },
    radius: {
      sm: {
        base: 'rounded-[4px]',
      },
      md: {
        base: 'rounded-[8px]',
      },
    },
    // 这样覆盖的优先度是最高的
    chilp: {
      default: {
        base: 'bg-white/[0.05]',
      },
      bgBulr: {
        base: 'bg-[rgba(34, 34, 34, 0.40)] border border-white-[0.2]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    radius: 'sm',
    chilp: 'default',
  },
  // 复合变体
});

export { Chip };
