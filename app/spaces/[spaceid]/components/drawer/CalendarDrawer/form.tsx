'use client';

import { Button } from '@/components/base/button';
import {
  FormFooter,
  FormHelperText,
  FormLabel,
  FormLabelDesc,
  FormSection,
  FormSectionTitle,
} from '@/components/base/form';
import { Input } from '@/components/base/input';
import { Switch } from '@/components/base/switch';
import SelectCategories from '@/components/select/selectCategories';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  CaretRight,
  Check,
  DoorOpen,
  IdentificationBadge,
  LockLaminated,
} from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CredentialRule, POAP } from './rule';

// Define RegistrationAccess enum to match Figma design
export enum RegistrationAccess {
  OpenApp = 'Open App',
  GatedApp = 'Gated App',
}

// Define access type enum
export enum AccessType {
  ByRole = 'ByRole',
  ByCredential = 'ByCredential',
}

// Define role type for role selection
export interface RoleType {
  id: string;
  name: string;
  isEnabled: boolean;
  color?: string;
}

// Define ItemType interface for access items
export interface ItemType {
  id: string;
  name?: string;
  expandedContent?: React.ReactNode;
  icon?: React.ReactNode;
}

// POAP type is now imported from './rule'

// Define the form data type
export type CalendarFormData = {
  name: string;
  categories: string[];
  accessRule: string;
  accessType?: AccessType;
  roles?: RoleType[];
  poaps?: POAP[];
};

// Define the form schema
export const schema = Yup.object({
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

export interface CalendarFormProps {
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
  const params = useParams();
  const spaceId = params?.spaceid as string;
  const { roles: spaceRoles } = useGetSpaceMember(spaceId);

  // Format roles from space roles
  const formattedRoles = useMemo(() => {
    if (!spaceRoles?.data) return [];

    // Filter roles that should be displayed (excluding system roles if needed)
    const filteredRoles = spaceRoles.data
      .filter(
        (role) => role.role.level !== 'owner' && role.role.level !== 'follower',
      )
      .map((role) => ({
        id: role.role.id,
        name: role.role.name,
        isEnabled: false,
        color: '#333333', // Default color
      }));

    // Always include the member role as the first item
    return [
      { id: 'member', name: 'Member', isEnabled: false },
      ...filteredRoles,
    ];
  }, [spaceRoles]);

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
      roles: initialData?.roles || formattedRoles,
      poaps: initialData?.poaps || [],
    },
    shouldFocusError: true,
  });

  // Update roles when spaceRoles changes
  useEffect(() => {
    if (formattedRoles.length > 0 && !initialData?.roles) {
      setValue('roles', formattedRoles);
    }
  }, [formattedRoles, setValue, initialData?.roles]);

  const accessRule = watch('accessRule');
  const roles = watch('roles');
  const poaps = watch('poaps');

  // Handle Member role toggle (select/deselect all)
  const handleMemberRoleToggle = useCallback(
    (isSelected: boolean) => {
      const updatedRoles = [...(roles || [])];

      // Update all roles to match the selected state
      updatedRoles.forEach((role, idx) => {
        updatedRoles[idx] = {
          ...role,
          isEnabled: isSelected,
        };
      });

      setValue('roles', updatedRoles, {
        shouldDirty: true,
      });
    },
    [roles, setValue],
  );

  // Handle regular user role toggle
  const handleUserRoleToggle = useCallback(
    (roleId: string, isSelected: boolean) => {
      const updatedRoles = [...(roles || [])];
      const roleIndex = updatedRoles.findIndex((r) => r.id === roleId);

      if (roleIndex !== -1) {
        updatedRoles[roleIndex] = {
          ...updatedRoles[roleIndex],
          isEnabled: isSelected,
        };

        // Update Member role based on other roles' state
        const memberIndex = updatedRoles.findIndex((r) => r.id === 'member');
        if (memberIndex !== -1) {
          // If this role is being unchecked, Member should also be unchecked
          if (!isSelected) {
            updatedRoles[memberIndex] = {
              ...updatedRoles[memberIndex],
              isEnabled: false,
            };
          } else {
            // If this role is being checked, check if all other non-member roles are checked
            const allOtherRolesEnabled = updatedRoles
              .filter((r) => r.id !== 'member')
              .every((r) => (r.id === roleId ? isSelected : r.isEnabled));

            updatedRoles[memberIndex] = {
              ...updatedRoles[memberIndex],
              isEnabled: allOtherRolesEnabled,
            };
          }
        }

        setValue('roles', updatedRoles, {
          shouldDirty: true,
        });
      }
    },
    [roles, setValue],
  );

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
        icon: <DoorOpen size={24} />,
      },
      {
        id: RegistrationAccess.GatedApp,
        name: 'Gated App',
        icon: <LockLaminated size={24} />,
      },
    ],
    [],
  );

  // Handle form submission
  const onFormSubmit = useCallback(
    (data: CalendarFormData) => {
      // Validate data
      if (data.accessRule === RegistrationAccess.GatedApp) {
        // For gated access, ensure at least one access method is selected
        if (expandedSection === AccessType.ByRole) {
          // Check if at least one role is enabled
          const hasEnabledRole = data.roles?.some((role) => role.isEnabled);
          if (!hasEnabledRole) {
            // If no roles are selected, handle the error
            console.error('At least one role must be selected');
            return;
          }
        } else if (expandedSection === AccessType.ByCredential) {
          // Check if at least one POAP is selected
          if (!data.poaps || data.poaps.length === 0) {
            // If no POAPs are selected, handle the error
            console.error('At least one POAP must be selected');
            return;
          }
        } else {
          // If no access method is expanded, default to role-based access
          // We can't modify expandedSection directly as it's a constant
          // We'll set the default value in the formData object below
        }
      }

      // Determine access type
      let accessType = expandedSection;

      // If it's gated access but no access type is selected, default to role-based access
      if (data.accessRule === RegistrationAccess.GatedApp && !accessType) {
        accessType = AccessType.ByRole;
      }

      // Build submission data
      const formData = {
        ...data,
        accessType: accessType || data.accessType,
        // Set appropriate data based on access type
        roles:
          accessType === AccessType.ByRole
            ? // Only keep enabled roles
              data.roles?.filter((role) => role.isEnabled)
            : undefined,
        poaps: accessType === AccessType.ByCredential ? data.poaps : undefined,
      };

      onSubmit(formData);
    },
    [onSubmit, expandedSection],
  );

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Details Section */}
      <FormSectionTitle className="opacity-60">Details</FormSectionTitle>

      <FormSection className="rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px]">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-col gap-[6px]">
              <FormLabel>Calendar Name</FormLabel>
              <FormLabelDesc className="opacity-80">
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
              <FormLabelDesc className="opacity-60">
                Create categories for this Calendar
              </FormLabelDesc>
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
              <FormHelperText>{errors.categories.message}</FormHelperText>
            )}
          </div>
        </div>
      </FormSection>

      {/* Access Rules Section */}
      <FormSectionTitle className="opacity-60">Access Rules</FormSectionTitle>

      <FormSection className="rounded-[10px] border border-white/10 bg-white/[0.02] p-[20px]">
        <div className="flex flex-col">
          {/* Access Type Selection */}
          <div className="flex flex-col">
            <div className="flex flex-row gap-[20px]">
              {accessItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex-1 flex-col ${
                    accessRule === item.id
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/10 bg-white/[0.05] opacity-60'
                  } cursor-pointer rounded-[10px] border p-[10px] transition-all hover:border-white/20`}
                  onClick={() => setValue('accessRule', item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      {item.icon}
                      <div className="text-[16px] font-semibold">
                        {item.name}
                      </div>
                    </div>
                    {accessRule === item.id && (
                      <Check size={20} weight="bold" className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Rules Options (only visible when GatedApp is selected) */}
          {accessRule === RegistrationAccess.GatedApp && (
            <>
              <div className="pt-[10px] text-[14px] font-normal">
                <span>A Gated App</span>requires users to verify a credential or
                hold a specific role to gain access
              </div>
              <div className="flex flex-col gap-[20px] pt-[20px]">
                <div className="rounded-[10px] border border-white/[0.06] bg-white/[0.02]">
                  <div
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === AccessType.ByRole
                          ? null
                          : AccessType.ByRole,
                      )
                    }
                  >
                    <div className="flex items-center justify-between p-[14px]">
                      <div className="flex flex-col gap-[5px]">
                        <div className="text-[16px] font-semibold leading-[1.4em]">
                          By Role
                        </div>
                        <div className="text-[13px] leading-[1.4em] opacity-60">
                          Select spaces roles
                        </div>
                      </div>
                      <CaretRight size={20} className="opacity-60" />
                    </div>
                    {expandedSection === AccessType.ByRole && (
                      <div className="mx-[14px] h-px bg-white/10"></div>
                    )}
                  </div>

                  {/* Expanded Role Content */}
                  {expandedSection === AccessType.ByRole && (
                    <div className="p-[14px]">
                      {/* Role Selection List */}
                      <div className="flex flex-col gap-[14px]">
                        {/* Member Role (Select All) */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[5px]">
                            <IdentificationBadge
                              size={20}
                              className="text-white/40"
                            />
                            <span className="text-[16px] font-medium leading-[1.2em]">
                              Member
                            </span>
                          </div>
                          <Switch
                            isSelected={
                              roles?.find((r) => r.id === 'member')?.isEnabled
                            }
                            onValueChange={handleMemberRoleToggle}
                            color="success"
                            className="h-[24px] w-[44px]"
                          />
                        </div>

                        {/* Space Roles */}
                        {roles
                          ?.filter((role) => role.id !== 'member')
                          .map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-[10px]">
                                <div
                                  className="size-[20px] rounded-full"
                                  style={{
                                    backgroundColor: role.color || '#404040',
                                  }}
                                />
                                <span className="text-[16px] font-medium leading-[1.2em]">
                                  {role.name}
                                </span>
                              </div>
                              <Switch
                                isSelected={role.isEnabled}
                                onValueChange={(isSelected) =>
                                  handleUserRoleToggle(role.id, isSelected)
                                }
                                color="success"
                                className="h-[24px] w-[44px]"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* By Role Section */}
                <div className="cursor-pointer rounded-[10px] border border-white/[0.06] bg-white/[0.02]">
                  {/* By Credential Section */}
                  <div
                    className=""
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === AccessType.ByCredential
                          ? null
                          : AccessType.ByCredential,
                      )
                    }
                  >
                    <div className="flex items-center justify-between p-[14px]">
                      <div className="flex flex-col gap-[5px]">
                        <div className="text-[16px] font-semibold leading-[1.4em]">
                          By Credential
                        </div>
                        <div className="text-[13px] leading-[1.4em] opacity-60">
                          Add Credentials
                        </div>
                      </div>
                      <CaretRight size={20} className="opacity-60" />
                    </div>
                    {expandedSection === AccessType.ByCredential && (
                      <div className="mx-[14px] h-px bg-white/10"></div>
                    )}
                  </div>

                  {/* Expanded Credential Content */}
                  {expandedSection === AccessType.ByCredential && (
                    <CredentialRule
                      poaps={poaps}
                      onChange={(updatedPoaps) => {
                        setValue('poaps', updatedPoaps, { shouldDirty: true });
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </FormSection>

      {/* Form Footer */}
      <FormFooter className="flex flex-row justify-end gap-[10px]">
        <Button
          color="functional"
          radius="md"
          size="md"
          onClick={onCancel}
          isDisabled={isSubmitting}
          className="h-[38px] rounded-[10px] border border-white/10 bg-white/[0.05] px-[14px] py-[8px] text-[14px] font-bold"
        >
          Cancel
        </Button>

        <Button
          color="submit"
          radius="md"
          size="md"
          onClick={handleSubmit(onFormSubmit)}
          isDisabled={isSubmitting || !isDirty || !isValid}
          isLoading={isSubmitting}
          className="h-[38px] rounded-[10px] border border-[rgba(103,219,255,0.2)] bg-[rgba(103,219,255,0.1)] px-[14px] py-[8px] text-[14px] font-bold text-white"
        >
          {initialData ? 'Update Calendar' : 'Create Calendar'}
        </Button>
      </FormFooter>
    </div>
  );
};

export default CalendarForm;
