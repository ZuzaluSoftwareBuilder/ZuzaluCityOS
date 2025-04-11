import { Button, Card, CardBody } from '@/components/base';
import SelectCategories from '@/components/select/selectCategories';
import { CaretLeft, CaretRight, IconProps } from '@phosphor-icons/react';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';
import { Categories } from './constant';
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
}

interface CategoriesContentProps {
  form: UseFormReturn<CategoriesFormData>;
  onSubmit: () => void;
  onBack: () => void;
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
        onClick={onClick}
      >
        {iconElement && <div className="size-[30px]">{iconElement}</div>}
        <div className="text-base font-semibold leading-[1.4]">{title}</div>
      </CardBody>
    </Card>
  );
};

const CategorySelection: React.FC<{
  control: UseFormReturn<CategoriesFormData>['control'];
  category: string;
  error?: string;
}> = ({ control, category, error }) => (
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
  onSubmit,
  onBack,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = form;

  const category = watch('category');

  return (
    <div className="space-y-[30px] mobile:space-y-[20px]">
      <div className="space-y-[10px] mobile:px-[10px]">
        <h2 className="text-[20px] font-bold mobile:text-[18px]">
          Community Labels
        </h2>
        <p className="text-[16px] text-white opacity-80 mobile:text-[14px]">
          Some informational labels to indicate to users of this
          community&apos;s core focuses and activities
        </p>
      </div>

      <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02]">
        <div className="space-y-[40px] p-[20px] mobile:p-[14px]">
          <CategorySelection
            control={control}
            category={category}
            error={errors.category?.message}
          />
          <div className="space-y-[20px]">
            <div className="space-y-[10px]">
              <h3 className="text-base font-medium">
                Community Tags* (Max: 5)
              </h3>
              <p className="text-xs text-white/60">
                Create or search for existing categories related to this
                community
              </p>
            </div>

            <div className="space-y-[10px] ">
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <SelectCategories
                    onChange={field.onChange}
                    value={field.value}
                  />
                )}
              />
              {errors.tags && (
                <p className="text-sm text-error">{errors.tags.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[10px]">
        <Button
          type="button"
          className="w-[120px] gap-[10px] bg-white/[0.05]"
          startContent={<CaretLeft size={20} />}
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          color="submit"
          size="md"
          className="w-[120px]"
          endContent={<CaretRight size={20} />}
          isDisabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CategoriesContent;
