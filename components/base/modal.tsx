import { Button } from '@/components/base';
import {
  Modal as HeroModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  type ModalProps,
  cn,
} from '@heroui/react';
import { X } from '@phosphor-icons/react';
import React, { forwardRef } from 'react';

export const Modal = forwardRef<HTMLDivElement, ModalProps>((props, ref) => {
  const { classNames, motionProps, ...rest } = props;

  const baseStyles = {
    base: cn(
      'bg-[rgba(52,52,52,0.6)] border-[rgba(255,255,255,0.1)] border-[2px]',
      'backdrop-blur-[20px] transition-all duration-200',
      'shadow-none',
      'rounded-[10px]',
      'w-[420px] mobile:w-[calc(90vw)]',
      classNames?.base,
    ),
    wrapper: cn('bg-black/40 items-center', 'z-[1100]', classNames?.wrapper),
    backdrop: cn('bg-[rgba(34,34,34,0.6)]', classNames?.backdrop),
    header: cn('p-0 text-[18px] leading-[1.2] font-bold', classNames?.header),
    body: cn('px-[20px] py-0', classNames?.body),
    footer: cn('px-[20px]', classNames?.footer),
    closeButton: cn('hidden', classNames?.closeButton),
  };

  const defaultMotionProps = {
    variants: {
      enter: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.15,
          ease: 'easeOut',
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.15,
          ease: 'easeIn',
        },
      },
    },
    ...motionProps,
  };

  return (
    <HeroModal
      ref={ref}
      classNames={baseStyles}
      motionProps={defaultMotionProps}
      hideCloseButton={true}
      {...rest}
    />
  );
});

Modal.displayName = 'Modal';

export const CommonModalHeader: React.FC<{
  title: string;
  onClose: () => void;
  isDisabled?: boolean;
}> = ({ title, onClose, isDisabled }) => {
  return (
    <ModalHeader className="flex h-[60px] items-center justify-between pl-[20px] pr-[10px]">
      <h3 className="text-base font-bold text-white">{title}</h3>
      <Button
        isIconOnly
        className="min-w-0 bg-transparent px-0"
        onPress={onClose}
        disabled={isDisabled}
      >
        <X size={20} className="text-white opacity-50" />
      </Button>
    </ModalHeader>
  );
};

export { ModalBody, ModalContent, ModalFooter, ModalHeader };
