import React from 'react';
import { useForm, useFieldArray, Controller, UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/base/card';
import { Input, Button, Select, SelectItem } from '@/components/base';
import { SOCIAL_TYPES } from '@/constant';
import { XCircle, Plus } from '@phosphor-icons/react';
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import * as yup from 'yup';

export interface LinksFormData {
    socialLinks: Array<{
        title: string;
        links: string;
    }>;
    customLinks: Array<{
        title: string;
        links: string;
    }>;
}

export const LinksValidationSchema = yup.object({
    socialLinks: yup.array().of(
        yup.object({
            title: yup.string().required('Please select a social platform'),
            links: yup.string().url('Please enter a valid URL').required('Please enter URL'),
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
}

const LinksContent: React.FC<LinksContentProps> = ({ form, onSubmit, onBack }) => {
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
                <h2 className="text-[20px] mobile:text-[18px] font-bold">Community Links</h2>
                <p className="text-[16px] mobile:text-[14px] text-white/80">
                    Include your social and other custom links
                </p>
            </div>
            
            <Card className="p-[20px] mobile:p-[14px] space-y-[40px] mobile:space-y-[20px]">
                <div className="pb-[20px] border-b border-white/10">
                    <h3 className="text-[14px] text-white/50 font-bold mb-[16px]">Social Links</h3>
                    <div className="space-y-[16px]">
                        {socialFields.map((field, index) => (
                            <div key={field.id} className="flex gap-[10px]">
                                <div className="flex-1 space-y-[16px]">
                                    <label className="block text-base text-white font-medium">Select Social</label>
                                    <div className='flex gap-[10px] items-start mobile:flex-col mobile:items-end'>
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
                                                    errorMessage={errors.socialLinks?.[index]?.title?.message}
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
                                                    errorMessage={errors.socialLinks?.[index]?.links?.message}
                                                    isInvalid={!!errors.socialLinks?.[index]?.links}
                                                />
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSocial(index)}
                                            className="flex items-center gap-[10px] mt-[5px] mobile:mt-[0px] mobile:h-[40px]"
                                        >
                                            <XCircle size={30} className="h-[30px] w-[30px] opacity-50" />
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
                    >
                        <Plus size={20} />
                        <div>Add Social Link</div>
                    </button>
                </div>

                <div className="space-y-[16px]">
                    <h3 className="text-[14px] text-white/50 font-bold">Custom Links</h3>
                    <div className="space-y-[16px]">
                        {customFields.map((field, index) => (
                            <div key={field.id} className="flex gap-[10px]">
                                <div className="flex-1 space-y-[16px]">
                                    <label className="block text-base text-white font-medium">Link Title</label>
                                    <div className="flex gap-[10px] items-start mobile:flex-col mobile:w-full">
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
                                            className="flex items-center gap-[10px] mt-[5px] mobile:mt-0 mobile:h-[40px] mobile:w-full mobile:justify-end"
                                        >
                                            <span className="hidden text-white/50 text-[14px] mobile:block">Remove Link</span>
                                            <XCircle size={30} className="h-[30px] w-[30px] opacity-50" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => appendCustom({ title: '', links: '' })}
                        className="h-[40px] mt-[16px] w-full bg-transparent opacity-80 py-[8px] px-[14px] font-semibold text-sm justify-start flex items-center gap-[10px]"
                    >
                        <Plus size={20} className="h-[20px] w-[20px]" />
                        <div>Add Custom Link</div>
                    </button>
                </div>
            </Card>

            <div className="flex justify-end gap-[10px] mobile:px-[10px]">
                <Button
                    type="button"
                    size="md"
                    className="w-[120px] bg-white/[0.05] gap-[10px]"
                    startContent={<CaretLeft size={20} />}
                    onClick={onBack}
                >
                    Back
                </Button>
                <Button
                    type="button"
                    color="submit"
                    size="md"
                    className="w-[120px]text-[#67DBFF]"
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
