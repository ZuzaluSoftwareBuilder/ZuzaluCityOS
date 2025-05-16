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
  CaretDown,
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
}

// Define ItemType interface for access items
export interface ItemType {
  id: string;
  name?: string;
  expandedContent?: React.ReactNode;
  icon?: React.ReactNode;
}

// POAP type is now imported from './rule'

// Define the form data type based on CreateCalendarInput
export type CalendarFormData = {
  // Required fields from CreateCalendarInput
  name: string;
  categories: string[]; // Maps to category in CreateCalendarInput

  // Form control fields
  gated: boolean; // Controls if the calendar is gated (true) or open (false)
  accessType?: AccessType; // Controls which access method is used (ByRole/ByCredential)

  // Role and credential selection
  roles?: string[]; // Used to generate roleIds for CreateCalendarInput (array of role IDs)
  poaps?: POAP[]; // Used for credential-based access

  // Optional fields from Calendar model
  id?: string;
  spaceId?: string; // Maps to space_id
  createdAt?: string; // Maps to created_at
};

// Define the form schema based on CreateCalendarInput type
export const schema = Yup.object({
  // Required fields from CreateCalendarInput
  name: Yup.string().required('Calendar name is required'),
  categories: Yup.array()
    .of(Yup.string())
    .required('At least one category is required')
    .min(1, 'At least one category is required'),

  // Form control fields
  gated: Yup.boolean().required('Access rule is required'),
  accessType: Yup.string(),

  // Role selection fields
  roles: Yup.array()
    .of(Yup.string())
    .when(['gated', 'accessType'], {
      is: (gated: boolean, accessType: string) =>
        gated && accessType === AccessType.ByRole,
      then: (schema) => schema.min(1, 'At least one role must be selected'),
      otherwise: (schema) => schema,
    }),

  // POAP selection fields
  poaps: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().required(),
        name: Yup.string().required(),
        image_url: Yup.string(),
      }),
    )
    .when(['gated', 'accessType'], {
      is: (gated: boolean, accessType: string) =>
        gated && accessType === AccessType.ByCredential,
      then: (schema) =>
        schema.min(1, 'At least one credential must be selected'),
      otherwise: (schema) => schema,
    }),
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
    const filteredRoleIds = spaceRoles.data
      .filter(
        (role) => role.role.level !== 'owner' && role.role.level !== 'follower',
      )
      .map((role) => role.role.id);

    // Always include the member role as the first item
    return ['member', ...filteredRoleIds];
  }, [spaceRoles]);

  // Map of role IDs to role names for display purposes
  const roleNameMap = useMemo(() => {
    const map = new Map<string, string>();
    map.set('member', 'Member');

    if (spaceRoles?.data) {
      spaceRoles.data.forEach((role) => {
        map.set(role.role.id, role.role.name);
      });
    }

    return map;
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
      // Required fields
      name: initialData?.name || '',
      categories: (initialData?.categories?.filter(Boolean) as string[]) || [],

      // Form control fields
      gated: initialData?.gated ?? false, // Default to false (Open App)
      accessType: initialData?.accessType || AccessType.ByRole,

      // Role and credential selection
      roles: initialData?.roles || formattedRoles,
      poaps: initialData?.poaps || [],

      // Optional fields
      id: initialData?.id,
      spaceId: initialData?.spaceId,
      createdAt: initialData?.createdAt,
    },
    shouldFocusError: true,
  });

  // Update roles when spaceRoles changes
  useEffect(() => {
    if (formattedRoles.length > 0 && !initialData?.roles) {
      setValue('roles', formattedRoles);
    }
  }, [formattedRoles, setValue, initialData?.roles]);

  const gated = watch('gated');
  const roles = watch('roles');
  const poaps = watch('poaps');

  // State to track selected roles
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  // Update selectedRoles when roles change
  useEffect(() => {
    if (roles) {
      setSelectedRoles(new Set(roles));
    }
  }, [roles]);

  // Handle Member role toggle (select/deselect all)
  const handleMemberRoleToggle = useCallback(
    (isSelected: boolean) => {
      if (isSelected) {
        // Select all roles
        const allRoles = new Set(formattedRoles);
        setValue('roles', Array.from(allRoles), {
          shouldDirty: true,
        });
        setSelectedRoles(allRoles);
      } else {
        // Deselect all roles
        setValue('roles', [], {
          shouldDirty: true,
        });
        setSelectedRoles(new Set());
      }
    },
    [formattedRoles, setValue],
  );

  // Handle regular user role toggle
  const handleUserRoleToggle = useCallback(
    (roleId: string, isSelected: boolean) => {
      const newSelectedRoles = new Set(selectedRoles);

      if (isSelected) {
        newSelectedRoles.add(roleId);
      } else {
        newSelectedRoles.delete(roleId);
        // If any role is unchecked, also uncheck the "member" role
        newSelectedRoles.delete('member');
      }

      // Check if all non-member roles are selected
      const allNonMemberRoles = formattedRoles.filter((id) => id !== 'member');
      const allNonMemberSelected = allNonMemberRoles.every((id) =>
        id === roleId ? isSelected : newSelectedRoles.has(id),
      );

      // If all non-member roles are selected, also select the "member" role
      if (allNonMemberSelected && isSelected) {
        newSelectedRoles.add('member');
      }

      setSelectedRoles(newSelectedRoles);
      setValue('roles', Array.from(newSelectedRoles), {
        shouldDirty: true,
      });
    },
    [selectedRoles, formattedRoles, setValue],
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
      // Determine access type - validation is now handled by Yup schema
      // If no access method is expanded but gated is true, default to role-based access
      if (data.gated && !expandedSection) {
        // Default to role-based access
        setExpandedSection(AccessType.ByRole);
      }

      // Use the current expandedSection value (which might have been updated above)
      const accessType = expandedSection;

      // Build submission data based on CreateCalendarInput type
      const formData: CalendarFormData = {
        // Required fields
        name: data.name,
        categories: data.categories,

        // Form control fields
        gated: data.gated,
        accessType: accessType || data.accessType,

        // Set appropriate data based on access type
        roles:
          accessType === AccessType.ByRole
            ? // Use the selected roles
              data.roles
            : undefined,
        poaps: accessType === AccessType.ByCredential ? data.poaps : undefined,

        // Optional fields
        id: data.id,
        spaceId: data.spaceId,
        createdAt: data.createdAt,
      };

      onSubmit(formData);
    },
    [onSubmit, expandedSection, setExpandedSection],
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
                    (item.id === RegistrationAccess.GatedApp && gated) ||
                    (item.id === RegistrationAccess.OpenApp && !gated)
                      ? 'border-white/20 bg-white/10'
                      : 'border-white/10 bg-white/[0.05] opacity-60'
                  } cursor-pointer rounded-[10px] border p-[10px] transition-all hover:border-white/20`}
                  onClick={() =>
                    setValue('gated', item.id === RegistrationAccess.GatedApp)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      {item.icon}
                      <div className="text-[16px] font-semibold">
                        {item.name}
                      </div>
                    </div>
                    {((item.id === RegistrationAccess.GatedApp && gated) ||
                      (item.id === RegistrationAccess.OpenApp && !gated)) && (
                      <Check size={20} weight="bold" className="text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access Rules Options (only visible when GatedApp is selected) */}
          {gated && (
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
                      {expandedSection === AccessType.ByRole ? (
                        <CaretDown size={20} className="opacity-60" />
                      ) : (
                        <CaretRight size={20} className="opacity-60" />
                      )}
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
                            isSelected={selectedRoles.has('member')}
                            onValueChange={handleMemberRoleToggle}
                            color="success"
                            className="h-[24px] w-[44px]"
                          />
                        </div>

                        {/* Space Roles */}
                        {formattedRoles
                          .filter((roleId) => roleId !== 'member')
                          .map((roleId) => (
                            <div
                              key={roleId}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-[10px]">
                                <div
                                  className="size-[20px] rounded-full"
                                  style={{
                                    backgroundColor: '#404040',
                                  }}
                                />
                                <span className="text-[16px] font-medium leading-[1.2em]">
                                  {roleNameMap.get(roleId) || roleId}
                                </span>
                              </div>
                              <Switch
                                isSelected={selectedRoles.has(roleId)}
                                onValueChange={(isSelected) =>
                                  handleUserRoleToggle(roleId, isSelected)
                                }
                                color="success"
                                className="h-[24px] w-[44px]"
                              />
                            </div>
                          ))}
                        {errors?.roles && (
                          <FormHelperText>
                            {errors.roles.message}
                          </FormHelperText>
                        )}
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
                      {expandedSection === AccessType.ByCredential ? (
                        <CaretDown size={20} className="opacity-60" />
                      ) : (
                        <CaretRight size={20} className="opacity-60" />
                      )}
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
                  {errors?.poaps && (
                    <FormHelperText>{errors.poaps.message}</FormHelperText>
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
