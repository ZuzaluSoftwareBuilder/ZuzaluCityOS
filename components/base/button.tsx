import { ButtonProps } from '@heroui/react';

import { Button as HButton, cn } from '@heroui/react';
import COMMON_STYLES from 'style/common';

interface IButtonProps extends ButtonProps {
  border?: boolean;
}

export default function Button({ children, ...props }: IButtonProps) {
  return (
    <HButton
      className={cn(
        'p-[10px] text-[16px] font-[600] leading-[1.2] bg-[#383838] text-white rounded-[10px] gap-[10px]',
        props.border && COMMON_STYLES.border,
        props.className,
      )}
      {...props}
    >
      {children}
    </HButton>
  );
}
