'use client';
import { usePathname, useParams } from 'next/navigation';
import SettingSubSidebar from './components/settingSidebar';

// 标题映射表
const TITLE_MAP: Record<string, string> = {
  'overview': 'Community Overview',
  'access': 'Access Management',
  'event': 'Event',
  'explore-apps': 'Explore Apps',
  'manage-apps': 'Manage Apps',
  'member-list': 'Member List',
  'invitations': 'Invitations',
};

const SpaceEditLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  
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
      <SettingSubSidebar 
        currentPath={pathname} 
        hasChanges={false} 
      />
      <div className="flex-1 flex flex-col">
        <div className="h-[50px] border-[#2C2C2C] border-b border-[rgba(255,255,255,0.1)] flex items-center px-5 backdrop-blur-[40px]">
          <h1 className="text-[18px] font-bold text-white box-shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]">{getCurrentTitle()}</h1>
        </div>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SpaceEditLayout;
