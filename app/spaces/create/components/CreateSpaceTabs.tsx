import React from 'react';
import { cn } from '@heroui/react';
import { CheckIcon } from '@heroicons/react/16/solid';

export enum TabContentEnum {
  Profile = 'Profile',
  Categories = 'Categories',
  Links = 'Links',
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
  // 根据状态决定样式
  const textColorClass = {
    [TabStatus.Inactive]: "text-white/50",
    [TabStatus.Active]: "text-white",
    [TabStatus.Finished]: "text-[#7DFFD1]",
    [TabStatus.Error]: "text-red-500",
  }[status];

  const isClickable = status !== TabStatus.Inactive;
  return (
    <div 
      className={cn(
        "flex justify-between gap-2.5 rounded-lg whitespace-nowrap",
        "mobile:p-0",
        isClickable && "cursor-pointer hover:bg-[#222222]/80",
        status === TabStatus.Active && "bg-[#222222]"
      )}
      onClick={isClickable ? onClick : undefined}
      role="tab"
      aria-selected={status === TabStatus.Active}
      tabIndex={status === TabStatus.Active ? 0 : -1}
    >
      <div className={cn(
        "font-medium text-[13px] leading-[18px] font-inter",
        textColorClass
      )}>
        {label}
      </div>
      <CheckIcon className={cn(
        "w-[16px] h-[16px]",
        status === TabStatus.Finished ? "text-[#7DFFD1]" : "text-white/[0.1]"
      )}/>
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
  tabStatuses = {}
}) => {
  const tabs = [
    { key: TabContentEnum.Profile, label: '1. Profile' },
    { key: TabContentEnum.Categories, label: '2. Categories' },
    { key: TabContentEnum.Links, label: '3. Links' },
  ];

  const getTabStatus = (key: string): TabStatus => {
    return tabStatuses[key] ?? TabStatus.Inactive;
  };

  return (
    <div 
      className="py-4 px-2.5 mobile:py-2.5 mobile:px-2.5"
      role="tablist"
      aria-label="Create Space Tabs"
    >
      <div className={cn(
        "flex flex-col gap-5 w-full",
        "mobile:flex-row mobile:gap-2.5"
      )}>
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
