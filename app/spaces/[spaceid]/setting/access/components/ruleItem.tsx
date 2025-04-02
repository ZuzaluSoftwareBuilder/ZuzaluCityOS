import { Button } from '@/components/base';
import { PencilSimple } from '@phosphor-icons/react';

interface AccessRuleProps {
  title: string;
  tags: string[];
  isActive: boolean;
  onEdit: () => void;
}

const RuleItem: React.FC<AccessRuleProps> = ({
  title,
  tags,
  isActive,
  onEdit,
}) => {
  return (
    <div className="w-full rounded-lg bg-white/5 bg-gradient-to-r from-[#363636]/0 to-[#37B387]/10">
      <div className="flex w-full items-center justify-between gap-2.5 p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-row items-center gap-2.5">
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/10 p-2.5">
              <span className="text-base font-semibold text-white">
                {title}
              </span>
            </div>
            <span className="text-base font-normal text-white/60">with</span>
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/10 p-1 px-2.5">
              <span className="text-sm font-bold text-white/60">POAP</span>
            </div>
          </div>
          <Button
            isIconOnly
            className="flex size-10 items-center justify-center rounded-full bg-white/5"
            onPress={onEdit}
          >
            <PencilSimple size={24} weight="fill" />
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-row items-center gap-2.5 p-2.5">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center rounded-[60px] bg-white/10 px-3 py-1"
          >
            <span className="text-xs text-white">{tag}</span>
          </div>
        ))}
        <span className="text-sm font-medium text-white/50 shadow-md">OR</span>
        {tags.map((tag, index) => (
          <div
            key={`tag-${index}`}
            className="flex items-center rounded-[60px] bg-white/10 px-3 py-1"
          >
            <span className="text-xs text-white">{tag}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full items-center border-t border-white/10 p-2.5">
        <div className="flex flex-row items-center gap-2.5">
          <div
            className={`size-4 rounded-full ${isActive ? 'bg-[#7DFFD1]/40' : 'bg-[#2C2C2C]'}`}
          >
            <div
              className={`size-3 rounded-full shadow-md ${isActive ? 'bg-white' : 'bg-white/80'} mx-auto my-0.5`}
            ></div>
          </div>
          <span className="text-base font-normal text-white/60">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RuleItem;
