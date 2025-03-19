"use client"
import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ProfileContent from './components/ProfileContent';
import LinksContent from './components/LinksContent';
import CategoriesContent from './components/CategoriesContent';
import CreateSpaceTabs, { TabStatus, TabContentEnum } from './components/CreateSpaceTabs';
import HSpaceCard from '@/components/cards/HSpaceCard';
import Header from './components/Header';
import { avatar, cn } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileFormData, ProfilValidationSchema } from './components/ProfileContent';
import { CategoriesFormData, CategoriesValidationSchema } from './components/CategoriesContent';
import { LinksFormData, LinksValidationSchema } from './components/LinksContent';
import { useRouter } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';

dayjs.extend(utc);

const Create = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();
  console.log('profile', profile);
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(ProfilValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      // avatar: 'https://pub-d00cee3ff1154a18bdf38c29db9a51c5.r2.dev/uploads/45d350a6-7616-48af-8289-8fd6a79bae29.jpg',
      // banner: 'https://pub-d00cee3ff1154a18bdf38c29db9a51c5.r2.dev/uploads/c117c81e-3070-41b3-859a-3b369ca43e5e.jpg'
      avatar: '',
      banner: ''
    }
  });

  const categoriesForm = useForm<CategoriesFormData>({
    resolver: yupResolver(CategoriesValidationSchema),
    mode: 'all',
    defaultValues: {
      selectedCategory: 1,
      categories: [],
    }
  });

  const linksForm = useForm<LinksFormData>({
    resolver: yupResolver(LinksValidationSchema),
    mode: 'all',
    defaultValues: {
      socialLinks: [
        {
          platform: '',
          url: ''
        },
      ],
      customLinks: [
        {
          title: '',
          links: ''
        },
      ],
    }
  });
  const spaceName = profileForm.watch('name');
  const spaceTagline = profileForm.watch('tagline');
  const spaceTags = categoriesForm.watch('categories');
  const spaceType = categoriesForm.watch('selectedCategory');
  const spaceAvatar = profileForm.watch('avatar');
  const spaceBanner = profileForm.watch('banner');
  const handleTabChange = (key: TabContentEnum) => {
    // 如果当前标签是 Inactive 状态，不允许切换
    if (tabStatuses[key] === TabStatus.Inactive) {
      return;
    }
    setSelectedTab(key);
  };
  // 处理 Profile 标签提交
  const handleProfileSubmit = (data: ProfileFormData) => {
    console.log('handleProfileSubmit', data);
    setTabStatuses(prev => {
      return {
        ...prev,
        [TabContentEnum.Profile]: TabStatus.Finished,
        // 激活下一个标签，如果是已经完成就保留状态
        [TabContentEnum.Categories]: prev[TabContentEnum.Categories] === TabStatus.Inactive ? TabStatus.Active : prev[TabContentEnum.Categories]
      }
    })
    setSelectedTab(TabContentEnum.Categories);
  }

  // 处理 Categories 标签提交
  const handleCategoriesSubmit = (data: CategoriesFormData) => {
    console.log('handleCategoriesSubmit', data);
    setTabStatuses(prev => {
      return {
        ...prev,
        [TabContentEnum.Categories]: TabStatus.Finished,
        [TabContentEnum.Links]: prev[TabContentEnum.Links] === TabStatus.Inactive ? TabStatus.Active : prev[TabContentEnum.Links]
      }
    })
    setSelectedTab(TabContentEnum.Links);
  }
  // 校验表单
  async function validateForm(schema: any, form: any, tab: TabContentEnum) {
    const isValid = await schema.isValid(form.getValues());
    if (!isValid) {
      setTabStatuses(prev => ({
        ...prev,
        [tab]: TabStatus.Active,
      }));
      setSelectedTab(tab);
    }
    return isValid;
  }
  const getAllFormValues = () => {
    const { name, tagline, description, avatar, banner } = profileForm.getValues();
    const { categories, selectedCategory } = categoriesForm.getValues();
    const { socialLinks, customLinks } = linksForm.getValues();
    const adminId = ceramic?.did?.parent || '';
    const profileId = profile?.id || '';
    const socialLinksMap = socialLinks.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.platform] = curr.url;
      return acc;
    }, {});
    const input = {
      content: {
        customLinks,
        ...socialLinksMap,
        name,
        description,
        tagline,
        superAdmin: adminId,
        profileId: profileId,
        avatar:
          avatar ||
          'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe',
        banner:
          banner ||
          'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay',
        category: categories.join(', '),
        customAttributes: [
          {
            tbd: JSON.stringify({
              key: 'createdTime',
              value: dayjs().utc().toISOString(),
            }),
          },
        ],
      },
    }
    return input;
  }
  // 最终提交数据库
  const handleLinksSubmit = async () => {
    try {
      // 进行二次校验
      setIsSubmit(true);
      const profileValid = await validateForm(ProfilValidationSchema, profileForm, TabContentEnum.Profile);
      if (!profileValid) return console.error('profileValid error');

      const categoriesValid = await validateForm(CategoriesValidationSchema, categoriesForm, TabContentEnum.Categories);
      if (!categoriesValid) return console.error('categoriesValid error');

      const linksValid = await validateForm(LinksValidationSchema, linksForm, TabContentEnum.Links);
      if (!linksValid) return console.error('linksValid error');
      const input = getAllFormValues();
      console.log('input', input);
      if (!isAuthenticated) return console.error('isAuthenticated error');
      const result = await composeClient.executeQuery(
        `
    mutation createZucitySpaceMutation($input: CreateZucitySpaceInput!) {
      createZucitySpace(
        input: $input
      ) {
        document {
          id
          name
          description
          profileId
          avatar
          banner
          category
        }
      }
    }
    `,
        {
          input
        }
      );
      if (result.errors?.length) {
        console.error('Detailed error info:', result.errors);
        throw new Error(
          `Error creating space: ${JSON.stringify(result.errors)}`,
        );
      }
      const urlName = covertNameToUrlName(input.content.name);
      // @ts-ignore
      await createUrl(
        urlName,
        // @ts-ignore
        result.data?.createZucitySpace?.document?.id,
        'spaces',
      );

    }
    catch (err: any) {
      console.log(err);
      if (err.message) {
        console.error(err.message);
      }
    } finally {
      setIsSubmit(false);
    }

  }
  const handleProfileBack = () => {
    router.push('/spaces');
  }
  const handleCategoriesBack = () => {
    setSelectedTab(TabContentEnum.Profile);
  }
  const handleLinksBack = () => {
    setSelectedTab(TabContentEnum.Categories);
  }

  const renderTabContent = () => {
    return (<>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Profile })}><ProfileContent onBack={handleProfileBack} form={profileForm} onSubmit={handleProfileSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Categories })}><CategoriesContent onBack={handleCategoriesBack} form={categoriesForm} onSubmit={handleCategoriesSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Links })}><LinksContent isLoading={isSubmit} onBack={handleLinksBack} form={linksForm} onSubmit={handleLinksSubmit} /></div>
    </>)
  };


  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className={
        cn(
          "flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full",
          "mobile:flex-col mobile:p-[10px] mobile:gap-[10px]  mobile:mb-[40px]"
        )
      }>
        {/* 左侧 Tabs 列表 */}
        <div className={
          cn(
            "w-[130px] flex justify-end mobile:w-full mobile:justify-center",
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
            showFooter={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
