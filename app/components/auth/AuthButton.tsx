import { Button, ButtonProps, cn } from '@heroui/react';
import { FC, PropsWithChildren } from 'react';

const AuthButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  ...props
}) => {
  const defaultClassName =
    'bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[8px] h-[40px] text-[14px] font-[500]';
  return (
    <Button className={cn(defaultClassName, className)} {...props}>
      {children}
    </Button>
  );
};

export default AuthButton;
