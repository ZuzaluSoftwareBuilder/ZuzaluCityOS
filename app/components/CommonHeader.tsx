import { ArrowCircleRightIcon } from '@/components/icons';
import { Button } from 'components/base';

interface CommonHeaderProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  buttonText?: string;
  buttonOnPress?: () => void;
  rightContent?: React.ReactNode;
}

export default function CommonHeader({
  title,
  icon,
  description,
  buttonText,
  buttonOnPress,
  rightContent,
}: CommonHeaderProps) {
  return (
    <div className="sticky top-0 z-[1000] flex items-center justify-between bg-[rgba(34,34,34,0.8)] px-[20px] py-[10px] backdrop-blur-[10px] mobile:flex-col mobile:items-start mobile:gap-[5px] mobile:px-[10px] mobile:pb-0">
      <div className="flex items-center gap-[10px] mobile:gap-[10px]">
        <div className="flex items-center gap-[10px]">
          {icon}
          <span className="text-[25px] font-[700] leading-[1.2] mobile:text-[20px]">
            {title}
          </span>
        </div>
        <span className="relative top-px text-[14px] leading-[24px] opacity-60">
          {description}
        </span>
      </div>
      {rightContent ? (
        rightContent
      ) : (
        <Button
          endContent={<ArrowCircleRightIcon size={5} />}
          onPress={buttonOnPress}
          className="h-[34px] mobile:p-[4px] mobile:text-[14px]"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
