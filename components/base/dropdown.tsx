import {
  DropdownItem,
  type DropdownMenuProps,
  type DropdownProps,
  DropdownTrigger,
  Dropdown as HeroDropdown,
  DropdownMenu as HeroDropdownMenu,
  cn,
} from '@heroui/react';
import { forwardRef } from 'react';

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (props, ref) => {
    const { classNames, motionProps, ...rest } = props;

    const baseStyles = {
      base: cn(
        'bg-[rgba(34,34,34,0.8)] backdrop-blur-[12px]',
        'border-2 border-[rgba(255,255,255,0.1)]',
        'rounded-[10px]',
        'p-0',
        classNames?.base,
      ),
      content: cn(
        'bg-transparent',
        'shadow-none',
        'p-0',
        'rounded-none',
        classNames?.content,
      ),
      ...(classNames && {
        trigger: classNames.trigger,
        backdrop: classNames.backdrop,
        arrow: classNames.arrow,
      }),
    };

    const defaultMotionProps = {
      variants: {
        enter: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.15, ease: 'easeOut' },
        },
        exit: {
          opacity: 0,
          scale: 0.98,
          transition: { duration: 0.1, ease: 'easeIn' },
        },
      },
      ...motionProps,
    };

    return (
      <HeroDropdown
        ref={ref}
        classNames={baseStyles}
        motionProps={defaultMotionProps}
        {...rest}
      />
    );
  },
);

Dropdown.displayName = 'Dropdown';

export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  (props, ref) => {
    const { classNames, className, itemClasses, ...rest } = props;

    const baseMenuClasses = classNames || {};
    const baseItemClasses = {
      base: cn(
        'p-0',
        'data-[hover=true]:bg-transparent',
        'dark:data-[hover=true]:bg-transparent',
        itemClasses?.base,
      ),
      ...(itemClasses || {}),
    };

    return (
      <HeroDropdownMenu
        ref={ref}
        className={cn('w-[220px] bg-transparent', className)}
        classNames={{
          base: cn('p-[10px]', baseMenuClasses.base),
          list: cn('gap-[10px]', baseMenuClasses.list),
        }}
        style={{
          willChange: 'opacity, transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          ...(props.style || {}),
        }}
        itemClasses={baseItemClasses}
        {...rest}
      />
    );
  },
);

DropdownMenu.displayName = 'DropdownMenu';

export { DropdownItem, DropdownTrigger };
