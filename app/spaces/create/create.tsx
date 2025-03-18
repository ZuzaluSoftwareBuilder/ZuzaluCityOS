"use client"
import React, { useState } from 'react';
import ProfileContent from './components/ProfileContent';
import LinksContent from './components/LinksContent';
import CategoriesContent from './components/CategoriesContent';
import CreateSpaceTabs, { TabStatus, TabContentEnum } from './components/CreateSpaceTabs';
import HSpaceCard from '@/components/cards/HSpaceCard';
import { cn } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileFormData, ProfilValidationSchema } from './components/ProfileContent';
import { CategoriesFormData, CategoriesValidationSchema } from './components/CategoriesContent';
import { LinksFormData, LinksValidationSchema } from './components/LinksContent';

const Create = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(ProfilValidationSchema),
    mode: 'onBlur',
    defaultValues: {
      communityName: '',
      communityTagline: '',
      communityDescription: {
        blocks: [],
        time: Date.now(),
        version: '1.0.0'
      },
      spaceAvatar: '',
      spaceBanner: ''
    }
  });

  const categoriesForm = useForm<CategoriesFormData>({
    resolver: yupResolver(CategoriesValidationSchema),
    mode: 'onBlur',
    defaultValues: {
      selectedCategory: 1,
      communityTags: [],
    }
  });

  const linksForm = useForm<LinksFormData>({
    resolver: yupResolver(LinksValidationSchema),
    mode: 'onBlur',
    defaultValues: {
      socialLinks: [{ platform: '', url: '' }],
      customLinks: [{ title: '', url: '' }],
    }
  });
  const spaceName = profileForm.watch('communityName');
  const spaceTagline = profileForm.watch('communityTagline');
  const spaceTags = categoriesForm.watch('communityTags');
  const spaceType = categoriesForm.watch('selectedCategory');
  const spaceAvatar = profileForm.watch('spaceAvatar');
  const spaceBanner = profileForm.watch('spaceBanner');
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
    return (<>
      <div className={cn({"hidden": selectedTab !== TabContentEnum.Profile})}><ProfileContent form={profileForm} /></div>
      <div className={cn({"hidden": selectedTab !== TabContentEnum.Categories})}><CategoriesContent form={categoriesForm} /></div>
      <div className={cn({"hidden": selectedTab !== TabContentEnum.Links})}><LinksContent form={linksForm} /></div>
    </>)
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className={
        cn(
          "flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full",
          "mobile:flex-col"
        )
      }>
        {/* 左侧 Tabs 列表 */}
        <div className={
          cn(
            "w-[130px] flex justify-end",
          )
        }>
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
        <div className="w-[320px] mobile:hidden">
          <HSpaceCard
            data={{
              id: 'preview',
              name: spaceName || 'Community Name',
              tagline: spaceTagline || 'Community tagline',
              category: spaceTags.join(','),
              members: Array(123).fill({ id: 'dummy' }),
              description: '',
              spaceType: spaceType.toString(),
              banner: spaceBanner,
              avatar: spaceAvatar,
            }}
            size="lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
