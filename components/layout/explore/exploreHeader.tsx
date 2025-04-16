import { Button } from '@/components/base';
import { HourglassHighIcon } from '@/components/icons';
import { Image, cn } from '@heroui/react';
import { Plus } from '@phosphor-icons/react';

import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import React, { useCallback } from 'react';

export interface IAddButtonProps {
  isDisabled: boolean;
  isAuthenticated: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  btnText: string;
}

export const AddButton = ({
  isDisabled,
  isAuthenticated,
  onClick,
  icon,
  btnText,
}: IAddButtonProps) => {
  return (
    <Button
      className={cn(
        'border border-white/10 h-[40px] bg-[#222] p-[8px_14px] text-[16px] z-[2] mobile:w-full w-fit m-0',
        isAuthenticated
          ? isDisabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
          : 'cursor-pointer',
      )}
      startContent={
        isAuthenticated ? (
          isDisabled ? (
            <HourglassHighIcon />
          ) : (
            icon
          )
        ) : (
          <Image src="/user/wallet.png" alt="wallet" height={24} width={24} />
        )
      }
      onPress={onClick}
    >
      {isAuthenticated
        ? isDisabled
          ? 'Listing Coming Soon'
          : btnText
        : 'Connect'}
    </Button>
  );
};

export interface IExploreHeaderProps {
  icon: React.ReactNode;
  title: string;
  subTitle: string;
  versionLabel: string;
  onAdd?: () => void;
  bgImage?: string;
  addButtonText: string;
  addButtonIcon?: React.ReactNode;
  titlePrefixIcon?: React.ReactNode;
  bgImageWidth?: number;
  bgImageHeight?: number;
  bgImageTop?: number;
}

export default function ExploreHeader({
  onAdd,
  icon,
  title,
  subTitle,
  versionLabel,
  bgImage,
  addButtonText,
  addButtonIcon,
  titlePrefixIcon,
  bgImageWidth = 220,
  bgImageHeight = 200,
  bgImageTop,
}: IExploreHeaderProps) {
  const { isAuthenticated, showAuthPrompt } = useAbstractAuthContext();

  const defaultAddButtonIcon = (
    <Plus size={20} weight={'fill'} format={'Stroke'} />
  );

  const handleClick = useCallback(() => {
    if (!isAuthenticated) {
      showAuthPrompt();
    } else {
      onAdd?.();
    }
  }, [isAuthenticated, onAdd, showAuthPrompt]);

  return (
    <div className="relative h-[222px] w-full overflow-hidden border-b border-white/10 bg-[linear-gradient(272deg,_#222_2.52%,_#2C2C2C_107.14%)] p-[20px_0_0] hover:bg-[linear-gradient(272deg,_#222_2.52%,_#2C2C2C_107.14%)] mobile:h-auto mobile:p-[20px]">
      <p className="absolute right-[25px] top-[20px] text-[13px] leading-[1.4] text-white opacity-50 mobile:right-[10px] mobile:top-[10px]">
        {versionLabel}
      </p>
      <Image
        src={bgImage || '/dapps/header.png'}
        alt="header"
        width={bgImageWidth}
        height={bgImageHeight}
        classNames={{
          wrapper: cn(
            `w-[${bgImageWidth}px] h-[${bgImageHeight}px]`,
            'absolute left-1/2 -translate-x-1/2 z-[1]',
            bgImageTop !== undefined
              ? `top-[${bgImageTop}px]`
              : 'top-[20px] mobile:top-[10px]',
          ),
          img: 'object-contain',
        }}
      />
      <div className="z-[2] flex flex-row gap-[20px] p-[25px_0_0_25px] mobile:mt-[20px] mobile:gap-[10px] mobile:p-0">
        <div className="z-[2] shrink-0">{icon}</div>

        <div className="flex flex-col gap-[10px] mobile:gap-[5px]">
          <div className="flex flex-row items-center">
            {titlePrefixIcon}
            <h1 className="z-[2] h-[48px] text-[40px] font-[800] leading-[1.2] text-white mobile:h-[39px] mobile:text-[32px]">
              {title}
            </h1>
          </div>
          <p className="z-[2] text-[18px] font-[500] leading-[1.4] text-white opacity-80 drop-shadow-[0px_6px_14px_rgba(0,0,0,0.25)] mobile:text-[14px]">
            {subTitle}
          </p>
          {!!onAdd && (
            <div className="z-[2] block mobile:hidden">
              <AddButton
                isDisabled={false}
                isAuthenticated={isAuthenticated}
                onClick={handleClick}
                icon={addButtonIcon ?? defaultAddButtonIcon}
                btnText={addButtonText}
              />
            </div>
          )}
        </div>
      </div>
      <div className="z-[2] hidden min-h-[40px] mobile:mt-[10px] mobile:block">
        {!!onAdd && (
          <AddButton
            isDisabled={false}
            isAuthenticated={isAuthenticated}
            onClick={handleClick}
            icon={addButtonIcon ?? defaultAddButtonIcon}
            btnText={addButtonText}
          />
        )}
      </div>
    </div>
  );
}
