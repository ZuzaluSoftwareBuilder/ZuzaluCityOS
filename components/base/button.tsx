import { ButtonProps, extendVariants } from '@heroui/react';

import { Button as HButton, cn } from '@heroui/react';

// interface IButtonProps extends ButtonProps {
//   border?: boolean;
// }

// export default function Button({
//   children,
//   className,
//   ...props
// }: IButtonProps) {
//   return (
//     <HButton
//       className={cn(
//         'p-[10px] text-[16px] leading-[1.2] text-white rounded-[10px] gap-[10px]',
//         props.border && COMMON_STYLES.border,
//         className,
//       )}
//       {...props}
//     >
//       {children}
//     </HButton>
//   );
// }

const Button = extendVariants(HButton, {
  variants: {
    // 根据设计稿定义颜色变体
    color: {
      primary: 'bg-[#363636] hover:bg-[#404040] text-white',
      secondary:
        'bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-white',
      dark: 'bg-[#222222] hover:bg-[#363636] text-white',
      functional:
        'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-solid border-[rgba(255,255,255,0.1)] text-white',
    },
    // 根据设计稿定义尺寸变体
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
    // 根据设计稿定义状态变体
    // state: {
    //   active: "opacity-100",
    //   inactive: "opacity-60",
    //   disabled: "opacity-30",
    // },
  },

  defaultVariants: {
    color: 'primary',
    size: 'md',
    radius: 'md',
    // state: "active",
  },
});

export { Button };
