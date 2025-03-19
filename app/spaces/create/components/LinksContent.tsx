import React from 'react';
import { useForm, useFieldArray, Controller, UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/base/card';
import { Input, Button, Select, SelectItem } from '@/components/base';
import { SOCIAL_TYPES } from '@/constant';
import { XCircleIcon, PlusIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import * as yup from 'yup';
import { ChevronRightIcon} from '@heroicons/react/20/solid'

// 定义表单类型
export interface LinksFormData {
    socialLinks: Array<{
        platform: string;
        url: string;
    }>;
    customLinks: Array<{
        title: string;
        links: string;
    }>;
};

// 定义验证模式
export const LinksValidationSchema = yup.object({
    socialLinks: yup.array().of(
        yup.object({
            platform: yup.string().required('Please select a social platform'),
            url: yup.string().url('Please enter a valid URL').required('Please enter URL'),
        })
    ).required(),
    customLinks: yup.array().of(
        yup.object({
            title: yup.string().required('Please enter link title'),
            links: yup.string().url('Please enter a valid URL').required('Please enter URL'),
        })
    ).required(),
});

interface LinksContentProps {
    form: UseFormReturn<LinksFormData>;
    onSubmit: () => void;
    onBack: () => void;
    isLoading: boolean;
}

const LinksContent: React.FC<LinksContentProps> = ({ form, onSubmit, onBack, isLoading }) => {
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
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl text-white font-bold">Community Links</h2>
                <p className="text-white/80 text-base">
                    Include your social and other custom links
                </p>
            </div>
            <Card className="p-5 mobile:p-3">
                <div className="pb-4 border-b border-white/10 mb-8">
                    <h3 className="text-sm text-white/50 font-bold mb-4">Social Links</h3>
                    <div className="space-y-4">
                        {socialFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2.5">
                                <div className="flex-1 space-y-4">
                                    <label className="block text-base text-white font-medium">Select Platform</label>
                                    <div className='flex gap-[10px] items-start mobile:flex-col mobile:items-end'>
                                        <Controller
                                            name={`socialLinks.${index}.platform`}
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Select
                                                    className="w-full"
                                                    placeholder="Select platform"
                                                    variant="flat"
                                                    selectedKeys={value ? [value] : []}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    errorMessage={errors.socialLinks?.[index]?.platform?.message}
                                                    isInvalid={!!errors.socialLinks?.[index]?.platform}
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
                                            name={`socialLinks.${index}.url`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="url"
                                                    placeholder="https://"
                                                    className="w-full"
                                                    errorMessage={errors.socialLinks?.[index]?.url?.message}
                                                    isInvalid={!!errors.socialLinks?.[index]?.url}
                                                />
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSocial(index)}
                                            className='mt-[10px] flex items-center gap-[10px]'
                                            disabled={socialFields.length === 1}
                                        >
                                            <span className='hidden text-white/50 text-[14px] mobile:block'>Remove Link</span>
                                            <XCircleIcon className="h-[30px] w-[30px] opacity-50" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => appendSocial({ platform: '', url: '' })}
                        className="mb-2 w-full bg-transparent opacity-80 py-2 px-[14px] font-semibold text-sm justify-start flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <div>Add Social Link</div>
                    </button>
                </div>

                <div className="">
                    <h3 className="text-sm text-white/50 font-bold mb-4">Custom Links</h3>
                    <div className="space-y-4">
                        {customFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2.5">
                                <div className="flex-1 space-y-4">
                                    <label className="block text-base text-white font-medium ">Link Title</label>
                                    <div className='flex gap-[10px] items-start mobile:flex-col mobile:items-end'>
                                        <Controller
                                            name={`customLinks.${index}.title`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter title"
                                                    className="w-full"
                                                    errorMessage={errors.customLinks?.[index]?.title?.message}
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
                                                    errorMessage={errors.customLinks?.[index]?.links?.message}
                                                    isInvalid={!!errors.customLinks?.[index]?.links}
                                                />
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCustom(index)}
                                            disabled={customFields.length === 1}
                                            className='mt-[10px] flex items-center gap-[10px]'
                                        >
                                            <span className='hidden text-white/50 text-[14px] mobile:block'>Remove Link</span>
                                            <XCircleIcon className="h-6 w-6 opacity-50" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>


                    <button
                        type="button"
                        onClick={() => appendCustom({ title: '', links: '' })}
                        className="mt-2 w-full bg-transparent opacity-80 py-2 px-3.5 font-semibold text-sm justify-start flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <div>Add Custom Link</div>
                    </button>
                </div>
            </Card>
            {/* 底部按钮 */}
            <div className="flex justify-end gap-2.5">
                <Button
                    type="button"
                    size="md"
                    className="w-[120px] bg-white/[0.05]"
                    startContent={<ChevronLeftIcon className='w-4 h-4' />}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    type="button"
                    color="primary"
                    size="md"
                    className="w-[120px] bg-[rgba(103,219,255,0.1)] border border-[rgba(103,219,255,0.2)] text-[#67DBFF]"
                    endContent={<ChevronRightIcon className='w-4 h-4' />}
                    isDisabled={!isValid}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmitHandler)}
                >
                    Create
                </Button>
            </div>
        </div>
    );
};

export default LinksContent;
