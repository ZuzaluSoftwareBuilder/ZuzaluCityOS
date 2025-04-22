'use client';
import { Avatar, Input } from '@/components/base';
import EditorPro from '@/components/editorPro';
import PhotoUpload from '@/components/form/PhotoUpload';
import { Image } from '@heroui/react';
import { MarkdownLogo, Image as PhotoIcon } from '@phosphor-icons/react';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';

export interface ProfileFormData {
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  banner: string;
}

export const ProfilValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters.')
    .required('Name is required.'),
  tagline: Yup.string()
    .min(3, 'Tagline must be at least 3 characters.')
    .required('Tagline is required.'),
  description: Yup.string().notEmptyJson('Community description is required'),
  avatar: Yup.string().required('Please upload space avatar'),
  banner: Yup.string().required('Please upload space banner'),
});

interface ProfileContentProps {
  form: UseFormReturn<ProfileFormData>;
  isDisabled?: boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  form,
  isDisabled = false,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = form;

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      <div className="space-y-[20px]">
        <label className="block text-base font-medium">Community Name*</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Give your space an awesome name"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              isDisabled={isDisabled}
            />
          )}
        />
      </div>

      <div className="space-y-[20px]">
        <label className="block text-base font-medium">
          Community Tagline*
        </label>
        <div className="space-y-2">
          <Controller
            name="tagline"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Write a short, one-sentence tagline"
                isInvalid={!!errors.tagline}
                errorMessage={errors.tagline?.message}
                maxLength={100}
                isDisabled={isDisabled}
              />
            )}
          />
          <div className="text-right text-[10px] text-white/70">
            {watch('tagline')?.length || 0}/100 Characters
          </div>
        </div>
      </div>

      <div className="space-y-[20px]">
        <div className="space-y-2">
          <label className="block text-base font-medium">
            Community Description*
          </label>
          <p className="text-sm text-white/60">
            This is a description or greeting for new members. You can also
            update descriptions later.
          </p>
        </div>
        <div className="space-y-2">
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <EditorPro
                value={value}
                onChange={onChange}
                isEdit={!isDisabled}
                className={{ base: 'min-h-[190px]' }}
                placeholder="This is a description greeting for new members. You can also update descriptions."
              />
            )}
          />
          <div className="flex items-center gap-[6px]">
            <MarkdownLogo size={20} weight="fill" />
            <div className="text-sm text-white/60">Markdown Available</div>
          </div>
          {errors.description && (
            <p className="text-sm text-error">{errors.description.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-[20px]">
        <div className="space-y-2">
          <label className="block text-base font-medium">Space Avatar*</label>
          <p className="text-sm text-white/60">
            Recommend min of 200x200px (1:1 Ratio). Supported Formats: JPG, PNG,
            GIF
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <PhotoUpload
                initialUrl={field.value}
                onUploadSuccess={field.onChange}
                api="/api/file/upload"
                className="rounded-full"
                isDisabled={isDisabled}
              >
                <Avatar
                  size="xlg"
                  icon={<PhotoIcon className="size-8 opacity-30" />}
                  src={field.value}
                  alt="avatar"
                  className="border border-dashed border-white/[0.2] bg-transparent"
                />
              </PhotoUpload>
            )}
          />
          {errors.avatar && (
            <p className="text-sm text-error">{errors.avatar.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-[20px]">
        <label className="block text-base font-medium">Space Banner*</label>
        <Controller
          name="banner"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PhotoUpload
              initialUrl={value}
              onUploadSuccess={onChange}
              api="/api/file/upload"
              className="h-[200px] w-full mobile:h-[160px]"
              accept={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']}
              isDisabled={isDisabled}
            >
              <div className="w-full">
                {value ? (
                  <Image
                    src={value}
                    alt="banner"
                    width="100%"
                    className="h-[200px] object-cover mobile:h-[160px]"
                  />
                ) : (
                  <div className="flex h-[200px] w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-white/[0.2] py-[60px] mobile:h-[160px] mobile:py-[40px]">
                    <PhotoIcon className="size-8 opacity-30" />
                    <p className="text-sm text-white/60">
                      Recommend min of 730x220. Supported Formats: JPG, PNG
                    </p>
                  </div>
                )}
              </div>
            </PhotoUpload>
          )}
        />
        {errors.banner && (
          <p className="text-sm text-error">{errors.banner.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
