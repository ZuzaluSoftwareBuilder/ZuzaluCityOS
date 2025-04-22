import { Divider } from '@/components/base';
import { Dapp } from '@/models/dapp';
import { Image } from '@heroui/react';
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
  return (
    <div
      className="flex cursor-pointer flex-col justify-between gap-[10px] rounded-[10px] border border-transparent p-[10px] hover:border-white/10 hover:bg-white/5"
      onClick={onClick}
    >
      <div className="flex flex-col gap-[10px]">
        <Image
          src={bannerUrl}
          alt="dappsItem"
          width="100%"
          className="aspect-[620/280] rounded-[10px] border border-white/10 object-cover"
        />
        {isInstallable && (
          <div className="flex items-center gap-[10px]">
            <div className="flex size-[24px] items-center justify-center rounded-[8px] border border-[#7dffd1]/10 bg-[#7dffd1]/10">
              <Plugs size={16} color="#7DFFD1" weight="fill" />
            </div>
            <p className="flex items-center gap-[5px] rounded-[8px] bg-white/5 p-[4px_8px] text-[13px]">
              <BoxArrowDown size={16} weight="fill" />
              Installable
            </p>
          </div>
        )}
        <div className="flex flex-col gap-[5px]">
          <p className="text-[18px] font-[700] leading-[1.4] text-white">
            {appName}
          </p>
          <p className="line-clamp-3 text-[13px] leading-[1.4] text-white opacity-80">
            {tagline}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[5px]">
          {tags.slice(0, 3).map((tag) => (
            <p
              className="rounded-[4px] bg-white/10 p-[3px_6px] text-[10px] leading-[1.2] text-white"
              key={tag}
            >
              {tag}
            </p>
          ))}
          {tags.length > 3 && (
            <p className="text-[10px] leading-[1.2] text-white">
              +{tags.length - 3}
            </p>
          )}
        </div>
        <Divider />
        <div className="flex items-center gap-[5px] text-white">
          <p className="text-[10px] leading-[1.2] opacity-50">Developer:</p>
          <p className="text-[10px] leading-[1.2]">{developerName}</p>
        </div>
      </div>
    </div>
  );
}
