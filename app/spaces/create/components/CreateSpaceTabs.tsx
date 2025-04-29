import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@heroui/react';
import { Check } from '@phosphor-icons/react';
import React, { useRef } from 'react';

export enum TabContentEnum {
  Profile = 'Profile',
  Categories = 'Categories',
  Links = 'Links',
  Access = 'Access',
  Stoarge = 'Stoarge',
}

export enum TabStatus {
  Inactive,
  Active,
  Finished,
  Error,
}

interface TabItemProps {
  label: string;
  status: TabStatus;
  onClick: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ label, onClick, status }) => {
  const textColorClass = {
    [TabStatus.Inactive]: 'text-white/50',
    [TabStatus.Active]: 'text-white',
    [TabStatus.Finished]: 'text-[#7DFFD1]',
    [TabStatus.Error]: 'text-error',
  }[status];

  const isClickable = status !== TabStatus.Inactive;
  const { isMobile, isPc } = useMediaQuery();
  return (
    <div
      className={cn(
        'flex justify-between rounded-lg whitespace-nowrap',
        isPc ? 'gap-[5px]' : '',
        isMobile ? 'p-0 justify-start gap-[10px]' : '',
        isClickable && 'cursor-pointer hover:bg-[#222222]/80',
        status === TabStatus.Active && 'bg-[#222222]',
      )}
      onClick={isClickable ? onClick : undefined}
      role="tab"
      aria-selected={status === TabStatus.Active}
      tabIndex={status === TabStatus.Active ? 0 : -1}
    >
      <div
        className={cn('font-medium text-[13px] leading-[18px]', textColorClass)}
      >
        {label}
      </div>
      <Check
        size={16}
        className={cn(
          'w-[16px] h-[16px]',
          status === TabStatus.Finished ? 'text-[#7DFFD1]' : 'text-white/[0.1]',
        )}
      />
    </div>
  );
};

interface CreateSpaceTabsProps {
  selectedTab: TabContentEnum;
  onTabChange: (key: TabContentEnum) => void;
  tabStatuses?: Partial<Record<string, TabStatus>>;
}

/**
 * 创建空间的侧边标签导航组件
 */
const CreateSpaceTabs: React.FC<CreateSpaceTabsProps> = ({
  selectedTab,
  onTabChange,
  tabStatuses = {},
}) => {
  const { isMobile } = useMediaQuery();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: TabContentEnum.Profile, label: '1. Profile' },
    { key: TabContentEnum.Categories, label: '2. Categories' },
    { key: TabContentEnum.Links, label: '3. Links' },
    { key: TabContentEnum.Access, label: '4. Access' },
    { key: TabContentEnum.Stoarge, label: '5. Storage' },
  ];

  const getTabStatus = (key: TabContentEnum) => {
    return tabStatuses[key] ?? TabStatus.Inactive;
  };

  const scrollToStart = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToEnd = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollTo({
        left: tabsContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  };

  React.useEffect(() => {
    if (isMobile) {
      if (selectedTab === TabContentEnum.Profile) {
        scrollToStart();
      } else if (selectedTab === TabContentEnum.Access) {
        scrollToEnd();
      }
    }
  }, [selectedTab, isMobile]);

  return (
    <div
      className={cn('py-[20px] px-[10px]', isMobile ? 'p-[20]' : '')}
      role="tablist"
      aria-label="Create Space Tabs"
    >
      <div
        ref={tabsContainerRef}
        className={cn(
          'flex flex-col gap-[20px] w-full',
          isMobile ? 'flex-row overflow-x-auto scrollbar-none' : '',
        )}
      >
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            label={tab.label}
            status={getTabStatus(tab.key)}
            onClick={() => onTabChange(tab.key)}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateSpaceTabs;
