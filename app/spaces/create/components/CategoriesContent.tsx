import React, { useEffect } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { Card, CardBody, Input, Button, Chip } from '@/components/base';
import {
    CaretLeftIcon,
    CareRightIcon
} from '@/components/icons';
import SelectCategories from '@/components/select/selectCategories';
import { CloseIcon } from '@/components/icons/Close';
import { SpaceTypes } from './constant';
// 定义表单数据类型
export interface CategoriesFormData {
    selectedCategory: number;
    communityTags: string[];
}

// 定义验证schema
export const CategoriesValidationSchema = Yup.object({
    selectedCategory: Yup.number().required('please select categories'),
    communityTags: Yup.array(Yup.string().required())
        .required('please select tags')
        .min(1, 'please select at least one tag')
        .max(5, 'please select at most 5 tags'),
}).required();

interface CategorCardProps {
    icon?: React.ReactNode;
    title: string;
    color: string;
    selected?: boolean;
    onClick?: () => void;
}

interface CategoriesContentProps {
    form: UseFormReturn<CategoriesFormData>;
}

const CategorCard: React.FC<CategorCardProps> = ({ icon, title, selected = false, onClick, color }) => {
    const Icon = React.cloneElement(icon as React.ReactElement, { size: 7, color: color });
    return (
        <Card
            className={`cursor-pointer transition-all duration-200 ${selected
                ? 'bg-white/[0.1] border border-white'
                : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]'
                } rounded-[10px]`}
        >
            <CardBody className="flex flex-row gap-[14px] items-center px-5" onClick={onClick}>
                {icon && (
                    <div className="w-6 h-6">
                        {Icon}
                    </div>
                )}
                <div className="text-base font-semibold leading-[1.4]">{title}</div>
            </CardBody>
        </Card>
    );
};

const CategoriesContent: React.FC<CategoriesContentProps> = ({ form }) => {
    // 分类数据
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid }
    } = form;

    const selectedCategory = watch('selectedCategory');
    const communityTags = watch('communityTags');

    const onSubmit = (data: CategoriesFormData) => {
        console.log('Form data:', data);
        // 处理表单提交
    };

    const handleTagRemove = (tagToRemove: string) => {
        const newTags = communityTags.filter(tag => tag !== tagToRemove);
        setValue('communityTags', newTags);
    };

    const handleTagsChange = (values: string[]) => {
        if (values.length <= 5) {
            setValue('communityTags', values);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 标题部分 */}
            <div className="space-y-2">
                <h2 className="text-xl font-bold">Community Labels</h2>
                <p className="text-white/80 text-base">
                    Some informational labels to indicate to users of this community's core focuses and activities
                </p>
            </div>

            {/* 分类选择部分 */}
            <Card className="bg-white/[0.02] border border-white/10 rounded-[10px]">
                <CardBody className="p-5 space-y-8">
                    {/* 选择分类部分 */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Select Categories*</h3>
                            <p className="text-white/80 text-sm">
                                Select the ones that relay your space's focuses
                            </p>
                        </div>

                        {/* 分类选项网格 */}
                        <Controller
                            name="selectedCategory"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-3 gap-2">
                                    {SpaceTypes.map((i) => {
                                        return (
                                            <CategorCard
                                                key={i.id}
                                                icon={i.icon}
                                                title={i.name}
                                                color={i.color}
                                                selected={selectedCategory === i.id}
                                                onClick={() => field.onChange(i.id)}
                                            />
                                        )
                                    })}
                                </div>
                            )}
                        />

                        {errors.selectedCategory && (
                            <p className="text-red-500 text-sm">{errors.selectedCategory.message}</p>
                        )}

                        <p className="text-white/50 text-sm">
                            Note: Space types will include more functionalities in future versions.
                        </p>
                    </div>

                    {/* 社区标签部分 */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <h3 className="text-base font-medium">Community Tags (Max: 5)</h3>
                            <p className="text-white/60 text-xs">
                                Create or search for existing categories related to this community
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* 搜索输入框 */}
                            <Controller
                                name="communityTags"
                                control={control}
                                render={({ field }) => (
                                    <SelectCategories
                                        onChange={handleTagsChange}
                                    />
                                )}
                            />

                            {errors.communityTags && (
                                <p className="text-red-500 text-sm">{errors.communityTags.message}</p>
                            )}

                            {/* 已选标签 */}
                            <div className="flex flex-wrap gap-2.5">
                                {communityTags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        endContent={
                                            <CloseIcon
                                                size={4}
                                                onClick={() => handleTagRemove(tag)}
                                            />
                                        }
                                    >
                                        <span>{tag}</span>
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* 底部按钮 */}
            <div className="flex justify-end gap-2.5">
                <Button
                    type="button"
                    color="secondary"
                    size="md"
                    className="w-[120px]"
                    startContent={<CaretLeftIcon />}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    size="md"
                    className="w-[120px] bg-[rgba(103,219,255,0.1)] border border-[rgba(103,219,255,0.2)] text-[#67DBFF]"
                    endContent={<CareRightIcon />}
                    disabled={!isValid}
                >
                    Next
                </Button>
            </div>
        </form>
    );
};

export default CategoriesContent;
