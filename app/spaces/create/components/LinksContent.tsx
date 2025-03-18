import React from 'react';
import { useForm, useFieldArray, Controller, UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/base/card';
import { Input, Button, Select, SelectItem } from '@/components/base';
import { XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// 定义表单类型
export interface LinksFormData {
    socialLinks: Array<{
        platform: string;
        url: string;
    }>;
    customLinks: Array<{
        title: string;
        url: string;
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
            url: yup.string().url('Please enter a valid URL').required('Please enter URL'),
        })
    ).required(),
});

interface LinksContentProps {
    form: UseFormReturn<LinksFormData>;
}

const LinksContent: React.FC<LinksContentProps> = ({ form }) => {
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

    const socialOptions = [
        { label: "Twitter/X", value: "twitter" },
        { label: "Instagram", value: "instagram" },
        { label: "Discord", value: "discord" },
        { label: "Telegram", value: "telegram" }
    ];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl text-white font-bold">Community Links</h2>
                <p className="text-white/80 text-base">
                    Include your social and other custom links
                </p>
            </div>
            <Card className="p-5">
                <div className="pb-4 border-b border-white/10 mb-8">
                    <h3 className="text-sm text-white/50 font-bold mb-4">Social Links</h3>
                    <div className="space-y-4">
                        {socialFields.map((field, index) => (
                            <div key={field.id} className="flex gap-2.5">
                                <div className="flex-1 space-y-4">
                                    <label className="block text-base text-white font-medium">Select Platform</label>
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
                                                {socialOptions.map((option) => (
                                                    <SelectItem key={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <label className="block text-base text-white font-medium opacity-0">URL</label>
                                    <div className="flex gap-[10px] items-center">
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
                                            disabled={socialFields.length === 1}
                                        >
                                            <XCircleIcon className="h-6 w-6 opacity-50" />
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
                                </div>

                                <div className="flex-1 space-y-4">
                                    <label className="block text-base text-white font-medium opacity-0">URL</label>
                                    <div className="flex gap-[10px] items-center">
                                        <Controller
                                            name={`customLinks.${index}.url`}
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="url"
                                                    placeholder="https://"
                                                    className="w-full"
                                                    errorMessage={errors.customLinks?.[index]?.url?.message}
                                                    isInvalid={!!errors.customLinks?.[index]?.url}
                                                />
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeCustom(index)}
                                            disabled={customFields.length === 1}
                                        >
                                            <XCircleIcon className="h-6 w-6 opacity-50" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    <button
                        type="button"
                        onClick={() => appendCustom({ title: '', url: '' })}
                        className="mt-2 w-full bg-transparent opacity-80 py-2 px-3.5 font-semibold text-sm justify-start flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        <div>Add Custom Link</div>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LinksContent;
