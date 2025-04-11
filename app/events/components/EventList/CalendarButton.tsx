import COMMON_STYLES from '@/style/common';
import { Button as HButton } from '@heroui/button';
import { ButtonProps, cn } from '@heroui/react';

interface IButtonProps extends ButtonProps {
  border?: boolean;
}

export default function CalendarButton({
  children,
  className,
  ...props
}: IButtonProps) {
  return (
    <HButton
      className={cn(
        'p-[10px] text-[16px] leading-[1.2] text-white rounded-[10px] gap-[10px]',
        props.border && COMMON_STYLES.border,
        className,
      )}
      {...props}
    >
      {children}
    </HButton>
  );
}
