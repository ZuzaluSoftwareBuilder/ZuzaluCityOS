import { Dapp } from '@/types';
import { Image } from '@heroui/react';
import { Divider } from '@/components/base';
import { BoxArrowDown, Plugs } from '@phosphor-icons/react';
interface ItemProps {
  data: Dapp;
  onClick: () => void;
}

export default function Item({ data, onClick }: ItemProps) {
  const {
    appName,
    developerName,
    tagline,
    bannerUrl,
    categories,
    isInstallable,
  } = data;
  const tags = categories.split(',');
  console.log(isInstallable);
  return (
    <div
      className="p-[10px] rounded-[10px] border border-transparent cursor-pointer hover:border-white/10 hover:bg-white/5 gap-[10px] flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex flex-col gap-[10px]">
        <Image
          src={bannerUrl}
          alt="dappsItem"
          width="100%"
          className="rounded-[10px] border border-white/10 aspect-[620/280] object-cover"
        />
        {isInstallable === '1' && (
          <div className="flex gap-[10px] items-center">
            <div className="w-[24px] h-[24px] rounded-[8px] border border-[#7dffd1]/10 bg-[#7dffd1]/10 flex items-center justify-center">
              <Plugs size={16} color="#7DFFD1" weight="fill" />
            </div>
            <p className="text-[13px] flex items-center gap-[5px] p-[4px_8px] rounded-[8px] bg-white/5">
              <BoxArrowDown size={16} weight="fill" />
              Installable
            </p>
          </div>
        )}
        <div className="flex flex-col gap-[5px]">
          <p className="text-[#fff] text-[18px] font-[700] leading-[1.4]">
            {appName}
          </p>
          <p className="text-[13px] leading-[1.4] text-[#fff] opacity-80 line-clamp-3">
            {tagline}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="flex gap-[5px] items-center">
          {tags.slice(0, 3).map((tag) => (
            <p
              className="p-[3px_6px] rounded-[4px] bg-white/10 text-[10px] leading-[1.2] text-[#fff]"
              key={tag}
            >
              {tag}
            </p>
          ))}
          {tags.length > 3 && (
            <p className="text-[10px] leading-[1.2] text-[#fff]">
              +{tags.length - 3}
            </p>
          )}
        </div>
        <Divider />
        <div className="flex gap-[5px] items-center text-[#fff]">
          <p className="text-[10px] leading-[1.2] opacity-50">Developer:</p>
          <p className="text-[10px] leading-[1.2]">{developerName}</p>
        </div>
      </div>
    </div>
  );
}
