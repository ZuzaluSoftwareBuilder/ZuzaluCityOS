'use client';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ProfileContent from './components/ProfileContent';
import LinksContent from './components/LinksContent';
import CategoriesContent from './components/CategoriesContent';
import StepTabs, { TabStatus, TabContentEnum } from './components/Tabs';
import { cn } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ProfileFormData,
  ProfilValidationSchema,
} from './components/ProfileContent';
import {
  CategoriesFormData,
  CategoriesValidationSchema,
} from './components/CategoriesContent';
import {
  LinksFormData,
  LinksValidationSchema,
} from './components/LinksContent';
import { useRouter } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';
import { createUrl } from '@/services/url';
import { useMediaQuery } from '@/hooks';
import { Button } from '@/components/base';
import {
  XMarkIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/20/solid';
import { ArrowLineDown, X as XIcon } from '@phosphor-icons/react';

dayjs.extend(utc);

// 添加类型定义
interface CreateSpaceDocument {
  id: string;
  name: string;
  description: string;
  profileId: string;
  avatar: string;
  banner: string;
  category: string;
}

interface CreateSpaceResponse {
  createZucitySpace: {
    document: CreateSpaceDocument;
  };
}

interface CreateSpaceInput {
  content: {
    customLinks: Array<{ title: string; links: string }>;
    name: string;
    description: string;
    tagline: string;
    superAdmin: string;
    profileId: string;
    avatar: string;
    banner: string;
    category: string;
    customAttributes: Array<{ tbd: string }>;
  };
}

const DEFAULT_AVATAR =
  'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER =
  'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';

const EditSapce = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [tabStatuses, setTabStatuses] = useState<Record<string, TabStatus>>({
    [TabContentEnum.Profile]: TabStatus.Active,
    [TabContentEnum.Categories]: TabStatus.Inactive,
    [TabContentEnum.Links]: TabStatus.Inactive,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const { isMobile, isPc, isTablet } = useMediaQuery();
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();
  const profileForm = useForm<ProfileFormData>({
    resolver: yupResolver(ProfilValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      avatar: '',
      banner: '',
    },
  });

  const categoriesForm = useForm<CategoriesFormData>({
    resolver: yupResolver(CategoriesValidationSchema),
    mode: 'all',
    defaultValues: {
      selectedCategory: 1,
      categories: [],
    },
  });

  const linksForm = useForm<LinksFormData>({
    resolver: yupResolver(LinksValidationSchema),
    mode: 'all',
    defaultValues: {
      socialLinks: [
        {
          platform: '',
          url: '',
        },
      ],
      customLinks: [
        {
          title: '',
          links: '',
        },
      ],
    },
  });
  const handleTabChange = (key: TabContentEnum) => {
    setSelectedTab(key);
  };
  // 处理 Profile 标签提交
  const handleProfileSubmit = (data: ProfileFormData) => {
    console.log('handleProfileSubmit', data);
    setTabStatuses((prev) => {
      return {
        ...prev,
        [TabContentEnum.Profile]: TabStatus.Finished,
        // 激活下一个标签，如果是已经完成就保留状态
        [TabContentEnum.Categories]:
          prev[TabContentEnum.Categories] === TabStatus.Inactive
            ? TabStatus.Active
            : prev[TabContentEnum.Categories],
      };
    });
    setSelectedTab(TabContentEnum.Categories);
  };

  // 处理 Categories 标签提交
  const handleCategoriesSubmit = (data: CategoriesFormData) => {
    console.log('handleCategoriesSubmit', data);
    setTabStatuses((prev) => {
      return {
        ...prev,
        [TabContentEnum.Categories]: TabStatus.Finished,
        [TabContentEnum.Links]:
          prev[TabContentEnum.Links] === TabStatus.Inactive
            ? TabStatus.Active
            : prev[TabContentEnum.Links],
      };
    });
    setSelectedTab(TabContentEnum.Links);
  };
  // 优化表单验证函数
  const validateFormStep = async (
    schema: any,
    form: any,
    tab: TabContentEnum,
  ): Promise<boolean> => {
    try {
      const isValid = await schema.isValid(form.getValues());
      if (!isValid) {
        setTabStatuses((prev) => ({
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
  const transformFormData = (): CreateSpaceInput => {
    const { name, tagline, description, avatar, banner } =
      profileForm.getValues();
    const { categories, selectedCategory } = categoriesForm.getValues();
    const { socialLinks, customLinks } = linksForm.getValues();
    const adminId = ceramic?.did?.parent || '';
    const profileId = profile?.id || '';

    const socialLinksMap = socialLinks.reduce<Record<string, string>>(
      (acc, { platform, url }) => {
        if (platform && url) {
          acc[platform] = url;
        }
        return acc;
      },
      {},
    );

    return {
      content: {
        customLinks,
        ...socialLinksMap,
        name,
        description,
        tagline,
        superAdmin: adminId,
        profileId,
        avatar: avatar || DEFAULT_AVATAR,
        banner: banner || DEFAULT_BANNER,
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
    };
  };

  // 优化创建空间函数
  const createSpace = async (
    input: CreateSpaceInput,
  ): Promise<CreateSpaceDocument | null> => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    const result = await composeClient.executeQuery<CreateSpaceResponse>(
      `
      mutation createZucitySpaceMutation($input: CreateZucitySpaceInput!) {
        createZucitySpace(input: $input) {
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
      { input },
    );

    if (result.errors?.length) {
      throw new Error(`Error creating space: ${JSON.stringify(result.errors)}`);
    }

    return result.data?.createZucitySpace?.document || null;
  };

  // 优化提交处理函数
  const handleLinksSubmit = async () => {
    try {
      setIsSubmit(true);

      // 验证所有表单
      const validations = await Promise.all([
        validateFormStep(
          ProfilValidationSchema,
          profileForm,
          TabContentEnum.Profile,
        ),
        validateFormStep(
          CategoriesValidationSchema,
          categoriesForm,
          TabContentEnum.Categories,
        ),
        validateFormStep(
          LinksValidationSchema,
          linksForm,
          TabContentEnum.Links,
        ),
      ]);

      if (!validations.every(Boolean)) {
        throw new Error('Form validation failed');
      }

      const input = transformFormData();
      const space = await createSpace(input);

      if (space?.id) {
        const urlName = covertNameToUrlName(input.content.name);
        await createUrl(urlName, space.id, 'spaces');
        router.push('/spaces');
      }
    } catch (error) {
      console.error('Error creating space:', error);
      // TODO: 添加用户友好的错误提示
    } finally {
      setIsSubmit(false);
    }
  };

  const handleProfileBack = () => {
    router.push('/spaces');
  };
  const handleCategoriesBack = () => {
    setSelectedTab(TabContentEnum.Profile);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };
  const handleLinksBack = () => {
    setSelectedTab(TabContentEnum.Categories);
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderTabContent = () => {
    return (
      <>
        <div className={cn({ hidden: selectedTab !== TabContentEnum.Profile })}>
          <ProfileContent
            form={profileForm}
            onSubmit={handleProfileSubmit}
          />
        </div>
        <div
          className={cn({ hidden: selectedTab !== TabContentEnum.Categories })}
        >
          <CategoriesContent
            onBack={handleCategoriesBack}
            form={categoriesForm}
            onSubmit={handleCategoriesSubmit}
          />
        </div>
        <div className={cn({ hidden: selectedTab !== TabContentEnum.Links })}>
          <LinksContent
            isLoading={isSubmit}
            onBack={handleLinksBack}
            form={linksForm}
            onSubmit={handleLinksSubmit}
          />
        </div>
      </>
    );
  };
  const ButtonGroup = ({ className = '' }: { className?: string }) => {
    return (
      <div className={className}>
        <Button
          color="primary"
          size="md"
          // className="bg-[rgba(103,219,255,0.1)] border border-[rgba(103,219,255,0.2)] text-[#67DBFF]"
          className="mobile:w-full tablet:w-full"
          startContent={<ArrowLineDown size={20} />}
          onClick={handleLinksSubmit}
        >
          Save Changed
        </Button>
        <Button
          type="button"
          size="md"
          color="default"
          className="bg-white/[0.05] mobile:w-full tablet:w-full"
          startContent={<XIcon size={20} />}
        >
          Discard Changes
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 移动端 */}
      <div
        className={cn(
          'flex justify-start gap-[40px] py-[20px] px-[40px] mx-auto w-full',
          'mobile:flex-col mobile:p-[10px] mobile:gap-[0px] mobile:mb-[40px]',
        )}
      >
        {/* 左侧 Tabs 列表 */}
        <div
          className={cn(
            'w-[130px] flex justify-end mobile:w-full mobile:justify-center',
          )}
        >
          <StepTabs
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            tabStatuses={tabStatuses}
          />
        </div>

        {/* 中间内容区域 */}
        <div className="w-full max-w-[600px] p-[20px] mobile:p-[10px]">
          {isTablet && <ButtonGroup className="flex flex-col gap-[10px] mb-[30px]"/>}
          {renderTabContent()}
          {/* 底部按钮 */}
          {isPc && (
            <ButtonGroup className="flex justify-end gap-2.5 mt-[30px]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSapce;
