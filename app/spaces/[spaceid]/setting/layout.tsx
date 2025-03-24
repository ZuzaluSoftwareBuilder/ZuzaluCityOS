'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { CaretUpDown } from '@phosphor-icons/react';
import PcSpaceSettingSidebar from './components/settingSidebar/pcSpaceSettingSidebar';
import MobileSpaceSettingSidebar from './components/settingSidebar/mobileSpaceSettingSidebar';
import BackHeader from './components/backHeader';
import { getSettingSections } from './components/settingSidebar/settingsData';
import { Backdrop, CircularProgress } from '@mui/material';
import * as React from 'react';
import useCheckWalletConnectAndPermission from '@/hooks/useCheckWalletConnectAndPermission';

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const spaceId = params?.spaceid?.toString() || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, isOwner, isAdmin, isConnected, allChecksComplete } =
    useCheckWalletConnectAndPermission({
      spaceId,
      noPermissionCallback: () => router.push('/space'),
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
    if (!isConnected) return true;
    if (isAuthenticated && !isOwner && !isAdmin) return true;
    return false;
  }, [allChecksComplete, isAdmin, isAuthenticated, isConnected, isOwner]);

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

      <div className="flex-1 flex flex-col">
        {/* PC */}
        <div className="pc:flex tablet:hidden mobile:hidden h-[50px] border-[#2C2C2C] border-b border-[rgba(255,255,255,0.1)] flex items-center px-5 backdrop-blur-[20px] bg-[#2c2c2c]">
          <h1 className="text-[18px] font-bold text-white">
            {getCurrentTitle}
          </h1>
        </div>

        {/* Mobile */}
        <div className="pc:hidden p-5 border-b border-[rgba(255,255,255,0.1)] bg-[#2c2c2c]">
          <BackHeader spaceId={spaceId} />
          <div className="pc:hidden mt-5 h-[28px] flex items-center px-2 hover:bg-[#363636] rounded-lg">
            <div
              className="flex justify-between items-center w-full cursor-pointer"
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
