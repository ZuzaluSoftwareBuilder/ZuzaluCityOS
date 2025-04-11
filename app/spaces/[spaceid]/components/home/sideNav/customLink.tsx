import { Link as ILink } from '@/types';
import { ArrowUpRight } from '@phosphor-icons/react';
import Link from 'next/link';

const CustomLink = ({ link }: { link: ILink }) => {
  return (
    <Link
      href={link.links}
      target="_blank"
      className={
        'cursor-pointer items-start rounded-[10px] p-[10px] opacity-80 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.05)]'
      }
    >
      <div className="flex items-center justify-between">
        <p className="text-[14px] leading-[1.6] text-white">{link.title}</p>
        <ArrowUpRight weight="light" size={20} format="Stroke" />
      </div>
      <p className="mt-[5px] text-[12px] leading-[1.6] text-white opacity-50">
        {link.links}
      </p>
    </Link>
  );
};

export default CustomLink;
