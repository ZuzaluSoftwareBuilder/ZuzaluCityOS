import { Select, SelectItem } from '@/components/base/select';
import ZuInput from '@/components/core/Input';
import FormFooter from '@/components/form/FormFooter';
import FormHeader from '@/components/form/FormHeader';
import SelectCategories from '@/components/select/selectCategories';
import { FormTitle } from '@/components/typography/formTypography';
import { useCeramicContext } from '@/context/CeramicContext';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { Space } from '@/types';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormHelperText } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Item } from '../../adminevents/[eventid]/Tabs/Ticket/components/Common';
import {
  ItemType,
  RegistrationAccess,
} from '../../adminevents/[eventid]/Tabs/Ticket/components/types';

interface CalendarConfigFormProps {
  space: Space;
  handleClose: () => void;
  refetch: () => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Calendar name is required'),
  category: Yup.array(Yup.string())
    .required('Calendar category is required')
    .min(1, 'Calendar category is required'),
  accessRule: Yup.string().required('Access rule is required'),
  allowedRoles: Yup.array(Yup.string()).optional(),
});

type FormData = Yup.InferType<typeof schema>;

export default function CalendarConfigForm({
  space,
  handleClose,
  refetch,
}: CalendarConfigFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    shouldFocusError: true,
  });
  const { composeClient } = useCeramicContext();
  const { roles } = useGetSpaceMember(space.id);

  const accessRule = watch('accessRule');
  const currentAllowedRoles = watch('allowedRoles') || [];

  const spaceRoles = useMemo(() => {
    if (!roles?.data) return [];
    return roles.data.filter((role) => role.role.level !== 'owner');
  }, [roles]);

  const configCalendarMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const customAttributes = space.customAttributes || [];
      await composeClient.executeQuery(
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
                ...customAttributes,
                {
                  tbd: JSON.stringify({
                    key: 'calendarConfig',
                    value: {
                      name: data.name,
                      category: data.category
                        .map((item) => item?.trim())
                        .join(','),
                      accessRule: data.accessRule,
                      allowedRoles: data.allowedRoles
                        ? data.allowedRoles.join(',')
                        : '',
                    },
                  }),
                },
              ],
            },
          },
        },
      );
    },
    onSuccess: () => {
      reset();
      handleClose();
      refetch();
    },
  });

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      configCalendarMutation.mutate(data);
    },
    [configCalendarMutation],
  );

  const accessItems = useMemo<ItemType[]>(
    () => [
      {
        id: RegistrationAccess.OpenToAll,
        name: 'Open-to-all',
        description: 'Anybody can read',
      },
      {
        id: RegistrationAccess.Whitelist,
        name: 'Private Whitelist',
        description: 'Only invited addresses can read',
      },
    ],
    [],
  );

  return (
    <div className="relative flex h-screen flex-col">
      <div className="sticky top-0 z-[1200]">
        <FormHeader title="Configure Calendar" handleClose={handleClose} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[20px] p-[20px] pb-[80px]">
          <div className="flex flex-col gap-[20px]">
            <div className="rounded-[10px] bg-[#262626]">
              <div className="flex flex-col gap-[10px] p-[20px] pb-0">
                <FormTitle>Initial Calendar Setup</FormTitle>
                <p className="text-[14px] leading-[1.6] opacity-60">
                  Setup your space calendar
                </p>
              </div>
              <div className="mt-[30px] flex flex-col gap-[20px] px-[20px] pb-[20px]">
                <div className="flex flex-col gap-[10px]">
                  <label className="font-semibold text-white">
                    Calendar Name*
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <ZuInput
                          {...field}
                          placeholder="type a name"
                          error={!!error}
                        />
                        {error && (
                          <p className="text-xs text-error">{error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <label className="font-semibold text-white">
                    Calendar Categories*
                  </label>
                  <p className="text-sm text-white/60">
                    Search or create categories related to your space
                  </p>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <SelectCategories
                          options={[]}
                          {...field}
                          value={(field.value as string[]) || []}
                        />
                        {error && (
                          <p className="text-xs text-error">{error.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <FormTitle>Access Rules</FormTitle>
                  <p className="text-[14px] leading-[1.6] opacity-60">
                    Who can read/write for this calendar
                  </p>
                </div>
                <div className="flex flex-col gap-[10px]">
                  {accessItems.map((item) => (
                    <Item
                      key={item.id}
                      item={item}
                      isSelected={item.id === accessRule}
                      onSelect={() => setValue('accessRule', item.id)}
                      expandedContent={item.expandedContent}
                    />
                  ))}
                  {errors.accessRule && (
                    <p className="text-xs text-error">
                      {errors.accessRule.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-[10px]">
                  <FormTitle>Allowed Roles</FormTitle>
                  <p className="text-[14px] leading-[1.6] opacity-60">
                    Select which space roles can access this calendar
                  </p>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <Controller
                    name="allowedRoles"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <Select
                          selectionMode="multiple"
                          className="w-full"
                          value={field.value as any}
                          selectedKeys={
                            currentAllowedRoles.filter(Boolean) as any
                          }
                          onSelectionChange={(keys) => {
                            // Convert the selected keys to role IDs
                            const selectedKeys = Array.from(keys) as string[];
                            field.onChange(selectedKeys);
                          }}
                        >
                          {spaceRoles.map((roleItem) => (
                            <SelectItem key={roleItem.role.id}>
                              {roleItem.role.name}
                            </SelectItem>
                          ))}
                        </Select>
                        {error && (
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[1200]">
        <div className="bg-[#222] p-[20px]">
          <FormFooter
            confirmText="Confirm"
            disabled={configCalendarMutation.isPending}
            isLoading={configCalendarMutation.isPending}
            handleClose={handleClose}
            handleConfirm={handleSubmit(onFormSubmit)}
          />
        </div>
      </div>
    </div>
  );
}
