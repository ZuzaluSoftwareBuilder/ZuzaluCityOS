import { extendVariants } from '@heroui/react';

import { Button as HButton } from '@heroui/react';

const Button = extendVariants(HButton, {
  variants: {
    color: {
      primary:
        'bg-[#363636] hover:bg-[#404040] text-white disabled:hover:bg-[#363636]', // ui wip
      secondary: 'text-white',
      functional:
        'bg-secondary  text-white border border-solid border-[rgba(255,255,255,0.1)]',
      submit:
        'bg-submit border border-solid border-[rgba(103,219,255,0.2)] text-[#67DBFF]',
    },
    size: {
      sm: 'px-[10px] py-[5px] text-[14px] gap-[10px]',
      md: 'px-[14px] py-[8px] text-[14px] gap-[10px]',
      lg: 'px-[14px] py-[8px] text-[16px] gap-[10px]',
    },
    radius: {
      sm: 'rounded-[8px]',
      md: 'rounded-[10px]',
      lg: 'rounded-[12px]',
      full: 'rounded-full',
    },
    border: {
      true: 'border border-white/10',
    },
    // state: {
    //   active: "opacity-100",
    //   inactive: "opacity-60",
    //   disabled: "opacity-30",
    // },
  },

  defaultVariants: {
    color: 'secondary',
    size: 'md',
    radius: 'sm',
    // state: "active",
  },
});

export { Button };
