import {
  extendVariants,
  Select as HSelect,
  SelectItem as HSelectItem,
} from '@heroui/react';

const Select = extendVariants(HSelect, {
  variants: {
    select: {
      default: {
        trigger: 'bg-white/[0.05] border border-white/[0.1] rounded-[8px]',
        value: 'text-white/[0.5] text-[14px]',
      },
    },
  },
  defaultVariants: {
    select: 'default',
  },
});

const SelectItem = extendVariants(HSelectItem, {});

export { Select, SelectItem };
