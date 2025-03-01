import FormHeader from '@/components/form/FormHeader';
import {
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  FormLabel,
  FormHelperText,
  Stack,
  Typography,
  Chip,
} from '@mui/material';
import ZuInput from '@/components/core/Input';
import FormFooter from '@/components/form/FormFooter';
import { useCallback, useMemo } from 'react';
import SelectCategories from '@/components/select/selectCategories';
import { ItemType } from '../../adminevents/[eventid]/Tabs/Ticket/components/types';
import { RegistrationAccess } from '../../adminevents/[eventid]/Tabs/Ticket/components/types';
import { Item } from '../../adminevents/[eventid]/Tabs/Ticket/components/Common';
import { useMutation } from '@tanstack/react-query';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/types';

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

  const accessRule = watch('accessRule');

  const configCalendarMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const customAttributes = space.customAttributes || [];
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
                    },
                  }),
                },
              ],
            },
          },
        },
      );
      console.log(result);
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1200 }}>
        <FormHeader title="Configure Calendar" handleClose={handleClose} />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <Stack gap="20px" p="20px" pb="80px">
          <Box display="flex" flexDirection="column" gap="20px">
            <Box bgcolor="#262626" borderRadius="10px">
              <Stack padding="20px 20px 0" gap="10px">
                <FormTitle>Initial Calendar Setup</FormTitle>
                <Typography
                  fontSize={14}
                  lineHeight={1.6}
                  sx={{ opacity: 0.6 }}
                >
                  Setup your space calendar
                </Typography>
              </Stack>
              <Box
                padding="0 20px 20px"
                mt="30px"
                display="flex"
                flexDirection="column"
                gap="20px"
              >
                <Stack spacing="10px">
                  <FormLabel>Calendar Name*</FormLabel>
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
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Stack>
                <Stack spacing="10px">
                  <FormLabel>Calendar Categories*</FormLabel>
                  <FormLabelDesc>
                    Search or create categories related to your space
                  </FormLabelDesc>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <SelectCategories options={[]} {...field} />
                        {error && (
                          <FormHelperText error>{error.message}</FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Stack>
                <Stack gap="10px">
                  <FormTitle>Access Rules</FormTitle>
                  <Typography
                    fontSize={14}
                    lineHeight={1.6}
                    sx={{ opacity: 0.6 }}
                  >
                    Who can read/write for this calendar
                  </Typography>
                </Stack>
                <Stack spacing="10px">
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
                    <FormHelperText error>
                      {errors.accessRule.message}
                    </FormHelperText>
                  )}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
      >
        <Box p="20px" bgcolor="#222">
          <FormFooter
            confirmText="Confirm"
            disabled={configCalendarMutation.isPending}
            isLoading={configCalendarMutation.isPending}
            handleClose={handleClose}
            handleConfirm={handleSubmit(onFormSubmit)}
          />
        </Box>
      </Box>
    </Box>
  );
}
