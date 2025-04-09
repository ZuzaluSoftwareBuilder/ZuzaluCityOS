import React from 'react';
import { extendVariants, Input as HInput, cn, InputProps } from '@heroui/react';
import commonStyle from '@/style/common';

// base UI
const BaseInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return (
      <HInput
        {...props}
        ref={ref}
        classNames={{
          inputWrapper: cn(
            commonStyle.border,
            'bg-white/[0.05]',
            'focus-within:border-white/30',
            'rounded-[8px]',
            'px-[10px]',
          ),
          input: cn('!text-white', 'placeholder:text-white/50'),
          errorMessage: cn('text-error'),
        }}
      />
    );
  },
);

BaseInput.displayName = 'BaseInput';

const Input = extendVariants(BaseInput, {
  defaultVariants: {
    size: 'md',
  },
});

export { Input };
