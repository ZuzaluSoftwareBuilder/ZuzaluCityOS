import commonStyle from '@/style/common';
import {
  cn,
  extendVariants,
  Input as HInput,
  Textarea as HTextarea,
  InputProps,
  TextAreaProps,
} from '@heroui/react';
import React from 'react';

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

const BaseTextarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return (
      <HTextarea
        {...props}
        ref={ref}
        classNames={{
          inputWrapper: cn(
            commonStyle.border,
            'bg-white/[0.05]',
            'focus-within:border-white/30',
            'rounded-[8px]',
          ),
          input: cn('!text-white', 'placeholder:text-white/50'),
          errorMessage: cn('text-error'),
        }}
      />
    );
  },
);

BaseTextarea.displayName = 'BaseTextarea';

const Textarea = extendVariants(BaseTextarea, {
  defaultVariants: {
    size: 'md',
  },
});

export { Input, Textarea };
