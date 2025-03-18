import React from 'react';
import { cn } from '@heroui/react';
import { CheckIcon } from '@/components/icons';

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
    [TabStatus.Inactive]: "text-white opacity-50",
    [TabStatus.Active]: "text-white",
    [TabStatus.Finished]: "text-[#7DFFD1]",
    [TabStatus.Error]: "text-red-500",
  }[status];

  // const isClickable = status !== TabStatus.Inactive;
  const isClickable = true;
  return (
    <div 
      className={cn(
        "flex justify-between items-center w-full px-2.5 py-2 rounded-lg",
        isClickable && "cursor-pointer hover:bg-[#222]",
        status === TabStatus.Active && "bg-[#222]"
      )}
      onClick={isClickable ? onClick : undefined}
      role="tab"
      aria-selected={status === TabStatus.Active}
      tabIndex={status === TabStatus.Active ? 0 : -1}
    >
      <span className={cn(
        "text-[13px] font-medium leading-[18px]",
        textColorClass
      )}>
        {label}
      </span>
      {status === TabStatus.Finished && (
        <div className="flex items-center justify-center">
          <CheckIcon color="#7DFFD1" size={5} />
        </div>
      )}
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
  tabStatuses = {} // 提供默认空对象
}) => {
  // 定义所有可用的标签
  const tabs = [
    { key: TabContentEnum.Profile, label: 'Profile' },
    { key: TabContentEnum.Categories, label: 'Categories' },
    { key: TabContentEnum.Links, label: 'Links' },
  ];

  // 获取标签状态，如果未定义则返回 Inactive
  const getTabStatus = (key: string): TabStatus => {
    return tabStatuses[key] ?? TabStatus.Inactive;
  };

  return (
    <div 
      className="py-[20px] px-[10px]"
      role="tablist"
      aria-label="Create Space Tabs"
    >
      <div className={cn(
        "flex flex-col gap-[20px] w-full",
        "mobile:flex-row mobile:gap-[10px]"
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
