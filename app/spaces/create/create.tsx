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
import AccessRule from './components/AccessRule';
import { useRouter } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';
import { createUrl } from '@/services/url';
import { SCREEN_BREAKPOINTS, useMediaQuery } from '@/hooks/useMediaQuery';
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
import { Mobile, NotMobile } from '@/hooks/useMediaQuery';
import { Space } from '@/types';
import Dialog from '@/app/spaces/components/Modal/Dialog';

dayjs.extend(utc);


const DEFAULT_AVATAR = 'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER = 'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';


const Create = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [isGated, setIsGated] = useState(false);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
    [TabContentEnum.Access]: TabStatus.Inactive,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isMobile } = useMediaQuery();
  const { ceramic, profile } =
    useCeramicContext();
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(ProfilValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      avatar: DEFAULT_AVATAR,
      banner: DEFAULT_BANNER,
      // avatar: '',
      // banner: ''
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
    setTabStatuses(prev => {
      return {
        ...prev,
        [TabContentEnum.Categories]: TabStatus.Finished,
        [TabContentEnum.Links]: prev[TabContentEnum.Links] === TabStatus.Inactive ? TabStatus.Active : prev[TabContentEnum.Links]
      }
    })
    setSelectedTab(TabContentEnum.Links);
  }
  //
  const handleLinksSubmit = () => {
    setTabStatuses(prev => {
      return {
        ...prev,
        [TabContentEnum.Links]: TabStatus.Finished,
        [TabContentEnum.Access]: prev[TabContentEnum.Access] === TabStatus.Inactive ? TabStatus.Active : prev[TabContentEnum.Access]
      }
    })
    setSelectedTab(TabContentEnum.Access);
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
      name,
      description: descriptionEditorStore.getValueString(),
      tagline,
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
      gated: isGated ? '1' : '0',
    };
  };

  // 优化创建空间函数
  const createSpace = async (content: ZucitySpaceInput) => {
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
        throw new Error('Error creating space agent');
      }
    } catch (error) {
      console.error('Error creating space:', error);
      throw new Error('Error creating space');
    }
  };
  const handleAccessRuleSubmit = async () => {
    try {
      setIsSubmit(true);
      // 验证所有表单
      const validations = await Promise.all([
        validateFormStep(ProfilValidationSchema, profileForm, TabContentEnum.Profile),
        validateFormStep(CategoriesValidationSchema, categoriesForm, TabContentEnum.Categories),
        validateFormStep(LinksValidationSchema, linksForm, TabContentEnum.Links),
      ]);

      if (!validations.every(Boolean)) {
         return;
      }

      const content = transformFormData();
      await createSpace(content);
      setShowModal(true);
    } catch (error) {
      console.error('Error creating space:', error);
      // TODO: 添加用户友好的错误提示
    } finally {
      setIsSubmit(false);
    }
  }

  const handleBack = (targetTab: TabContentEnum) => {
    setSelectedTab(targetTab);
    if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleCategoriesBack = () => handleBack(TabContentEnum.Profile);
  const handleLinksBack = () => handleBack(TabContentEnum.Categories);
  const handleAccessRuleBack = () => handleBack(TabContentEnum.Links);

  const renderTabContent = () => {
    return (<>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Profile })}><ProfileContent descriptionEditorStore={descriptionEditorStore} onBack={()=> router.push('/spaces')} form={profileForm} onSubmit={handleProfileSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Categories })}><CategoriesContent onBack={handleCategoriesBack} form={categoriesForm} onSubmit={handleCategoriesSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Links })}><LinksContent onBack={handleLinksBack} form={linksForm} onSubmit={handleLinksSubmit} /></div>
      <div className={cn({ "hidden": selectedTab !== TabContentEnum.Access })}><AccessRule isSubmit={isSubmit} onBack={handleAccessRuleBack} onSubmit={handleAccessRuleSubmit} isGated={isGated} onGatedChange={setIsGated} /></div>
    </>)
  };

  
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Header />
      <div className={
        cn("flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full", 
          "mobile:flex-col mobile:p-[10px] mobile:gap-[0px] mobile:mb-[40px] mobile:items-center")
      }>
        {/* 左侧 Tabs 列表 */}
        <Mobile>
          <div className="w-full justify-center">
            <CreateSpaceTabs
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
              tabStatuses={tabStatuses}
            />
          </div>
        </Mobile>
        <NotMobile>
          <div className="w-[130px] flex justify-end">
            <CreateSpaceTabs
              selectedTab={selectedTab}
              onTabChange={handleTabChange}
              tabStatuses={tabStatuses}
            />
          </div>
        </NotMobile>

        {/* 中间内容区域 */}
        <div className="w-full max-w-[700px] p-[20px] mobile:p-[0px]">
          {renderTabContent()}
        </div>

        {/* 右侧预览卡片 */}
        <NotMobile>
          <div className="w-[320px] pt-4">
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
                installedApps: { edges: [] },
                createdAt: '',
                updatedAt: '',
              }}
              size="lg"
              showFooter={false}
            />
          </div>
        </NotMobile>
      </div>
      <Dialog
        title="Space Created"
        message="Create process probably complete after few minute. Please check it in Space List page."
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          router.push('/spaces');
        }}
      />
    </div>
  );
};

export default Create;
