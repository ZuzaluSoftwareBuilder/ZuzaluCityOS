import { Input, Select, SelectItem } from '@/components/base';
import { SOCIAL_TYPES } from '@/constant';
import { Link } from '@/models/base';
import { Plus, XCircle } from '@phosphor-icons/react';
import React from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

export interface LinksFormData {
  socialLinks: Link[];
  customLinks: Link[];
}

export const LinksValidationSchema = yup.object({
  socialLinks: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required('Please select a social platform'),
        links: yup
          .string()
          .url('Please enter a valid URL')
          .required('Please enter URL'),
      }),
    )
    .required(),
  customLinks: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required('Please enter link title'),
        links: yup
          .string()
          .url('Please enter a valid URL')
          .required('Please enter URL'),
      }),
    )
    .default([])
    .optional(),
});

interface LinksContentProps {
  form: UseFormReturn<LinksFormData>;
  isDisabled?: boolean;
}

const LinksContent: React.FC<LinksContentProps> = ({
  form,
  isDisabled = false,
}) => {
  const {
    control,
    formState: { errors },
  } = form;

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  const {
    fields: customFields,
    append: appendCustom,
    remove: removeCustom,
  } = useFieldArray({
    control,
    name: 'customLinks',
  });

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      <div className="border-b border-white/10 pb-[20px]">
        <h3 className="mb-4 text-sm font-bold text-white/50">Social Links*</h3>
        <div className="space-y-4">
          {socialFields.map((field, index) => (
            <div key={field.id} className="flex gap-2.5">
              <div className="flex-1 space-y-4">
                <label className="block text-base font-medium text-white">
                  Select Social
                </label>
                <div className="flex items-start gap-[10px] mobile:flex-col mobile:items-end">
                  <Controller
                    name={`socialLinks.${index}.title`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        className="w-full"
                        placeholder="Select platform"
                        variant="flat"
                        selectedKeys={value ? [value] : []}
                        onChange={(e) => onChange(e.target.value)}
                        errorMessage={
                          errors.socialLinks?.[index]?.title?.message
                        }
                        isInvalid={!!errors.socialLinks?.[index]?.title}
                        isDisabled={isDisabled}
                      >
                        {SOCIAL_TYPES.map((option) => (
                          <SelectItem key={option.key}>
                            {option.value}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name={`socialLinks.${index}.links`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://"
                        className="w-full"
                        errorMessage={
                          errors.socialLinks?.[index]?.links?.message
                        }
                        isInvalid={!!errors.socialLinks?.[index]?.links}
                        isDisabled={isDisabled}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(index)}
                    className="mt-[5px] flex items-center gap-[10px] mobile:mt-0 mobile:h-[40px]"
                    disabled={socialFields.length === 1 || isDisabled}
                  >
                    <span className="hidden text-[14px] text-white/50 mobile:block">
                      Remove Link
                    </span>
                    <XCircle className="size-[30px] opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendSocial({ title: '', links: '' })}
          className="mt-[10px] flex h-[40px] items-center justify-start gap-2 bg-transparent px-[14px] py-2 text-sm font-semibold opacity-80"
          disabled={isDisabled}
        >
          <Plus className="size-5" />
          <div>Add Social Link</div>
        </button>
      </div>

      <div className="">
        <h3 className="mb-4 text-sm font-bold  text-white/50">Custom Links</h3>
        <div className="space-y-4">
          {customFields.map((field, index) => (
            <div key={field.id} className="flex gap-2.5">
              <div className="flex-1 space-y-4">
                <label className="block text-base font-medium text-white ">
                  Link Title
                </label>
                <div className="flex items-start gap-[10px] mobile:flex-col mobile:items-end">
                  <Controller
                    name={`customLinks.${index}.title`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter title"
                        className="w-full"
                        errorMessage={
                          errors.customLinks?.[index]?.title?.message
                        }
                        isInvalid={!!errors.customLinks?.[index]?.title}
                        isDisabled={isDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`customLinks.${index}.links`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://"
                        className="w-full"
                        errorMessage={
                          errors.customLinks?.[index]?.links?.message
                        }
                        isInvalid={!!errors.customLinks?.[index]?.links}
                        isDisabled={isDisabled}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeCustom(index)}
                    disabled={isDisabled}
                    className="mt-[5px] flex items-center gap-[10px] mobile:mt-0 mobile:h-[40px]"
                  >
                    <span className="hidden text-[14px] text-white/50 mobile:block">
                      Remove Link
                    </span>
                    <XCircle className="size-[30px] opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendCustom({ title: '', links: '' })}
          className="mt-[10px] flex h-[40px] items-center justify-start gap-2 bg-transparent px-[14px] py-[8px] text-sm font-semibold opacity-80"
          disabled={isDisabled}
        >
          <Plus className="size-5" />
          <div>Add Custom Link</div>
        </button>
      </div>
    </div>
  );
};

export default LinksContent;
