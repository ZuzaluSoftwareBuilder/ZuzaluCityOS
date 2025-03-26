 'use client';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Image } from '@heroui/react';
import * as Yup from 'yup';
import { Input, Avatar } from '@/components/base';
import SuperEditor from '@/components/editor/SuperEditor';
import PhotoUpload from '@/components/form/PhotoUpload';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { MarkdownLogo } from '@phosphor-icons/react';
import { useEditorStore } from '@/components/editor/useEditorStore';

// 定义表单数据类型
export interface ProfileFormData {
  name: string;
  tagline: string;
  description: string;
  avatar: string;
  banner: string;
}

// 定义验证模式
export const ProfilValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters.')
    .required('Name is required.'),
  tagline: Yup.string()
    .min(3, 'Tagline must be at least 3 characters.')
    .required('Tagline is required.'),
  description: Yup.string()
    .test(
      'is-valid-blocks',
      'community description is required',
      function (value) {
        if (!value) return true;
        try {
          const parsed = JSON.parse(value);
          if (
            !parsed.blocks ||
            !Array.isArray(parsed.blocks) ||
            parsed.blocks.length === 0
          ) {
            return false;
          }
          return true;
        } catch (e) {
          return false;
        }
      },
    )
    .required(),
  avatar: Yup.string().required('please upload space avatar'),
  banner: Yup.string().required('please upload space banner'),
});

interface ProfileContentProps {
  form: UseFormReturn<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  form,
  onSubmit,
}) => {
  const {
    control,
    formState: { errors },
    watch,
  } = form;
  
  const descriptionEditorStore = useEditorStore();
  
  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      {/* 社区名称 */}
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
            />
          )}
        />
      </div>

      {/* 社区标语 */}
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
              />
            )}
          />
          <div className="text-right text-[10px] text-white/70">
            {watch('tagline')?.length || 0}/100 Characters
          </div>
        </div>
      </div>

      {/* 社区描述 */}
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
              <SuperEditor
                value={descriptionEditorStore.value}
                onChange={(value) => {
                  descriptionEditorStore.setValue(value);
                  onChange(JSON.stringify(value));
                }}
                minHeight={190}
                placeholder="This is a description greeting for new members. You can also update descriptions."
              />
            )}
          />
          <div className="flex items-center gap-[6px]">
            <MarkdownLogo size={20} weight="fill" />
            <div className="text-sm text-white/60">Markdown Available</div>
          </div>
          {errors.description && (
            <p className="text-[#ff5e5e] text-sm">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>

      {/* 空间头像 */}
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
              >
                <Avatar
                  size="xlg"
                  icon={<PhotoIcon className="w-8 h-8 opacity-30" />}
                  src={field.value}
                  alt="avatar"
                  className="bg-transparent border border-dashed border-white/[0.2]"
                />
              </PhotoUpload>
            )}
          />
          {errors.avatar && (
            <p className="text-error text-sm">{errors.avatar.message}</p>
          )}
        </div>
      </div>

      {/* 空间横幅 */}
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
              className="w-full h-[200px] mobile:h-[160px]"
              accept={['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']}
            >
              <div className="w-full">
                {value ? (
                  <Image
                    src={value}
                    alt="banner"
                    width="100%"
                    className="object-cover h-[200px] mobile:h-[160px]"
                  />
                ) : (
                  <div className="w-full h-[200px] mobile:h-[160px] flex flex-col items-center justify-center border border-dashed border-white/[0.2] rounded-[10px] gap-2 py-[60px] mobile:py-[40px]">
                    <PhotoIcon className="w-8 h-8 opacity-30" />
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
          <p className="text-error text-sm">{errors.banner.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;