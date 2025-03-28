'use client';
import React, { useEffect, useState, useRef } from 'react';
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
import { useRouter, useParams } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useCeramicContext } from '@/context/CeramicContext';
import { createUrl } from '@/services/url';
import { useMediaQuery } from '@/hooks';
import { Button } from '@/components/base';
import { ArrowLineDown, X as XIcon } from '@phosphor-icons/react';
import { GET_SPACE_QUERY_BY_ID } from '@/services/graphql/space';
import { useGraphQL } from '@/hooks/useGraphQL';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { Space } from '@/types';
import {} from 'graphql/graphql'
import { executeQuery } from '@/utils/ceramic';

dayjs.extend(utc);

// 添加类型定义

const DEFAULT_AVATAR =
  'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER =
  'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';

const EditSapce = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChange, setIsChange] = useState(false)
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const { isMobile, isPc, isTablet } = useMediaQuery();
  const descriptionEditorStore = useEditorStore();
  const rawDataRef = useRef<Space>(null);
  const { ceramic, composeClient, isAuthenticated, profile } =
    useCeramicContext();
  const { data: spaceData, isLoading } = useGraphQL(
    ['getSpaceByID', spaceId],
    GET_SPACE_QUERY_BY_ID,
    { id: spaceId },
    {
      select: (data) => data?.data?.node as Space,
      enabled: !!spaceId,
    },
  );
  const setFormData = (data: Space) => {
    if (data) {
      profileForm.setValue('name', data.name);
      profileForm.setValue('tagline', data.tagline);
      descriptionEditorStore.setValue(data.description)
      profileForm.setValue('description', data.description);
      profileForm.setValue('avatar', data.avatar || '');
      profileForm.setValue('banner', data.banner || '');
      categoriesForm.setValue('tags', data.tags?.map((i) => i.tag) || []);
      categoriesForm.setValue('category', data.category || '');
      linksForm.setValue('socialLinks', data.socialLinks || []);
      linksForm.setValue('customLinks', data.customLinks || []);
    }
  }
  useEffect(() => {
    if (spaceData) {
      setFormData(spaceData)
      console.log(spaceData)
    }
  },[JSON.stringify(spaceData)])

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
  const handleTabChange = (key: TabContentEnum) => {
    setSelectedTab(key);
  };
  const handleDiscard = () => {
    if(spaceData) {
      setFormData(spaceData)
      setIsChange(false)
    }
  }

  // 优化数据转换函数
  const transformFormData = (): Space => {
    const { name, tagline, description, avatar, banner } =
      profileForm.getValues();
    const { tags, category } = categoriesForm.getValues();
    const { socialLinks, customLinks } = linksForm.getValues();
    const adminId = ceramic?.did?.parent || '';
    const profileId = profile?.id || '';

    return {
      name,
      tagline,
      description,
      avatar: avatar || DEFAULT_AVATAR,
      banner: banner || DEFAULT_BANNER,
      customLinks,
      socialLinks,
      category: category,
      tags: tags.map((i) => ({ tag: i })),
      owner: {
        id: adminId,
      },
    };
  };
  const handleSave = async () => {
    // try {
    //   const result = await executeQuery(, {})
    //   console.log(result)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const renderTabContent = () => {
    return (
      <>
        <div className={cn({ hidden: selectedTab !== TabContentEnum.Profile })}>
          <ProfileContent
            form={profileForm}
            descriptionEditorStore={descriptionEditorStore}
          />
        </div>
        <div
          className={cn({ hidden: selectedTab !== TabContentEnum.Categories })}
        >
          <CategoriesContent
            form={categoriesForm}
          />
        </div>
        <div className={cn({ hidden: selectedTab !== TabContentEnum.Links })}>
          <LinksContent
            form={linksForm}
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
          className="mobile:w-full tablet:w-full"
          startContent={<ArrowLineDown size={20} />}
          onClick={() => {}}
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
