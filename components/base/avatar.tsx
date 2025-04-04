import { Avatar as HAvatar, extendVariants } from '@heroui/react';

const Avatar = extendVariants(HAvatar, {
  variants: {
    size: {
      md: {
        base: 'w-[60px] h-[60px]',
      },
      xlg: {
        base: 'w-[140px] h-[140px]',
      },
    },
    avatarStyle: {
      base: 'rounded-full border-shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export { Avatar };
