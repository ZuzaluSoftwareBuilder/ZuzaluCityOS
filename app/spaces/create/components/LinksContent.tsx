import { Button, Input, Select, SelectItem } from '@/components/base';
import { Card } from '@/components/base/card';
import { SOCIAL_TYPES } from '@/constant';
import { Link } from '@/types';
import { CaretLeft, CaretRight, Plus, XCircle } from '@phosphor-icons/react';
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
  onSubmit: () => void;
  onBack: () => void;
}

const LinksContent: React.FC<LinksContentProps> = ({
  form,
  onSubmit,
  onBack,
}) => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
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

  const onSubmitHandler = (data: LinksFormData) => {
    onSubmit();
  };

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      <div className="space-y-[10px] mobile:px-[10px]">
        <h2 className="text-[20px] font-bold mobile:text-[18px]">
          Community Links
        </h2>
        <p className="text-[16px] text-white/80 mobile:text-[14px]">
          Include your social and other custom links
        </p>
      </div>

      <Card className="space-y-[40px] p-[20px] mobile:space-y-[20px] mobile:p-[14px]">
        <div className="border-b border-white/10 pb-[20px]">
          <h3 className="mb-[16px] text-[14px] font-bold text-white/50">
            Social Links*
          </h3>
          <div className="space-y-[16px]">
            {socialFields.map((field, index) => (
              <div key={field.id} className="flex gap-[10px]">
                <div className="flex-1 space-y-[16px]">
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
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="mt-[5px] flex items-center gap-[10px] mobile:mt-0 mobile:h-[40px]"
                    >
                      <XCircle size={30} className="size-[30px] opacity-50" />
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
          >
            <Plus size={20} />
            <div>Add Social Link</div>
          </button>
        </div>

        <div className="space-y-[16px]">
          <h3 className="text-[14px] font-bold text-white/50">Custom Links</h3>
          <div className="space-y-[16px]">
            {customFields.map((field, index) => (
              <div key={field.id} className="flex gap-[10px]">
                <div className="flex-1 space-y-[16px]">
                  <label className="block text-base font-medium text-white">
                    Link Title
                  </label>
                  <div className="flex items-start gap-[10px] mobile:w-full mobile:flex-col">
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
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeCustom(index)}
                      className="mt-[5px] flex items-center gap-[10px] mobile:mt-0 mobile:h-[40px] mobile:w-full mobile:justify-end"
                    >
                      <span className="hidden text-[14px] text-white/50 mobile:block">
                        Remove Link
                      </span>
                      <XCircle size={30} className="size-[30px] opacity-50" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => appendCustom({ title: '', links: '' })}
            className="mt-[16px] flex h-[40px] items-center justify-start gap-[10px] bg-transparent px-[14px] py-[8px] text-sm font-semibold opacity-80"
          >
            <Plus size={20} className="size-[20px]" />
            <div>Add Custom Link</div>
          </button>
        </div>
      </Card>

      <div className="flex justify-end gap-[10px] mobile:px-[10px]">
        <Button
          type="button"
          size="md"
          className="w-[120px] gap-[10px] bg-white/[0.05]  mobile:w-[100px]"
          startContent={<CaretLeft size={20} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="button"
          color="submit"
          size="md"
          className="w-[120px]  mobile:w-[100px]"
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

export default LinksContent;
