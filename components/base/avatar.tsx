import React from 'react';
import { Avatar as HAvatar, extendVariants, AvatarProps } from '@heroui/react';

// base UI
const BaseAvatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (props, ref) => {
    return (
      <HAvatar
        classNames={{
          base: 'border-shadow-[0px_0px_0px_1px_rgba(34,34,34,0.10)]',
        }}
        {...props}
        ref={ref}
      />
    );
  },
);

BaseAvatar.displayName = 'BaseAvatar';

const Avatar = extendVariants(BaseAvatar, {
  variants: {
    size: {
      md: {
        base: 'w-[60px] h-[60px]',
      },
      xlg: {
        base: 'w-[140px] h-[140px]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export { Avatar };
