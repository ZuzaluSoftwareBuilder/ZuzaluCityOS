'use client';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ProfileContent from './components/ProfileContent';
import LinksContent from './components/LinksContent';
import CategoriesContent from './components/CategoriesContent';
import StepTabs, { TabContentEnum } from './components/Tabs';
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
import { useParams } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMediaQuery } from '@/hooks';
import { Button } from '@/components/base';
import { ArrowLineDown, X as XIcon } from '@phosphor-icons/react';
import { GET_SPACE_QUERY_BY_ID, UPDATE_SPACE_MUTATION } from '@/services/graphql/space';
import { useGraphQL } from '@/hooks/useGraphQL';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { Space } from '@/types';
import { executeQuery } from '@/utils/ceramic';
import { createUrlWhenEdit } from '@/services/url';
import { useDialog } from '@/components/dialog/DialogContext';

dayjs.extend(utc);

// 默认值常量
const DEFAULT_AVATAR =
  'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER =
  'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';

const EditSpace = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const { showDialog, hideDialog } = useDialog();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const { isMobile, isPc, isTablet } = useMediaQuery();
  const descriptionEditorStore = useEditorStore();
  const oldProfile = useRef<string>("");
  const oldCategories = useRef<string>("");
  const oldLinks = useRef<string>("");
  const isProfileChange = useRef<boolean>(false);
  const isCategoriesChange = useRef<boolean>(false);
  const isLinksChange = useRef<boolean>(false);

  // 修复类型错误
  const { data: spaceData, isLoading, refetch } = useGraphQL(
    ['getSpaceByID', spaceId],
    GET_SPACE_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => data?.data?.node as Space,
      enabled: !!spaceId,
    },
  );

  // 初始化表单
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
      category: '',
      tags: [],
    },
  });

  const linksForm = useForm<LinksFormData>({
    resolver: yupResolver(LinksValidationSchema),
    mode: 'all',
    defaultValues: {
      socialLinks: [
        {
          title: '',
          links: '',
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

  useEffect(() => {
    const checkChanges = () => {
      const hasChanges = isProfileChange.current || isCategoriesChange.current || isLinksChange.current;
      setIsChange(hasChanges);
    };

    const profileWath = profileForm.watch(() => {
      if(oldProfile.current) {
        isProfileChange.current = JSON.stringify(profileForm.getValues()) !== oldProfile.current;
        checkChanges();
      }
    });
    const categoriesWath = categoriesForm.watch(() => {
      if(oldCategories.current) {
        isCategoriesChange.current = JSON.stringify(categoriesForm.getValues()) !== oldCategories.current;
        checkChanges();
      }
    });
    const linksWath = linksForm.watch(() => {
      if(oldLinks.current) {
        isLinksChange.current = JSON.stringify(linksForm.getValues()) !== oldLinks.current;
        checkChanges();
      }
    });
    return () => {
      profileWath.unsubscribe();
      categoriesWath.unsubscribe();
      linksWath.unsubscribe();
    }
  }, [profileForm, categoriesForm, linksForm]);

  // 设置表单数据
  const setFormData = (data: Space) => {
    if (!data) return;
    profileForm.setValue('name', data.name);
    profileForm.setValue('tagline', data.tagline);
    profileForm.setValue('description', data.description);
    descriptionEditorStore.setValue(data.description);
    profileForm.setValue('avatar', data.avatar || '');
    profileForm.setValue('banner', data.banner || '');
    categoriesForm.setValue('tags', data.tags?.map((i) => i.tag) || []);
    categoriesForm.setValue('category', data.category || '');
    linksForm.setValue('socialLinks', data.socialLinks || []);
    linksForm.setValue('customLinks', data.customLinks || []);
    setTimeout(() => {
      oldProfile.current = JSON.stringify(profileForm.getValues());
      oldCategories.current = JSON.stringify(categoriesForm.getValues());
      oldLinks.current = JSON.stringify(linksForm.getValues());
      setIsChange(false);
    }, 0);
  };

  // 当spaceData变化时，更新表单数据
  useEffect(() => {
    if (spaceData) {
      setFormData(spaceData);
    }
  }, [spaceData]);

  // Tab切换处理
  const handleTabChange = (key: TabContentEnum) => {
    setSelectedTab(key);
  };

  // 放弃更改处理
  const handleDiscard = () => {
    if (spaceData) {
      setFormData(spaceData);
      setIsChange(false);
    }
  };

  // 优化数据转换函数
  const transformFormData = (): Partial<Space> => {
    const { name, tagline, description, avatar, banner } = profileForm.getValues();
    const { tags, category } = categoriesForm.getValues();
    const { socialLinks, customLinks } = linksForm.getValues();

    return {
      name,
      tagline,
      description,
      avatar: avatar || DEFAULT_AVATAR,
      banner: banner || DEFAULT_BANNER,
      customLinks,
      socialLinks,
      category,
      tags: tags.map((i) => ({ tag: i })),
      updatedAt: new Date().toISOString()
    };
  };

  // 保存处理函数
  const handleSave = async () => {
    try {
      const contentData = transformFormData();
      setIsSubmit(true);

      const response = await executeQuery(UPDATE_SPACE_MUTATION, {
        input: {
          id: spaceId,
          content: contentData,
        },
      });

      if (response.errors) {
        console.error('update space error:', response.errors);
        throw new Error(response.errors[0]?.message || 'unknown error');
      }

      // 如果名称改变，更新URL
      if (contentData.name !== spaceData?.name) {
        const urlName = covertNameToUrlName(contentData.name || '');
        await createUrlWhenEdit(urlName, spaceId, 'spaces');
      }

      await refetch();

      showDialog({
        title: 'Succesfully updated',
        message: 'Your space information has been updated',
        onConfirm: () => {
          hideDialog();
        },
      });
    } catch (error) {
      console.error('failed to update:', error);
      showDialog({
        title: 'Failed to update space',
        message: `Failed to update: ${error instanceof Error ? error.message : 'unknown error'}`,
        onConfirm: () => {
          hideDialog();
        },
      });
    } finally {
      setIsSubmit(false);
    }
  };

  // 渲染Tab内容
  const renderTabContent = () => (
    <>
      <div className={cn({ hidden: selectedTab !== TabContentEnum.Profile })}>
        <ProfileContent
          form={profileForm}
          descriptionEditorStore={descriptionEditorStore}
        />
      </div>
      <div className={cn({ hidden: selectedTab !== TabContentEnum.Categories })}>
        <CategoriesContent form={categoriesForm} />
      </div>
      <div className={cn({ hidden: selectedTab !== TabContentEnum.Links })}>
        <LinksContent form={linksForm} />
      </div>
    </>
  );

  // 按钮组组件
  const ButtonGroup = ({ className = '' }: { className?: string }) => (
    <div className={className}>
      <Button
        color="primary"
        size="md"
        className="mobile:w-full tablet:w-full"
        startContent={!isSubmit && <ArrowLineDown size={20} />}
        isDisabled={!isChange && !isLoading} // 如果没有变更或正在加载，禁用按钮
        isLoading={isSubmit}
        onClick={handleSave}
      >
        Save Changed
      </Button>
      <Button
        type="button"
        size="md"
        color="default"
        className="bg-white/[0.05] mobile:w-full tablet:w-full"
        startContent={<XIcon size={20} />}
        onClick={handleDiscard}
        isDisabled={!isChange || isLoading} // 如果没有变更或正在加载，禁用按钮
      >
        Discard Changes
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div
        className={cn(
          'flex justify-start gap-[40px] py-[20px] px-[40px] mx-auto w-full',
          'tablet:py-[0px] tablet:px-[0px] tablet:gap-[0px]',
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
          />
        </div>

        {/* 中间内容区域 */}
        <div className="w-full max-w-[600px] p-[20px] mobile:p-[10px]">
          {isTablet && <ButtonGroup className="flex flex-col gap-[10px] mb-[30px]" />}
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

export default EditSpace;
