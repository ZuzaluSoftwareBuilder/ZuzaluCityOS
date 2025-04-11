'use client';
import useCheckWalletConnectAndSpacePermission, {
  PermissionCheckType,
} from '@/hooks/useCheckWalletConnectAndSpacePermission';
import { Backdrop, CircularProgress } from '@mui/material';
import { CaretUpDown } from '@phosphor-icons/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useMemo, useState } from 'react';
import BackHeader from './components/backHeader';
import MobileSpaceSettingSidebar from './components/settingSidebar/mobileSpaceSettingSidebar';
import PcSpaceSettingSidebar from './components/settingSidebar/pcSpaceSettingSidebar';
import { getSettingSections } from './components/settingSidebar/settingsData';

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const spaceId = params?.spaceid?.toString() || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    allChecksComplete,
    hasPermission,
    details: { isWalletConnected, isAuthenticated },
  } = useCheckWalletConnectAndSpacePermission({
    permissionCheck: { type: PermissionCheckType.ROLE },
    callbacks: { onNoPermission: () => router.push(`/spaces/${spaceId}`) },
  });

  const getCurrentTitle = useMemo(() => {
    const settingSections = getSettingSections(spaceId);
    for (const section of settingSections) {
      for (const item of section.items) {
        if (item.path === pathname) {
          return item.label;
        }
      }
    }
    return 'Space Settings';
  }, [pathname, spaceId]);

  const shouldShowLoading = useMemo(() => {
    if (!allChecksComplete) return true;
    if (!isWalletConnected) return true;
    if (isAuthenticated && !hasPermission) return true;
    return false;
  }, [allChecksComplete, isAuthenticated, isWalletConnected, hasPermission]);

  if (shouldShowLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <div className="flex h-[calc(100vh-50px)]">
      <PcSpaceSettingSidebar
        currentPath={pathname as string}
        hasChanges={false}
      />

      <MobileSpaceSettingSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={pathname as string}
      />

      <div className="flex flex-1 flex-col">
        {/* PC */}
        <div className="flex h-[50px] items-center border-b border-[rgba(255,255,255,0.1)] bg-[#2c2c2c] px-5 backdrop-blur-[20px] pc:flex tablet:hidden mobile:hidden">
          <h1 className="text-[18px] font-bold text-white">
            {getCurrentTitle}
          </h1>
        </div>

        {/* Mobile */}
        <div className="border-b border-[rgba(255,255,255,0.1)] bg-[#2c2c2c] p-5 pc:hidden">
          <BackHeader spaceId={spaceId} />
          <div className="mt-5 flex h-[28px] items-center rounded-lg px-2 hover:bg-[#363636] pc:hidden">
            <div
              className="flex w-full cursor-pointer items-center justify-between"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <h1 className="text-[16px] font-bold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]">
                {getCurrentTitle}
              </h1>
              <CaretUpDown size={20} weight="light" className="text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default SettingLayout;
