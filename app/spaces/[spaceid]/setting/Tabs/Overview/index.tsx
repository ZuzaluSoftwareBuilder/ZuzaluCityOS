'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  ProfileContent,
  LinksContent,
  CategoriesContent,
  StepTabs,
  TabContentEnum,
  ProfileFormData,
  ProfilValidationSchema,
  CategoriesFormData,
  CategoriesValidationSchema,
  LinksFormData,
  LinksValidationSchema,
} from './components';
import { cn } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'next/navigation';
import { covertNameToUrlName } from '@/utils/format';
import { useMediaQuery } from '@/hooks';
import { Button } from '@/components/base';
import { ArrowLineDown, X as XIcon } from '@phosphor-icons/react';
import { UPDATE_SPACE_MUTATION } from '@/services/graphql/space';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { Space } from '@/types';
import { executeQuery } from '@/utils/ceramic';
import { createUrlWhenEdit } from '@/services/url';
import { useSpacePermissions } from '@/app/spaces/[spaceid]/components/permission';
import { useSpaceData } from '@/app/spaces/[spaceid]/components/context/spaceData';
import { Categories } from '@/constant';
import { addToast } from '@heroui/react';

const DEFAULT_AVATAR =
  'https://nftstorage.link/ipfs/bafybeifcplhgttja4hoj5vx4u3x7ucft34acdpiaf62fsqrobesg5bdsqe';
const DEFAULT_BANNER =
  'https://nftstorage.link/ipfs/bafybeifqan4j2n7gygwkmekcty3dsp7v4rxbjimpo7nrktclwxgxreiyay';

const EditSpace = () => {
  const [selectedTab, setSelectedTab] = useState(TabContentEnum.Profile);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const params = useParams();
  const spaceId = params.spaceid?.toString() ?? '';
  const { isMobile, isPc, isTablet } = useMediaQuery();
  const descriptionEditorStore = useEditorStore();
  const oldProfile = useRef<string>('');
  const oldCategories = useRef<string>('');
  const oldLinks = useRef<string>('');
  const isProfileChange = useRef<boolean>(false);
  const isCategoriesChange = useRef<boolean>(false);
  const isLinksChange = useRef<boolean>(false);
  const { spaceData, isSpaceDataLoading, refreshSpaceData } = useSpaceData();
  const { isOwner } = useSpacePermissions();

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
      customLinks: [],
    },
  });

  useEffect(() => {
    const checkChanges = () => {
      const hasChanges =
        isProfileChange.current ||
        isCategoriesChange.current ||
        isLinksChange.current;
      setIsChange(hasChanges);
    };

    const profileWath = profileForm.watch(() => {
      if (oldProfile.current) {
        isProfileChange.current =
          JSON.stringify(profileForm.getValues()) !== oldProfile.current;
        checkChanges();
      }
    });
    const categoriesWath = categoriesForm.watch(() => {
      if (oldCategories.current) {
        isCategoriesChange.current =
          JSON.stringify(categoriesForm.getValues()) !== oldCategories.current;
        checkChanges();
      }
    });
    const linksWath = linksForm.watch(() => {
      if (oldLinks.current) {
        isLinksChange.current =
          JSON.stringify(linksForm.getValues()) !== oldLinks.current;
        checkChanges();
      }
    });
    return () => {
      profileWath.unsubscribe();
      categoriesWath.unsubscribe();
      linksWath.unsubscribe();
    };
  }, [profileForm, categoriesForm, linksForm]);

  const setFormData = (data: Space) => {
    if (!data) return;
    profileForm.setValue('name', data.name);
    profileForm.setValue('tagline', data.tagline);
    profileForm.setValue('description', data.description);
    descriptionEditorStore.setValue(data.description);
    profileForm.setValue('avatar', data.avatar || '');
    profileForm.setValue('banner', data.banner || '');
    categoriesForm.setValue('tags', data.tags?.map((i) => i.tag) || []);
    categoriesForm.setValue('category', data.category || Categories[0].value);
    linksForm.setValue('socialLinks', data.socialLinks || []);
    linksForm.setValue('customLinks', data.customLinks || []);
    setTimeout(() => {
      oldProfile.current = JSON.stringify(profileForm.getValues());
      oldCategories.current = JSON.stringify(categoriesForm.getValues());
      oldLinks.current = JSON.stringify(linksForm.getValues());
      setIsChange(false);
    }, 0);
  };

  useEffect(() => {
    if (spaceData) {
      setFormData(spaceData);
    }
  }, [spaceData]);

  const handleTabChange = (key: TabContentEnum) => {
    setSelectedTab(key);
  };

  const handleDiscard = () => {
    if (spaceData) {
      const oldData = spaceData;
      oldData.socialLinks = JSON.parse(oldLinks.current).socialLinks;
      oldData.customLinks = JSON.parse(oldLinks.current).customLinks;
      setFormData(oldData);
      setIsChange(false);
    }
  };

  const transformFormData = (): Partial<Space> => {
    const { name, tagline, description, avatar, banner } =
      profileForm.getValues();
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
      updatedAt: new Date().toISOString(),
    };
  };

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

      if (contentData.name !== spaceData?.name) {
        const urlName = covertNameToUrlName(contentData.name || '');
        await createUrlWhenEdit(urlName, spaceId, 'spaces');
      }

      await refreshSpaceData();
      addToast({
        title: 'Succesfully updated',
        description: 'Your space information has been updated',
        color: 'success',
      });
    } catch (error) {
      console.error('failed to update:', error);
      addToast({
        title: 'Failed to update',
        description: `Failed to update: ${error instanceof Error ? error.message : 'unknown error'}`,
        color: 'danger',
      });
    } finally {
      setIsSubmit(false);
    }
  };

  const renderTabContent = () => (
    <div className="mobile:space-y-[30px]">
      <div
        className={cn(
          { hidden: selectedTab !== TabContentEnum.Profile },
          'mobile:block',
        )}
      >
        <ProfileContent
          form={profileForm}
          descriptionEditorStore={descriptionEditorStore}
          isDisabled={!isOwner}
        />
      </div>
      <div
        className={cn(
          { hidden: selectedTab !== TabContentEnum.Categories },
          'mobile:block',
        )}
      >
        <CategoriesContent form={categoriesForm} isDisabled={!isOwner} />
      </div>
      <div
        className={cn(
          { hidden: selectedTab !== TabContentEnum.Links },
          'mobile:block',
        )}
      >
        <LinksContent form={linksForm} isDisabled={!isOwner} />
      </div>
    </div>
  );

  const ButtonGroup = ({ className = '' }: { className?: string }) => (
    <div className={className}>
      <Button
        type="button"
        size="md"
        color="default"
        className="bg-white/[0.05] tablet:w-full mobile:w-full"
        startContent={<XIcon size={20} />}
        onClick={handleDiscard}
        isDisabled={!isChange || isSpaceDataLoading || !isOwner}
      >
        Discard Changes
      </Button>
      <Button
        color="submit"
        size="md"
        className="tablet:w-full mobile:w-full"
        startContent={!isSubmit && <ArrowLineDown size={20} />}
        isDisabled={(!isChange && !isSpaceDataLoading) || !isOwner}
        isLoading={isSubmit}
        onClick={handleSave}
      >
        Save Changed
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div
        className={cn(
          'flex justify-center gap-[40px] py-[20px] px-[40px] mx-auto w-full',
          'tablet:py-[0px] tablet:px-[0px] tablet:gap-[0px]',
          'mobile:p-[20px] mobile:gap-[0px]',
        )}
      >
        <div className={cn('w-[130px] flex justify-end mobile:hidden')}>
          <StepTabs selectedTab={selectedTab} onTabChange={handleTabChange} />
        </div>

        <div className="w-full max-w-[700px] p-[20px] mobile:p-[10px]">
          {(isTablet || isMobile) && (
            <ButtonGroup className="mb-[30px] flex flex-col-reverse gap-[10px]" />
          )}
          {renderTabContent()}
          {isPc && (
            <ButtonGroup className="mt-[30px] flex justify-end gap-2.5" />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditSpace;
