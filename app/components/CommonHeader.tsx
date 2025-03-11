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
    <div className="flex items-center justify-between py-[10px] px-[20px] sticky top-0 backdrop-blur-[10px] bg-[rgba(34,34,34,0.8)] z-[1000] mobile:flex-col mobile:items-start mobile:gap-[5px] mobile:px-[10px] mobile:pb-0">
      <div className="flex gap-[10px] mobile:gap-[10px] items-center">
        <div className="flex gap-[10px] items-center">
          {icon}
          <span className="text-[25px] font-[700] leading-[1.2] mobile:text-[20px]">
            {title}
          </span>
        </div>
        <span className="text-[14px] opacity-60 leading-[24px] relative top-[1px]">
          {description}
        </span>
      </div>
      {rightContent ? (
        rightContent
      ) : (
        <Button
          variant="light"
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
