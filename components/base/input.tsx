import commonStyle from '@/style/common';
import {
  extendVariants,
  Input as HInput,
  Textarea as HTextarea,
} from '@heroui/react';

const Input = extendVariants(HInput, {
  variants: {
    input: {
      default: {
        inputWrapper: [
          commonStyle.border,
          'bg-white/[0.05]',
          'focus-within:border-white/30',
          'rounded-[8px]',
          'px-[10px]',
        ],
        input: ['!text-white', 'placeholder:text-white/50'],
        errorMessage: ['text-error'],
      },
    },
  },
  defaultVariants: {
    input: 'default',
    size: 'md',
  },
});

const Textarea = extendVariants(HTextarea, {
  variants: {
    input: {
      default: {
        inputWrapper: [
          commonStyle.border,
          'bg-white/[0.05]',
          'focus-within:border-white/30',
          'rounded-[8px]',
        ],
        input: ['!text-white', 'placeholder:text-white/50'],
        errorMessage: ['text-error'],
      },
    },
  },
  defaultVariants: {
    input: 'default',
    size: 'md',
  },
});

export { Input, Textarea };
