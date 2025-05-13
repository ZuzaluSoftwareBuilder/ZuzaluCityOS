'use client';

import POAPAutocomplete from '@/app/spaces/[spaceid]/setting/access/components/poapAutocomplete';
import { Button } from '@/components/base/button';
import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base/drawer';
import {
  FormFooter,
  FormLabel,
  FormLabelDesc,
  FormSection,
  FormSectionTitle,
} from '@/components/base/form';
import { Input } from '@/components/base/input';
import { Switch } from '@/components/base/switch';
import SelectCategories from '@/components/select/selectCategories';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/models/space';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Check,
  DoorOpen,
  IdentificationBadge,
  LockLaminated,
  Plus,
} from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// Define RegistrationAccess enum to match Figma design
enum RegistrationAccess {
  OpenApp = 'Open App',
  GatedApp = 'Gated App',
}

// Define access type enum
enum AccessType {
  ByRole = 'ByRole',
  ByCredential = 'ByCredential',
}

// Define role type for role selection
interface RoleType {
  id: string;
  name: string;
  isEnabled: boolean;
  color?: string;
}

// Define ItemType interface for access items
interface ItemType {
  id: string;
  name?: string;
  description: React.ReactNode;
  expandedContent?: React.ReactNode;
  icon?: React.ReactNode;
}

// Define POAP type
interface POAP {
  id: number;
  name: string;
  image_url?: string;
}

// Define the form data type
export type CalendarFormData = {
  name: string;
  categories: string[];
  accessRule: string;
  accessType?: AccessType;
  roles?: RoleType[];
  poaps?: POAP[];
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
                      category: data.categories
                        .map((item) => item?.trim())
                        .join(','),
                      accessRule: data.accessRule,
                      accessType: data.accessType,
                      roles: data.roles,
                      poaps: data.poaps,
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
  accessType: Yup.string(),
  roles: Yup.array().of(
    Yup.object({
      id: Yup.string().required(),
      name: Yup.string().required(),
      isEnabled: Yup.boolean().required(),
      color: Yup.string(),
    }),
  ),
  poaps: Yup.array().of(
    Yup.object({
      id: Yup.number().required(),
      name: Yup.string().required(),
      image_url: Yup.string(),
    }),
  ),
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
      accessRule: initialData?.accessRule || RegistrationAccess.OpenApp,
      accessType: initialData?.accessType || AccessType.ByRole,
      roles: initialData?.roles || [
        { id: 'member', name: 'Member', isEnabled: true },
        {
          id: 'customRole1',
          name: 'CustomRole1',
          isEnabled: true,
          color: '#333333',
        },
        {
          id: 'customRole2',
          name: 'CustomRole2',
          isEnabled: false,
          color: '#333333',
        },
      ],
      poaps: initialData?.poaps || [],
    },
    shouldFocusError: true,
  });

  const accessRule = watch('accessRule');
  const roles = watch('roles');
  const poaps = watch('poaps');

  // State to track expanded sections
  const [expandedSection, setExpandedSection] = useState<AccessType | null>(
    null,
  );

  // Define access items based on Figma design
  const accessItems = useMemo<ItemType[]>(
    () => [
      {
        id: RegistrationAccess.OpenApp,
        name: 'Open App',
        description: 'Anybody can access',
        icon: <DoorOpen size={24} />,
      },
      {
        id: RegistrationAccess.GatedApp,
        name: 'Gated App',
        description:
          'A Gated App requires users to verify a credential or hold a specific role to gain access',
        icon: <LockLaminated size={24} />,
      },
    ],
    [],
  );

  // Handle form submission
  const onFormSubmit = useCallback(
    (data: CalendarFormData) => {
      // Include the expanded section in the form data
      const formData = {
        ...data,
        accessType: expandedSection || data.accessType,
        // Only include POAPs if the access type is ByCredential
        poaps:
          expandedSection === AccessType.ByCredential ? data.poaps : undefined,
      };
      onSubmit(formData);
    },
    [onSubmit, expandedSection],
  );

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-[20px]"
    >
      {/* Details Section */}
      <FormSectionTitle>Details</FormSectionTitle>

      <FormSection>
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col gap-[6px]">
              <FormLabel>Calendar Name</FormLabel>
              <FormLabelDesc>
                For multiple keys, use comma for separation
              </FormLabelDesc>
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="type a name" />
              )}
            />
            {errors.name && (
              <div className="text-[12px] text-error">
                {errors.name.message}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[10px]">
              <FormLabel>Calendar Categories</FormLabel>
              <FormLabelDesc>Create categories for this Calendar</FormLabelDesc>
            </div>

            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <SelectCategories
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.categories && (
              <div className="text-[12px] text-error">
                {errors.categories.message}
              </div>
            )}
          </div>
        </div>
      </FormSection>

      {/* Access Rules Section */}
      <FormSectionTitle>Access Rules</FormSectionTitle>

      <FormSection>
        <div className="flex flex-col gap-[24px]">
          {/* Access Type Selection */}
          <div className="flex flex-row gap-[20px]">
            {accessItems.map((item) => (
              <div
                key={item.id}
                className={`flex-1 flex-col ${accessRule === item.id ? 'border-white/10 bg-white/10' : 'border-white/10 bg-white/[0.05] opacity-60'} cursor-pointer rounded-[10px] border p-[10px]`}
                onClick={() => setValue('accessRule', item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    {item.icon}
                    <div className="text-[16px] font-semibold">{item.name}</div>
                  </div>
                  {accessRule === item.id && <Check size={20} />}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[14px] font-normal">
            {accessItems.find((item) => item.id === accessRule)?.description}
          </div>

          <div className="text-[14px] opacity-80">
            Choose who can access this calendar
          </div>

          {/* Access Rules Options (only visible when GatedApp is selected) */}
          {accessRule === RegistrationAccess.GatedApp && (
            <div className="flex flex-col gap-[20px]">
              {/* By Role Section */}
              <div className="flex flex-col">
                <div
                  className="cursor-pointer rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-[14px]"
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === AccessType.ByRole
                        ? null
                        : AccessType.ByRole,
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="text-[16px] font-semibold leading-[1.4em]">
                        By Role
                      </div>
                      <div className="text-[13px] leading-[1.4em] opacity-60">
                        Select spaces roles
                      </div>
                    </div>
                    <CaretRight size={20} className="opacity-60" />
                  </div>
                </div>

                {/* Expanded Role Content */}
                {expandedSection === AccessType.ByRole && (
                  <div className="mt-[20px] flex flex-col gap-[14px]">
                    {/* Member Role */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[5px]">
                        <IdentificationBadge size={24} className="opacity-40" />
                        <span className="text-[16px] font-medium">Member</span>
                      </div>
                      <Switch
                        isSelected={
                          roles?.find((r) => r.id === 'member')?.isEnabled
                        }
                        onValueChange={(isSelected) => {
                          const updatedRoles = [...(roles || [])];
                          const index = updatedRoles.findIndex(
                            (r) => r.id === 'member',
                          );
                          if (index !== -1) {
                            updatedRoles[index] = {
                              ...updatedRoles[index],
                              isEnabled: isSelected,
                            };
                            setValue('roles', updatedRoles, {
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </div>

                    {/* CustomRole1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[24px] rounded-full bg-[#333333]" />
                        <span className="text-[16px] font-medium">
                          CustomRole1
                        </span>
                      </div>
                      <Switch
                        isSelected={
                          roles?.find((r) => r.id === 'customRole1')?.isEnabled
                        }
                        onValueChange={(isSelected) => {
                          const updatedRoles = [...(roles || [])];
                          const index = updatedRoles.findIndex(
                            (r) => r.id === 'customRole1',
                          );
                          if (index !== -1) {
                            updatedRoles[index] = {
                              ...updatedRoles[index],
                              isEnabled: isSelected,
                            };
                            setValue('roles', updatedRoles, {
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </div>

                    {/* CustomRole2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[10px]">
                        <div className="size-[24px] rounded-full bg-[#333333]" />
                        <span className="text-[16px] font-medium">
                          CustomRole2
                        </span>
                      </div>
                      <Switch
                        isSelected={
                          roles?.find((r) => r.id === 'customRole2')?.isEnabled
                        }
                        onValueChange={(isSelected) => {
                          const updatedRoles = [...(roles || [])];
                          const index = updatedRoles.findIndex(
                            (r) => r.id === 'customRole2',
                          );
                          if (index !== -1) {
                            updatedRoles[index] = {
                              ...updatedRoles[index],
                              isEnabled: isSelected,
                            };
                            setValue('roles', updatedRoles, {
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* By Credential Section */}
              <div
                className="cursor-pointer rounded-[10px] border border-white/[0.06] bg-white/[0.02] p-[14px]"
                onClick={() =>
                  setExpandedSection(
                    expandedSection === AccessType.ByCredential
                      ? null
                      : AccessType.ByCredential,
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-[16px] font-semibold leading-[1.4em]">
                      By Credential
                    </div>
                    <div className="text-[13px] leading-[1.4em] opacity-60">
                      Add Credentials
                    </div>
                  </div>
                  <CaretRight size={20} className="opacity-60" />
                </div>
              </div>

              {/* Expanded Credential Content */}
              {expandedSection === AccessType.ByCredential && (
                <div className="mt-[20px] flex flex-col gap-[20px]">
                  {/* Credential Selection */}
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex flex-row items-center gap-[10px] p-[14px]">
                      <div className="h-[40px] flex-1 rounded-[8px] bg-[#404040]">
                        <div className="flex h-full items-center justify-between px-[10px]">
                          <span className="text-[14px] font-medium">
                            Become Member
                          </span>
                          <CaretLeft size={16} className="opacity-30" />
                        </div>
                      </div>
                      <span className="text-[16px] opacity-60">with</span>
                      <div className="h-[40px] flex-1 rounded-[8px] bg-[#363636]">
                        <div className="flex h-full items-center justify-between px-[10px]">
                          <span className="text-[14px] font-medium">POAPs</span>
                          <CaretLeft size={16} />
                        </div>
                      </div>
                    </div>

                    {/* Search POAPs */}
                    <div className="flex flex-col gap-[20px] p-[20px]">
                      <POAPAutocomplete
                        initialValue={poaps?.map((poap) => poap.id)}
                        onChange={(poapIds) => {
                          // When POAPAutocomplete changes, update the form's poaps value
                          // The component returns an array of POAP IDs, but we need to maintain the full POAP objects
                          // We'll keep existing POAPs that are still in the selection and add any new ones
                          const currentPoaps = poaps || [];
                          const updatedPoaps = currentPoaps.filter((poap) =>
                            poapIds.includes(poap.id),
                          );

                          // If there are new IDs that aren't in our current list, we need to add them
                          // This would require fetching the POAP details, but for now we'll just use what we have
                          setValue('poaps', updatedPoaps, {
                            shouldDirty: true,
                          });
                        }}
                      />

                      {/* "OR" text after the selected POAPs */}
                      <div className="flex flex-row flex-wrap items-center gap-[10px]">
                        <span className="text-[14px] uppercase opacity-50">
                          OR
                        </span>
                      </div>
                    </div>

                    {/* Create POAP Link */}
                    <div className="flex flex-row items-center justify-between border-t border-white/[0.1] p-[10px]">
                      <a
                        href="https://poap.xyz/create"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex cursor-pointer items-center gap-[5px] hover:opacity-80"
                      >
                        <span className="text-[12px]">Create a POAP</span>
                        <ArrowUpRight size={16} />
                      </a>
                      <Button
                        color="functional"
                        className="h-[30px] rounded-[10px] border border-[rgba(103,219,255,0.2)] bg-[rgba(103,219,255,0.1)] px-[14px] py-[8px]"
                        onClick={() => {
                          // Create a new rule with the selected POAPs
                          if (poaps && poaps.length > 0) {
                            // Here you would typically create a rule with the selected POAPs
                            // For now, we'll just show a console log
                            console.log('Creating rule with POAPs:', poaps);
                          }
                        }}
                        isDisabled={!poaps || poaps.length === 0}
                      >
                        <span className="text-[14px] font-medium text-white">
                          Create Rule
                        </span>
                      </Button>
                    </div>

                    {/* Create a Rule Button */}
                    <div className="mx-[20px] flex h-[40px] cursor-pointer items-center justify-center gap-[10px] rounded-[8px] bg-[#2A2A2A]">
                      <span className="text-[14px] font-medium">
                        Create a Rule
                      </span>
                      <Plus size={16} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </FormSection>

      {/* Form Footer */}
      <FormFooter>
        <Button
          color="functional"
          radius="md"
          size="md"
          onClick={onCancel}
          isDisabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          color="submit"
          radius="md"
          size="md"
          type="submit"
          isDisabled={isSubmitting || !isDirty || !isValid}
          isLoading={isSubmitting}
        >
          {initialData ? 'Update Calendar' : 'Create Calendar'}
        </Button>
      </FormFooter>
    </form>
  );
};

export default CalendarDrawer;
