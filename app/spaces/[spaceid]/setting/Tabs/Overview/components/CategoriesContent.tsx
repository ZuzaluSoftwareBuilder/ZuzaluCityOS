import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { Card, CardBody, Chip } from '@/components/base';
import SelectCategories from '@/components/select/selectCategories';
import { SpaceTypes } from '@/app/spaces/create/components/constant';

// 类型定义
interface IconProps {
  size?: number;
  color?: string;
}

export interface CategoriesFormData {
  selectedCategory: number;
  categories: string[];
}

interface CategoryCardProps {
  icon?: React.ReactElement<IconProps>;
  title: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

interface CategoriesContentProps {
  form: UseFormReturn<CategoriesFormData>;
  onSubmit: (data: CategoriesFormData) => void;
  onBack: () => void;
}

// 验证 schema
export const CategoriesValidationSchema = yup
  .object({
    selectedCategory: yup.number().required('Please select a category'),
    categories: yup
      .array()
      .of(yup.string().defined())
      .min(1, 'Please select at least one tag')
      .max(5, 'Please select at most 5 tags')
      .required('Please select tags'),
  })
  .required();

// 子组件：分类卡片
const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  selected = false,
  onClick,
  color,
}) => {
  const iconElement =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon, { size: 7, color })
      : null;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        selected
          ? 'bg-white/[0.1] border border-white'
          : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05]'
      } rounded-[10px] h-[50px]`}
    >
      <CardBody
        className="flex flex-row gap-[14px] justify-start items-center px-[20px] py-[10px]"
        onClick={onClick}
      >
        {iconElement && <div className="w-6 h-6">{iconElement}</div>}
        <div className="text-base font-semibold leading-[1.4]">{title}</div>
      </CardBody>
    </Card>
  );
};

// 子组件：分类选择区域
const CategorySelection: React.FC<{
  control: UseFormReturn<CategoriesFormData>['control'];
  selectedCategory: number;
  error?: string;
}> = ({ control, selectedCategory, error }) => (
  <div className="space-y-[20px]">
    <div className="space-y-[10px]">
      <h3 className="text-base font-medium">Select Categories*</h3>
      <p className="text-white/80 text-sm">
        Select the ones that relay your space's focuses
      </p>
    </div>

    <Controller
      name="selectedCategory"
      control={control}
      render={({ field }) => (
        <div className="grid grid-cols-3 gap-2 mobile:grid-cols-1">
          {SpaceTypes.map((type) => (
            <CategoryCard
              key={type.id}
              icon={type.icon}
              title={type.name}
              color={type.color}
              selected={selectedCategory === type.id}
              onClick={() => {
                field.onChange(type.id);
                console.log('selectedCategory', type.id);
              }}
            />
          ))}
        </div>
      )}
    />

    {error && <p className="text-error text-sm">{error}</p>}

    <p className="text-white/50 text-sm">
      Note: Space types will include more functionalities in future versions.
    </p>
  </div>
);

// 主组件
const CategoriesContent: React.FC<CategoriesContentProps> = ({
  form,
  onSubmit,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = form;

  const selectedCategory = watch('selectedCategory');

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      {/* 分类选择部分 */}
      <CategorySelection
        control={control}
        selectedCategory={selectedCategory}
        error={errors.selectedCategory?.message}
      />
      <div className="space-y-[20px]">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Community Tags* (Max: 5)</h3>
          <p className="text-white/60 text-xs">
            Create or search for existing categories related to this community
          </p>
        </div>

        <div className="space-y-[10px]">
          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <SelectCategories onChange={field.onChange} value={field.value} />
            )}
          />
          {errors.categories && (
            <p className="text-error text-sm">{errors.categories.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesContent;
