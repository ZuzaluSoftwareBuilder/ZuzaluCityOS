import { ArrowCircleRightIcon } from '@/components/icons';
import { Button } from 'components/base';

interface CommonHeaderProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  buttonText: string;
  buttonOnPress: () => void;
}

export default function CommonHeader({
  title,
  icon,
  description,
  buttonText,
  buttonOnPress,
}: CommonHeaderProps) {
  return (
    <div className="flex items-center justify-between py-[10px] px-[20px] sticky top-0 backdrop-blur-[10px] bg-[rgba(34, 34, 34, 0.90)] z-[1000]">
      <div className="flex gap-[10px] items-center">
        {icon}
        <span className="text-[25px] font-[700] leading-[1.2]">{title}</span>
        <span className="text-[14px] opacity-60">{description}</span>
      </div>
      <Button
        variant="light"
        endContent={<ArrowCircleRightIcon size={5} />}
        onPress={buttonOnPress}
        className="h-[34px]"
      >
        {buttonText}
      </Button>
    </div>
  );
}
