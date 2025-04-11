'use client';
import { Avatar, Button, Card, Input } from '@/components/base';
import EditorPro from '@/components/editorPro';
import PhotoUpload from '@/components/form/PhotoUpload';
import { cn, Image } from '@heroui/react';
import {
  CaretRight,
  MarkdownLogo,
  Image as PhosphorImage,
  X,
} from '@phosphor-icons/react';
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
  onSubmit: (data: ProfileFormData) => void;
  onBack: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  form,
  onSubmit,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;
  const onSubmitHandler = (data: ProfileFormData) => {
    onSubmit(data);
  };
  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      <div className="space-y-[10px] mobile:px-[10px]">
        <h2 className="text-[20px] font-bold mobile:text-[18px]">
          Community Profile
        </h2>
        <p className="text-[16px] text-white opacity-80 mobile:text-[14px]">
          Let&apos;s begin with the basics for your community
        </p>
      </div>
      <Card
        radius="md"
        className={cn(
          'p-[20px] space-y-[40px]',
          'mobile:p-[14px] mobile:space-y-[20px]',
        )}
      >
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
          <div className="space-y-[10px]">
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

        <div className="space-y-[20px]">
          <div className="space-y-[10px]">
            <label className="block text-base font-medium">
              Community Description*
            </label>
            <p className="text-sm text-white/60">
              This is a description or greeting for new members. You can also
              update descriptions later.
            </p>
          </div>
          <div className="space-y-[10px]">
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <EditorPro
                  value={value}
                  onChange={onChange}
                  className={{ base: 'min-h-[190px]' }}
                  placeholder="This space is about whatever"
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
          <div className="space-y-[10px]">
            <label className="block text-base font-medium">Space Avatar*</label>
            <p className="text-sm text-white/60">
              Recommend min of 200x200px (1:1 Ratio). Supported Formats: JPG,
              PNG, GIF
            </p>
          </div>
          <div className="flex items-center gap-[20px]">
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
                    icon={<PhosphorImage className="size-[40px] opacity-30" />}
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
                className={cn('w-full h-[200px]', 'mobile:h-[160px]')}
                accept={[
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/svg+xml',
                ]}
              >
                <div className="w-full">
                  {value ? (
                    <Image
                      src={value}
                      alt="banner"
                      width="100%"
                      className={cn(
                        'object-cover h-[200px]',
                        'mobile:h-[160px]',
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'w-full h-full flex flex-col items-center justify-center border border-dashed border-white/[0.2] rounded-[10px] gap-[8px] py-[60px]',
                        'mobile:py-[40px]',
                      )}
                    >
                      <PhosphorImage className="size-[32px] opacity-30" />
                      <p className="text-center text-sm text-white/60 mobile:p-[12px]">
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
      </Card>

      <div className="flex justify-end gap-[15px]">
        <Button
          type="button"
          size="md"
          className="w-[120px] bg-white/[0.05]"
          startContent={<X size={20} />}
          onClick={onBack}
        >
          Discard
        </Button>
        <Button
          type="submit"
          color="submit"
          size="md"
          className="w-[120px]"
          endContent={<CaretRight size={20} />}
          isDisabled={!isValid}
          onClick={handleSubmit(onSubmitHandler)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProfileContent;
