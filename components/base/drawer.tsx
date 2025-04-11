import { Button } from '@/components/base';
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  type DrawerHeaderProps,
  type DrawerProps,
  Drawer as HeroDrawer,
  DrawerHeader as HeroDrawerHeader,
  cn,
} from '@heroui/react';
import { X } from '@phosphor-icons/react';
import { FC, forwardRef } from 'react';

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>((props, ref) => {
  const { classNames, ...rest } = props;

  const baseStyles = {
    backdrop: ['z-[1100]', ...(classNames?.backdrop || [])],
    wrapper: ['z-[1100]', ...(classNames?.wrapper || [])],
    base: cn(
      'z-[1100] bg-[rgba(34,34,34,0.8)] backdrop-blur-[20px] border-[rgba(255,255,255,0.06)]',
      'rounded-none min-w-[600px] border-l',
      'mobile:min-w-0 mobile:w-full mobile:border-t mobile:rounded-t-[16px]',
      classNames?.base,
    ),
    ...(classNames && {
      header: classNames.header,
      body: classNames.body,
      footer: classNames.footer,
      closeButton: classNames.closeButton,
    }),
  };

  return (
    <HeroDrawer
      hideCloseButton={true}
      ref={ref}
      classNames={baseStyles}
      {...rest}
    />
  );
});

Drawer.displayName = 'Drawer';

const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const mergedClassName = cn(
      'flex items-center justify-between h-[56px] border-b border-[rgba(255,255,255,0.1)] px-[20px] py-[0]',
      className,
    );
    return <HeroDrawerHeader className={mergedClassName} {...rest} ref={ref} />;
  },
);

DrawerHeader.displayName = 'DrawerHeader';

export const CommonDrawerHeader: FC<{
  title: string;
  onClose: () => void;
  isDisabled?: boolean;
}> = ({ title, onClose, isDisabled }) => {
  return (
    <DrawerHeader className="px-[20px]">
      <h3 className="text-[18px] font-bold leading-[1.4] text-white mobile:text-[16px]">
        {title}
      </h3>
      <Button
        isIconOnly={true}
        className="flex h-[36px] w-[44px] items-center justify-center rounded-lg bg-transparent hover:bg-[rgba(255,255,255,0.1)]"
        onPress={onClose}
        isDisabled={isDisabled}
      >
        <X size={24} weight="light" className="text-white opacity-50" />
      </Button>
    </DrawerHeader>
  );
};

export { DrawerBody, DrawerContent, DrawerFooter, DrawerHeader };
