import React from 'react';
import {
  useFieldArray,
  Controller,
  UseFormReturn,
} from 'react-hook-form';
import { Input, Button, Select, SelectItem } from '@/components/base';
import { SOCIAL_TYPES } from '@/constant';
import {
  XCircle,
  Plus,
} from '@phosphor-icons/react';
import * as yup from 'yup';
import { Link } from '@/types';

// 定义表单类型
export interface LinksFormData {
  socialLinks: Link[];
  customLinks: Link[];
}

// 定义验证模式
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
    .required(),
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
      <div className="pb-[20px] border-b border-white/10">
        <h3 className="text-sm text-white/50 font-bold mb-4">Social Links</h3>
        <div className="space-y-4">
          {socialFields.map((field, index) => (
            <div key={field.id} className="flex gap-2.5">
              <div className="flex-1 space-y-4">
                <label className="block text-base text-white font-medium">
                  Select Social
                </label>
                <div className="flex gap-[10px] items-start mobile:flex-col mobile:items-end">
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
                        errorMessage={errors.socialLinks?.[index]?.links?.message}
                        isInvalid={!!errors.socialLinks?.[index]?.links}
                        isDisabled={isDisabled}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeSocial(index)}
                    className="flex items-center gap-[10px] mt-[5px] mobile:mt-[0px] mobile:h-[40px]"
                    disabled={socialFields.length === 1 || isDisabled}
                  >
                    <span className="hidden text-white/50 text-[14px] mobile:block">
                      Remove Link
                    </span>
                    <XCircle className="h-[30px] w-[30px] opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendSocial({ title: '', links: '' })}
          className="h-[40px] mt-[10px] w-full bg-transparent opacity-80 py-2 px-[14px] font-semibold text-sm justify-start flex items-center gap-2"
          disabled={isDisabled}
        >
          <Plus className="h-5 w-5" />
          <div>Add Social Link</div>
        </button>
      </div>

      <div className="">
        <h3 className="text-sm text-white/50 font-bold  mb-4">Custom Links</h3>
        <div className="space-y-4">
          {customFields.map((field, index) => (
            <div key={field.id} className="flex gap-2.5">
              <div className="flex-1 space-y-4">
                <label className="block text-base text-white font-medium ">
                  Link Title
                </label>
                <div className="flex gap-[10px] items-start mobile:flex-col mobile:items-end">
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
                    disabled={customFields.length === 1 || isDisabled}
                    className="flex items-center gap-[10px] mt-[5px] mobile:mt-[0px] mobile:h-[40px]"
                  >
                    <span className="hidden text-white/50 text-[14px] mobile:block">
                      Remove Link
                    </span>
                    <XCircle className="h-[30px] w-[30px] opacity-50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => appendCustom({ title: '', links: '' })}
          className="h-[40px] mt-[10px] w-full bg-transparent opacity-80 py-[8px] px-[14px] font-semibold text-sm justify-start flex items-center gap-2"
          disabled={isDisabled}
        >
          <Plus className="h-5 w-5" />
          <div>Add Custom Link</div>
        </button>
      </div>
    </div>
  );
};

export default LinksContent;
