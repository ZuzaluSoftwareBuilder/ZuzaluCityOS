import { Link as ILink } from '@/types';
import { ISocialType } from '@/constant';
import {
  ArrowUpRight,
  DiscordLogo,
  GithubLogo,
  TelegramLogo,
  XLogo,
} from '@phosphor-icons/react';
import { NostrIcon } from '@/components/icons/Nostr';
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
    <Link href={link.links} className={'size-[20px] cursor-pointer opacity-80'}>
      {icon}
    </Link>
  ) : null;
};

export default SocialLink;
