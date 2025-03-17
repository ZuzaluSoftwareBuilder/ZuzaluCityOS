"use client"
import React, { useState } from 'react';
import ProfileContent from './components/ProfileContent';
import LinksContent from './components/LinksContent';
import CategoriesContent from './components/CategoriesContent';
import CreateSpaceTabs, { TabStatus, TabContentEnum } from './components/CreateSpaceTabs';
import HSpaceCard from '@/components/cards/HSpaceCard';

const Create = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Links);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
  });

  const handleTabChange = (key: TabContentEnum) => {
    // 如果当前标签是 Inactive 状态，不允许切换
    // if (tabStatuses[key] === TabStatus.Inactive) {
    //   return;
    // }

    setSelectedTab(key);
    
    // 更新标签状态，代码不能删除
    // setTabStatuses(prev => {
    //   const newStatuses = { ...prev };
    //   // 将之前的 Active 标签设置为 Finished
    //   if (prev[selectedTab] === TabStatus.Active) {
    //     newStatuses[selectedTab] = TabStatus.Finished;
    //   }
    //   // 将新选中的标签设置为 Active
    //   newStatuses[key] = TabStatus.Active;
    //   // 激活下一个标签
    //   const tabs = Object.values(TabContentEnum);
    //   const currentIndex = tabs.indexOf(key);
    //   if (currentIndex < tabs.length - 1) {
    //     newStatuses[tabs[currentIndex + 1]] = TabStatus.Active;
    //   }
    //   return newStatuses;
    // });
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case TabContentEnum.Profile:
        return <ProfileContent />;
      case TabContentEnum.Categories:
        return <CategoriesContent />;
      case TabContentEnum.Links:
        return <LinksContent />;
      default:
        return <ProfileContent />;
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full">
        {/* 左侧 Tabs 列表 */}
        <div className="w-[130px] flex justify-end">
          <CreateSpaceTabs
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            tabStatuses={tabStatuses}
          />
        </div>

        {/* 中间内容区域 */}
        <div className="w-full max-w-[700px]">
          {renderTabContent()}
        </div>
        {/* 右侧预览卡片 */}
        <div className="w-[320px]">
          <HSpaceCard
            data={{
              id: 'preview',
              name: "Space Name Space NameSpace NameSpace NameSpace Name Space Name",
              tagline: "Community tagline. Kept short, another line for good measure.Community tagline. Kept short, another line for good measure.Community tagline. Kept short, another line for good measure.",
              category: "标签1,标签2,标签3",
              members: Array(123).fill({ id: 'dummy' }),
              description: '',
            }}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Create;