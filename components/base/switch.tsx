import { extendVariants, Switch as HSwitch } from '@heroui/react';

const Switch = extendVariants(HSwitch, {
  variants: {
    switch: {
      default: {
        base: 'group inline-flex items-center touch-none',
        wrapper:
          'p-[2px] h-[24px] w-[44px] flex items-center rounded-full transition-colors',
        thumb:
          'bg-[#9B9B9B] group-data-[selected=true]:bg-[#7DFFD1] h-[20px] w-[20px] rounded-full shadow-small',
      },
    },
    color: {
      custom: {
        wrapper:
          'bg-[#363636] group-data-[selected=true]:bg-[rgba(125,255,209,0.2)]',
      },
    },
    size: {
      sm: {
        wrapper: 'p-[2px] h-[20px] w-[36px]',
        thumb: 'h-[16px] w-[16px]',
      },
      md: {
        wrapper: 'p-[2px] h-[24px] w-[44px]',
        thumb: 'h-[20px] w-[20px]',
      },
      lg: {
        wrapper: 'p-[2px] h-[28px] w-[52px]',
        thumb: 'h-[24px] w-[24px]',
      },
    },
  },
  defaultVariants: {
    switch: 'default',
    color: 'custom',
    size: 'md',
  },
});

export { Switch };
