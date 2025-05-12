'use client';

import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base/drawer';
import ZuInput from '@/components/core/Input';
import {
  FormLabel,
  FormLabelDesc,
} from '@/components/typography/formTypography';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/models/space';
import Yup from '@/utils/yupExtensions';
import { Button } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import {
  CaretRight,
  Check,
  DoorOpen,
  LockLaminated,
  PlusCircle,
  X,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Define the form data type
export type CalendarFormData = {
  name: string;
  categories: string[];
  accessRule: 'open' | 'gated';
};

interface CalendarDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  space: Space;
  onClose: () => void;
  refetch: () => void;
  initialData?: Partial<CalendarFormData>;
}

const CalendarDrawer = ({
  isOpen,
  onOpenChange,
  space,
  onClose,
  refetch,
  initialData,
}: CalendarDrawerProps) => {
  const { composeClient } = useCeramicContext();

  // Calendar configuration mutation
  const configCalendarMutation = useMutation({
    mutationFn: async (data: CalendarFormData) => {
      const result = await composeClient.executeQuery(
        `
        mutation updateZucitySpaceMutation($input: UpdateZucitySpaceInput!) {
          updateZucitySpace(
            input: $input
          ) {
            document {
              id
            }
          }
        }
        `,
        {
          input: {
            id: space.id,
            content: {
              customAttributes: [
                {
                  tbd: JSON.stringify({
                    key: 'calendarConfig',
                    value: {
                      name: data.name,
                      category: data.categories.join(','),
                      accessRule: data.accessRule,
                    },
                  }),
                },
              ],
            },
          },
        },
      );
      return result;
    },
    onSuccess: () => {
      onClose();
      refetch();
    },
  });

  // Handle form submission
  const handleFormSubmit = useCallback(
    (data: CalendarFormData) => {
      configCalendarMutation.mutate(data);
    },
    [configCalendarMutation],
  );

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: 'w-[600px] max-w-[600px] mobile:w-[100%] mobile:max-w-[100%]',
      }}
    >
      <DrawerContent>
        <CommonDrawerHeader
          title="Calendar Settings"
          onClose={onClose}
          isDisabled={configCalendarMutation.isPending}
        />
        <DrawerBody className="flex flex-col gap-[20px] p-[20px]">
          <CalendarForm
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            initialData={initialData}
            isSubmitting={configCalendarMutation.isPending}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

// Define the form schema
const schema = Yup.object({
  name: Yup.string().required('Calendar name is required'),
  categories: Yup.array()
    .of(Yup.string())
    .required('At least one category is required')
    .min(1, 'At least one category is required'),
  accessRule: Yup.string().required('Access rule is required'),
});

interface CalendarFormProps {
  onSubmit: (data: CalendarFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CalendarFormData>;
  isSubmitting?: boolean;
}

const CalendarForm = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false,
}: CalendarFormProps) => {
  // Form state
  const [newCategory, setNewCategory] = useState('');

  // Initialize form with react-hook-form
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<CalendarFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: initialData?.name || '',
      categories: (initialData?.categories?.filter(Boolean) as string[]) || [],
      accessRule: (initialData?.accessRule as 'open' | 'gated') || 'open',
    },
  });

  const accessRule = watch('accessRule');
  const categories = watch('categories');

  // Handle adding a new category
  const handleAddCategory = useCallback(() => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setValue('categories', [...categories, newCategory.trim()]);
      setNewCategory('');
    }
  }, [newCategory, categories, setValue]);

  // Handle removing a category
  const handleRemoveCategory = useCallback(
    (category: string) => {
      setValue(
        'categories',
        categories.filter((c) => c !== category),
      );
    },
    [categories, setValue],
  );

  // Handle form submission
  const onFormSubmit = useCallback(
    (data: CalendarFormData) => {
      onSubmit(data);
    },
    [onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-[20px]"
    >
      {/* Details Section */}
      <Typography className="text-[16px] font-semibold text-white opacity-60">
        Details
      </Typography>

      <Box className="rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px]">
        <Stack direction="column" spacing={2}>
          <Stack direction="column" spacing={1}>
            <FormLabel>Calendar Name</FormLabel>
            <Typography className="text-[13px] font-normal opacity-80">
              For multiple keys, use comma for separation
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <ZuInput
                  {...field}
                  placeholder="type a name"
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <Typography color="error" fontSize="12px">
                {errors.name.message}
              </Typography>
            )}
          </Stack>

          {/* Categories Section */}
          <Stack direction="column" spacing={1}>
            <FormLabel>Calendar Categories</FormLabel>
            <FormLabelDesc>Create categories for this Calendar</FormLabelDesc>

            <div className="flex items-center rounded-[10px] border border-white/10 bg-white/[0.05] px-[10px] py-[13px]">
              <input
                className="w-full border-none bg-transparent text-[16px] text-white opacity-50 outline-none"
                placeholder="Add a category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <div
                className="flex cursor-pointer items-center opacity-50"
                onClick={handleAddCategory}
              >
                <PlusCircle size={20} />
              </div>
            </div>

            {/* Display categories as tags */}
            {categories.length > 0 && (
              <div className="mt-[10px] flex flex-wrap gap-[10px]">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center rounded-[10px] bg-white/[0.05] px-[10px] py-[4px]"
                  >
                    <span className="text-[14px] font-semibold text-white">
                      {category}
                    </span>
                    <div
                      className="ml-[10px] cursor-pointer opacity-50"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      <X size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* Access Rules Section */}
      <Typography className="text-[16px] font-semibold text-white opacity-60">
        Access Rules
      </Typography>

      <Box className="rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px]">
        <Stack direction="column" spacing={3}>
          {/* Access Type Selection */}
          <Stack direction="row" spacing={2}>
            <div
              className={`flex flex-1 cursor-pointer flex-row items-center rounded-[10px] border border-white/10 bg-white/[0.05] p-[10px] ${accessRule === 'open' ? 'opacity-100' : 'opacity-60'}`}
              onClick={() => setValue('accessRule', 'open')}
            >
              <DoorOpen size={24} />
              <Typography className="ml-[10px] font-semibold">
                Open App
              </Typography>
            </div>

            <div
              className={`flex flex-row items-center ${accessRule === 'gated' ? 'bg-white/[0.1]' : 'bg-white/[0.05]'} relative flex-1 cursor-pointer rounded-[10px] border border-white/10 p-[10px]`}
              onClick={() => setValue('accessRule', 'gated')}
            >
              <LockLaminated size={24} />
              <Typography className="ml-[10px] font-semibold">
                Gated App
              </Typography>
              {accessRule === 'gated' && (
                <div className="absolute right-[10px]">
                  <Check size={20} />
                </div>
              )}
            </div>
          </Stack>

          <Typography className="text-[14px] opacity-80">
            A Gated App requires users to verify a credential or hold a specific
            role to gain access
          </Typography>

          {/* Access Rules Options (only visible when gated is selected) */}
          {accessRule === 'gated' && (
            <Stack direction="column" spacing={2}>
              <div className="cursor-pointer rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-[10px_20px]">
                <div className="flex items-center justify-between">
                  <Stack>
                    <Typography className="font-semibold">By Role</Typography>
                    <Typography className="text-[13px] opacity-60">
                      Select spaces roles
                    </Typography>
                  </Stack>
                  <CaretRight size={20} className="opacity-60" />
                </div>
              </div>

              <div className="cursor-pointer rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-[10px_20px]">
                <div className="flex items-center justify-between">
                  <Stack>
                    <Typography className="font-semibold">
                      By Credential
                    </Typography>
                    <Typography className="text-[13px] opacity-60">
                      Select spaces roles
                    </Typography>
                  </Stack>
                  <CaretRight size={20} className="opacity-60" />
                </div>
              </div>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Form Footer */}
      <div className="mt-[20px] flex justify-end gap-[10px]">
        <Button
          className="rounded-[10px] border border-white/10 bg-white/[0.05] px-[14px] py-[8px] text-[14px] font-bold"
          onPress={onCancel}
          isDisabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          className="rounded-[10px] border border-[rgba(103,219,255,0.2)] bg-[rgba(103,219,255,0.1)] px-[14px] py-[8px] text-[14px] font-bold text-[#67DBFF]"
          type="submit"
          isDisabled={isSubmitting || !isDirty || !isValid}
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Calendar' : 'Create Calendar'}
        </Button>
      </div>
    </form>
  );
};

export default CalendarDrawer;
