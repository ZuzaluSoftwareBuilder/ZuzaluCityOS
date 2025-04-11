import { NostrIcon } from '@/components/icons/Nostr';
import { ISocialType } from '@/constant';
import { Link as ILink } from '@/types';
import {
  ArrowUpRight,
  DiscordLogo,
  GithubLogo,
  TelegramLogo,
  XLogo,
} from '@phosphor-icons/react';
import Link from 'next/link';

const IconMap: Record<ISocialType, React.ReactNode> = {
  telegram: <TelegramLogo size={20} weight="fill" format="Stroke" />,
  github: <GithubLogo size={20} weight="fill" format="Stroke" />,
  twitter: <XLogo size={20} weight="fill" format="Stroke" />,
  discord: <DiscordLogo size={20} weight="fill" format="Stroke" />,
  nostr: <NostrIcon />,
  lens: <ArrowUpRight size={20} weight="fill" format="Stroke" />,
  other: <ArrowUpRight size={20} weight="fill" format="Stroke" />,
};

const SocialLink = ({ link }: { link: ILink }) => {
  const icon = IconMap[link.title.toLowerCase() as ISocialType] || null;
  return icon ? (
    <Link
      href={link.links}
      target="_blank"
      className={
        'flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] p-[10px] opacity-80 hover:bg-[rgba(255,255,255,0.05)] active:bg-[rgba(255,255,255,0.05)]'
      }
    >
      {icon}
    </Link>
  ) : null;
};

export default SocialLink;
