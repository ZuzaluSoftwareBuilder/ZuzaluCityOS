import { Link as ILink } from '@/types';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';

const CustomLink = ({ link }: { link: ILink }) => {
  return (
    <Link
      href={link.links}
      className={
        'flex cursor-pointer items-start rounded-[10px] p-[10px] opacity-80 hover:bg-[rgba(255,255,255,0.05)]'
      }
    >
      <div className="flex-1">
        <p className="text-[14px] leading-[1.6] text-white">{link.title}</p>
        <p className="mt-[5px] text-[12px] leading-[1.6] text-white opacity-50">
          {link.links}
        </p>
      </div>
      <ArrowUpRight weight="light" size={20} format="Stroke" />
    </Link>
  );
};

export default CustomLink;
