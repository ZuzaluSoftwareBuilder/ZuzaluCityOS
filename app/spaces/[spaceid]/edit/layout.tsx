'use client';
import { useState } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { CaretUpDown } from '@phosphor-icons/react';
import PcSpaceSettingSidebar from './components/settingSidebar/pcSpaceSettingSidebar';
import MobileSpaceSettingSidebar from './components/settingSidebar/mobileSpaceSettingSidebar';
import BackHeader from './components/backHeader';

const TITLE_MAP: Record<string, string> = {
  overview: 'Community Overview',
  access: 'Access Management',
  event: 'Event',
  'explore-apps': 'Explore Apps',
  'manage-apps': 'Manage Apps',
  'member-list': 'Member List',
  invitations: 'Invitations',
};

const SpaceEditLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getCurrentTitle = () => {
    if (pathname === `/spaces/${spaceId}/edit`) {
      return 'Community Overview';
    }

    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];

    return TITLE_MAP[lastSegment] || 'Space Settings';
  };

  return (
    <div className="flex h-[calc(100vh-50px)]">
      <PcSpaceSettingSidebar currentPath={pathname} hasChanges={false} />

      <MobileSpaceSettingSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={pathname}
      />

      <div className="flex-1 flex flex-col">
        {/* PC */}
        <div className="pc:flex tablet:hidden mobile:hidden h-[50px] border-[#2C2C2C] border-b border-[rgba(255,255,255,0.1)] flex items-center px-5 backdrop-blur-[40px] ">
          <h1 className="text-[18px] font-bold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]">
            {getCurrentTitle()}
          </h1>
        </div>

        {/* Mobile */}
        <div className="pc:hidden p-5 border-b border-[rgba(255,255,255,0.1)]">
          <BackHeader spaceId={spaceId} />
          <div className="pc:hidden mt-5 h-[36px] flex items-center px-2 hover:bg-[#363636] rounded-lg">
            <div
              className="flex justify-between items-center w-full cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <h1 className="text-[16px] font-bold text-white shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]">
                {getCurrentTitle()}
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

export default SpaceEditLayout;
