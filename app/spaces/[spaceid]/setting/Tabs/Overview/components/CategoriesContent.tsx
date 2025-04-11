import { Categories } from '@/app/spaces/create/components/constant';
import { Card, CardBody } from '@/components/base';
import SelectCategories from '@/components/select/selectCategories';
import { IconProps } from '@phosphor-icons/react';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

export interface CategoriesFormData {
  category: string;
  tags: string[];
}

interface CategoryCardProps {
  icon?: React.ReactElement<IconProps>;
  title: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
}

interface CategoriesContentProps {
  form: UseFormReturn<CategoriesFormData>;
  isDisabled?: boolean;
}

export const CategoriesValidationSchema = yup
  .object({
    category: yup.string().required('Please select a category'),
    tags: yup
      .array()
      .of(yup.string().defined())
      .min(1, 'Please select at least one tag')
      .max(5, 'Please select at most 5 tags')
      .required('Please select tags'),
  })
  .required();

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  title,
  selected = false,
  onClick,
  color,
  isDisabled = false,
}) => {
  const iconElement =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon, { size: 30, color, weight: 'fill' })
      : null;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        selected
          ? 'border border-white bg-white/[0.1]'
          : 'border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
      } h-[50px] rounded-[10px]`}
    >
      <CardBody
        className="flex flex-row items-center justify-start gap-[14px] px-[20px] py-[10px]"
        onClick={!isDisabled ? onClick : undefined}
      >
        {iconElement && <div className="size-6">{iconElement}</div>}
        <div className="text-base font-semibold leading-[1.4]">{title}</div>
      </CardBody>
    </Card>
  );
};

const CategorySelection: React.FC<{
  control: UseFormReturn<CategoriesFormData>['control'];
  category: string;
  error?: string;
  isDisabled?: boolean;
}> = ({ control, category, error, isDisabled = false }) => (
  <div className="space-y-[20px]">
    <div className="space-y-[10px]">
      <h3 className="text-base font-medium">Select Categories*</h3>
      <p className="text-sm text-white/80">
        Select the ones that relay your space&apos;s focuses
      </p>
    </div>

    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <div className="grid grid-cols-3 gap-2 mobile:grid-cols-1">
          {Categories.map((type) => (
            <CategoryCard
              key={type.value}
              icon={type.icon}
              title={type.label}
              color={type.color}
              selected={category === type.value}
              onClick={() => {
                field.onChange(type.value);
              }}
              isDisabled={isDisabled}
            />
          ))}
        </div>
      )}
    />

    {error && <p className="text-sm text-error">{error}</p>}

    <p className="text-sm text-white/50">
      Note: Space types will include more functionalities in future versions.
    </p>
  </div>
);

const CategoriesContent: React.FC<CategoriesContentProps> = ({
  form,
  isDisabled = false,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;
  const category = watch('category');

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      {/* 分类选择部分 */}
      <CategorySelection
        control={control}
        category={category}
        error={errors.category?.message}
        isDisabled={isDisabled}
      />
      <div className="space-y-[20px]">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Community Tags* (Max: 5)</h3>
          <p className="text-xs text-white/60">
            Create or search for existing categories related to this community
          </p>
        </div>

        <div className="space-y-[10px]">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <SelectCategories
                onChange={field.onChange}
                value={field.value ? field.value : []}
                isDisabled={isDisabled}
              />
            )}
          />
          {errors.tags && (
            <p className="text-sm text-error">{errors.tags.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesContent;
