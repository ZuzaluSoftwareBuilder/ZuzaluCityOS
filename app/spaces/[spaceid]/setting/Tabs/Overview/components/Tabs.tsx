import { cn } from '@heroui/react';
import React from 'react';

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
  const textColorClass = {
    [TabStatus.Inactive]: 'text-white/50',
    [TabStatus.Active]: 'text-white',
    [TabStatus.Finished]: 'text-[#7DFFD1]',
    [TabStatus.Error]: 'text-red-500',
  }[status];

  return (
    <div
      className={cn(
        'flex justify-between gap-2.5 rounded-lg whitespace-nowrap cursor-pointer',
        'mobile:p-0',
        status === TabStatus.Active && 'bg-[#222222]',
      )}
      onClick={onClick}
      role="tab"
      aria-selected={status === TabStatus.Active}
      tabIndex={status === TabStatus.Active ? 0 : -1}
    >
      <div
        className={cn('font-medium text-[13px] leading-[18px]', textColorClass)}
      >
        {label}
      </div>
    </div>
  );
};

interface EditSpaceTabsProps {
  selectedTab: TabContentEnum;
  onTabChange: (key: TabContentEnum) => void;
}

const EditSpaceTabs: React.FC<EditSpaceTabsProps> = ({
  selectedTab,
  onTabChange,
}) => {
  const tabs = [
    { key: TabContentEnum.Profile, label: 'Space Profile' },
    { key: TabContentEnum.Categories, label: 'Categories' },
    { key: TabContentEnum.Links, label: 'Links' },
  ];

  const getTabStatus = (key: string): TabStatus => {
    return selectedTab === key ? TabStatus.Active : TabStatus.Inactive;
  };

  return (
    <div
      className="p-[20px] mobile:p-2.5"
      role="tablist"
      aria-label="Create Space Tabs"
    >
      <div
        className={cn(
          'flex flex-col gap-5 w-full',
          'mobile:flex-row mobile:gap-[20px]',
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

export default EditSpaceTabs;
