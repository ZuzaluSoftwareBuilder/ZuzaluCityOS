import { extendVariants, Divider as HDivider } from '@heroui/react';

const Divider = extendVariants(HDivider, {
  variants: {
    color: {
      default: 'bg-[rgba(255,255,255,0.1)]',
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

export { Divider };
