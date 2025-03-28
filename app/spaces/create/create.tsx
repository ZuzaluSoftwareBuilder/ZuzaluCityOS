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
import { cn, input } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileFormData, ProfilValidationSchema } from './components/ProfileContent';
import { CategoriesFormData, CategoriesValidationSchema } from './components/CategoriesContent';
import { LinksFormData, LinksValidationSchema } from './components/LinksContent';
import { useRouter } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';
import { createUrl } from '@/services/url';
import { useMediaQuery } from '@/hooks';
import { CREATE_SPACE_MUTATION } from '@/services/graphql/space';
import { executeQuery } from '@/utils/ceramic';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { ZucitySpaceInput } from '@/graphql/graphql'
import { supabase } from '@/utils/supabase/client';
import { uint8ArrayToBase64 } from '@/utils';
import { getResolver } from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { DID } from 'dids';
import { Categories } from './components/constant';

dayjs.extend(utc);


const DEFAULT_AVATAR = 'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER = 'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';


const Create = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(ProfilValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      // avatar: DEFAULT_AVATAR,
      // banner: DEFAULT_BANNER,
      avatar: '',
      banner: ''
    }
  });
  const descriptionEditorStore = useEditorStore();

  const categoriesForm = useForm<CategoriesFormData>({
    resolver: yupResolver(CategoriesValidationSchema),
    mode: 'all',
    defaultValues: {
      category: Categories[0].value,
      tags: [],
    }
  });

  const linksForm = useForm<LinksFormData>({
    resolver: yupResolver(LinksValidationSchema),
    mode: 'all',
    defaultValues: {
      socialLinks: [
        {
          title: '',
          links: ''
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
  const tags = categoriesForm.watch('tags');
  const category = categoriesForm.watch('category');
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
  // 优化表单验证函数
  const validateFormStep = async (
    schema: any,
    form: any,
    tab: TabContentEnum
  ): Promise<boolean> => {
    try {
      const isValid = await schema.isValid(form.getValues());
      if (!isValid) {
        setTabStatuses(prev => ({
          ...prev,
          [tab]: TabStatus.Active,
        }));
        setSelectedTab(tab);
      }
      return isValid;
    } catch (error) {
      console.error(`Validation error for ${tab}:`, error);
      return false;
    }
  };

  // 优化数据转换函数
  const transformFormData = (): ZucitySpaceInput => {
    const { name, tagline, avatar, banner } = profileForm.getValues();
    const { tags, category } = categoriesForm.getValues();
    const { socialLinks, customLinks } = linksForm.getValues();
    const adminId = ceramic?.did?.parent || '';
    const profileId = profile?.id || '';
    return {
      customLinks,
      socialLinks,
      name: name,
      description: descriptionEditorStore.getValueString(),
      tagline: tagline,
      owner: adminId,
      profileId: profileId,
      avatar:
        avatar ||
        DEFAULT_AVATAR,
      banner:
        banner ||
        DEFAULT_BANNER,
      tags: tags.map((i) => ({ tag: i })),
      category: category,
      createdAt: dayjs().utc().toISOString(),
      updatedAt: dayjs().utc().toISOString(),
    };
  };

  // 优化创建空间函数
  const createSpace = async (content: ZucitySpaceInput)  => {
    try {
      const result = await executeQuery(CREATE_SPACE_MUTATION, {
        input: {
          content
        }
      });
      if (result.errors?.length) {
        console.error('Detailed error info:', result.errors);
        throw new Error(
          `Error creating space: ${JSON.stringify(result.errors)}`,
        );
      }
      const urlName = covertNameToUrlName(content.name);
      // @ts-ignore
      await createUrl(
        urlName,
        // @ts-ignore
        result.data?.createZucitySpace?.document?.id,
        'spaces',
      );
      let seed = crypto.getRandomValues(new Uint8Array(32));
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: getResolver() });
      await did.authenticate();
      //TODO: Encrypt this private key
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaceAgent')
        .insert({
          agentKey: uint8ArrayToBase64(seed),
          agentDID: did.id,
          // @ts-ignore
          spaceId: result.data?.createZucitySpace?.document?.id,
        });

      if (spaceError) {
        console.error('Error creating space agent:', spaceError);
      }
      return spaceData
    } catch (error) {
      console.error('Error creating space:', error);
      throw new Error('Error creating space');
    }
  };

  // 优化提交处理函数
  const handleLinksSubmit = async () => {
    try {
      setIsSubmit(true);

      // 验证所有表单
      const validations = await Promise.all([
        validateFormStep(ProfilValidationSchema, profileForm, TabContentEnum.Profile),
        validateFormStep(CategoriesValidationSchema, categoriesForm, TabContentEnum.Categories),
        validateFormStep(LinksValidationSchema, linksForm, TabContentEnum.Links),
      ]);

      if (!validations.every(Boolean)) {
        throw new Error('Form validation failed');
      }

      const content = transformFormData();
      const space = await createSpace(content);

      // if (space?.id) {
      //   const urlName = covertNameToUrlName(input.content.name);
      //   await createUrl(urlName, space.id, 'spaces');
      //   router.push('/spaces');
      // }
    } catch (error) {
      console.error('Error creating space:', error);
      // TODO: 添加用户友好的错误提示
    } finally {
      setIsSubmit(false);
    }
  };

  const handleProfileBack = () => {
    router.push('/spaces');
  }
  const handleCategoriesBack = () => {
    setSelectedTab(TabContentEnum.Profile);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  const handleLinksBack = () => {
    setSelectedTab(TabContentEnum.Categories);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  const renderTabContent = () => {
    return (<>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Profile })}><ProfileContent descriptionEditorStore={descriptionEditorStore} onBack={handleProfileBack} form={profileForm} onSubmit={handleProfileSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Categories })}><CategoriesContent onBack={handleCategoriesBack} form={categoriesForm} onSubmit={handleCategoriesSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Links })}><LinksContent isLoading={isSubmit} onBack={handleLinksBack} form={linksForm} onSubmit={handleLinksSubmit} /></div>
    </>)
  };


  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header/>
      <div className={
        cn(
          "flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full",
          "mobile:flex-col mobile:p-[10px] mobile:gap-[0px] mobile:mb-[40px]"
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
        <div className="w-full max-w-[700px] p-4 mobile:p-2">
          {renderTabContent()}
        </div>
        {/* 右侧预览卡片 */}
        <div className="w-[320px] pt-4 mobile:hidden">
          <HSpaceCard
            data={{
              id: 'preview',
              name: spaceName || 'Community Name',
              tagline: spaceTagline || 'Community tagline',
              category: category,
              description: '',
              tags: tags.map((i) => ({ tag: i })),
              banner: spaceBanner,
              avatar: spaceAvatar,
              owner: {
                id: '',
                zucityProfile: {
                  id: '',
                  avatar: '',
                  username: '',
                },
              },
              customAttributes: [],
              createdAt: '',
              updatedAt: '',
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
