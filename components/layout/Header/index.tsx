'use client';
import { Button } from '@/components/base';
import { useAppContext } from '@/context/AppContext';
import { MenuIcon } from 'components/icons';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import SidebarDrawer from '../Sidebar/SidebarDrawer';
import UserProfileSection from './UserProfileSection';

const GreenBlurDataUrl =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNc/+mZKQAHnQK+h0UQYgAAAABJRU5ErkJggg==';

const Header = () => {
  const { openSidebar, setOpenSidebar } = useAppContext();
  const router = useRouter();
  const pathName = usePathname();

  const isSpacePath =
    pathName?.split('/')[1] === 'spaces' && pathName?.split('/').length > 2;

  return (
    <div className="sticky top-0 z-[1000] flex h-[50px] items-center justify-between border-b border-[rgba(255,255,255,0.1)] bg-[rgba(44,44,44,0.8)] px-[10px] py-[8px] backdrop-blur-[20px]">
      <div className="flex cursor-pointer items-center">
        <Button
          className="hidden w-[40px] min-w-[40px] bg-transparent p-[10px] tablet:block mobile:block"
          onPress={() => setOpenSidebar(true)}
        >
          <MenuIcon />
        </Button>

        {isSpacePath ? (
          <Button
            className="w-[40px] min-w-[40px] bg-transparent p-[10px] tablet:hidden mobile:hidden"
            onPress={() => setOpenSidebar(true)}
          >
            <MenuIcon />
          </Button>
        ) : null}

        <NextImage
          className="xl:hidden pc:hidden tablet:hidden"
          src={'/header/logo.png'}
          width={30}
          height={30}
          onClick={() => router.push('/')}
          alt="Logo"
          placeholder={'blur'}
          blurDataURL={GreenBlurDataUrl}
          priority
        />

        <NextImage
          className="mobile:hidden"
          src={'/header/logoWithText.png'}
          width={155}
          height={30}
          onClick={() => router.push('/')}
          alt="Logo"
          placeholder={'blur'}
          blurDataURL={GreenBlurDataUrl}
          priority
        />

        <span className="pl-[10px] text-[14px] font-[300] italic leading-[1.2] text-white opacity-80 mobile:hidden">
          beta
        </span>
      </div>

      <UserProfileSection />

      <SidebarDrawer
        selected={'Home'}
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
    </div>
  );
};

export default Header;
