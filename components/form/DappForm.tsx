import {
  Box,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import FormHeader from './FormHeader';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '../typography/formTypography';
import { ZuInput, ZuSwitch } from '../core';
import FormFooter from './FormFooter';
import { useEditorStore } from '../editor/useEditorStore';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { DAPP_TAGS } from '@/constant';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dapp } from '@/types';
import SelectCategories from '../select/selectCategories';

import dynamic from 'next/dynamic';
import FormUploader from './FormUploader';
import SelectCheckItem from '../select/selectCheckItem';
import { createDapp } from '@/services/dapp.ts';
const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

interface DappFormProps {
  handleClose: () => void;
  initialData?: Dapp;
  refetch: () => void;
}

const schema = Yup.object().shape({
  appName: Yup.string().required('App name is required'),
  developerName: Yup.string().required('Developer name is required'),
  description: Yup.string(),
  tagline: Yup.string()
    .required('Tagline is required')
    .max(70, 'Maximum 70 characters are allowed'),
  bannerUrl: Yup.string().required('Banner URL is required'),
  categories: Yup.array(Yup.string().required('Category is required'))
    .min(1, 'At least one category is required')
    .max(5, 'Maximum 5 categories are allowed'),
  developmentStatus: Yup.string().required('Development status is required'),
  openSource: Yup.boolean(),
  repositoryUrl: Yup.string().when('openSource', (v, schema) => {
    const openSource = v?.[0];
    if (!openSource) return schema;
    return schema.url().required('Repository URL is required');
  }),
  appUrl: Yup.string().url(),
  websiteUrl: Yup.string().url(),
  docsUrl: Yup.string().url(),
});

type FormData = Yup.InferType<typeof schema>;

const developmentStatusOptions = [
  { label: 'Live', value: 'Live' },
  { label: 'In Development', value: 'In Development' },
  { label: 'Discontinued', value: 'Discontinued' },
];

const DappForm: React.FC<DappFormProps> = ({
  handleClose,
  initialData,
  refetch,
}) => {
  const descriptionEditorStore = useEditorStore();
  const { profile } = useCeramicContext();
  const queryClient = useQueryClient();
  const profileId = profile?.id || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    values: {
      appName: initialData?.appName || '',
      developerName: initialData?.developerName || '',
      description: initialData?.description || '',
      bannerUrl: initialData?.bannerUrl || '',
      categories: initialData?.categories?.split(',') || [],
      developmentStatus: initialData?.devStatus || '',
      tagline: initialData?.tagline || '',
      openSource: Number(initialData?.openSource) === 1 || false,
      repositoryUrl: initialData?.repositoryUrl || '',
      appUrl: initialData?.appUrl || '',
      websiteUrl: initialData?.websiteUrl || '',
      docsUrl: initialData?.docsUrl || '',
    },
  });

  const openSource = watch('openSource');
  const developmentStatus = watch('developmentStatus');
  const tagline = watch('tagline');

  const resetForm = useCallback(() => {
    reset();
    descriptionEditorStore.clear();
  }, [descriptionEditorStore, reset]);

  const submitMutation = useMutation({
    mutationFn: ({ type, data }: { type: 'create' | 'edit'; data: any }) => {
      return createDapp({ ...data, profileId });
    },
    onSuccess: () => {
      resetForm();
      refetch();
      queryClient.invalidateQueries({ queryKey: ['getDappInfoList'] });
    },
  });

  const handlePost = useCallback(
    async (data: FormData) => {
      if (
        !descriptionEditorStore.value ||
        !descriptionEditorStore.value.blocks ||
        descriptionEditorStore.value.blocks.length == 0
      ) {
        setError('description', {
          message: 'Description is required',
        });
        window.alert('Description is required');
        return;
      }
      const description = descriptionEditorStore.getValueString();
      await submitMutation.mutateAsync({
        type: 'create',
        data: {
          ...data,
          description,
        },
      });
    },
    [descriptionEditorStore, setError, submitMutation],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  const initialTags = useMemo(() => {
    if (!initialData) return [];
    return DAPP_TAGS.filter((item) =>
      initialData?.categories?.includes(item.value),
    );
  }, [initialData]);

  useEffect(() => {
    if (initialData?.description) {
      descriptionEditorStore.setValue(initialData.description);
    }
  }, [initialData]);

  return (
    <Box>
      <FormHeader
        title={initialData ? 'Edit Your App' : 'Submit Your App'}
        handleClose={handleClose}
      />
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        flex={1}
      >
        <Stack direction="column" gap="10px">
          <FormTitle>App Profile</FormTitle>
          <FormLabelDesc>Basic information about your app</FormLabelDesc>
        </Stack>
        <Stack
          direction={'column'}
          spacing="30px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
          <Stack spacing="10px">
            <FormLabel>App Name*</FormLabel>
            <Controller
              control={control}
              name="appName"
              render={({ field }) => (
                <ZuInput {...field} placeholder="Type a name" />
              )}
            />
            {errors?.appName && (
              <FormHelperText error>{errors?.appName.message}</FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>Developer Name*</FormLabel>
            <Controller
              control={control}
              name="developerName"
              render={({ field }) => (
                <ZuInput {...field} placeholder="Type a developer name" />
              )}
            />
            {errors?.developerName && (
              <FormHelperText error>
                {errors?.developerName.message}
              </FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>App Tagline*</FormLabel>
            <Controller
              control={control}
              name="tagline"
              render={({ field }) => (
                <ZuInput {...field} placeholder="Type a tagline" />
              )}
            />
            <Typography
              fontSize={10}
              lineHeight={1.2}
              sx={{ opacity: 0.7, textAlign: 'right' }}
            >
              {Math.max(0, 70 - (tagline?.length || 0))} Characters Left
            </Typography>
            {errors?.tagline && (
              <FormHelperText error>{errors?.tagline.message}</FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <Typography variant="subtitle2" color="white">
              App Description*
            </Typography>
            <FormLabelDesc>Write your app description here</FormLabelDesc>
            <SuperEditor
              placeholder="Type app description"
              value={descriptionEditorStore.value}
              onChange={(val) => {
                descriptionEditorStore.setValue(val);
              }}
            />
            {errors?.description && (
              <FormHelperText error>
                {errors?.description.message}
              </FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>App Banner Image*</FormLabel>
            <FormLabelDesc>
              Recommend 620 x 280. Upload PNG, GIF or JPEG
            </FormLabelDesc>
            <Controller
              name="bannerUrl"
              control={control}
              render={({ field }) => (
                <FormUploader
                  previewStyle={{
                    aspectRatio: '620/280',
                    width: '100%',
                    height: 'auto',
                  }}
                  {...field}
                />
              )}
            />
            {errors?.bannerUrl && (
              <FormHelperText error>{errors?.bannerUrl.message}</FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <Stack spacing="10px">
              <FormLabel>Select App Categories*</FormLabel>
              <FormLabelDesc>
                Select up to 5 category labels that are relevant to your app
              </FormLabelDesc>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <SelectCategories
                    {...field}
                    initialValues={initialTags}
                    onChange={(value) => {
                      setValue('categories', value);
                    }}
                    options={DAPP_TAGS}
                  />
                )}
              />
              {errors?.categories && (
                <FormHelperText error>
                  {errors?.categories.message}
                </FormHelperText>
              )}
            </Box>
          </Stack>
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        flex={1}
      >
        <Stack direction="column" gap="10px">
          <FormTitle>Technical Details</FormTitle>
          <FormLabelDesc>Technical information about your app</FormLabelDesc>
        </Stack>
        <Stack
          direction={'column'}
          spacing="30px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
          <Stack spacing="10px">
            <FormLabel>Development Status*</FormLabel>
            <Controller
              control={control}
              name="developmentStatus"
              render={({ field }) => (
                <Select
                  {...field}
                  size="small"
                  renderValue={(selected) => selected}
                  input={<OutlinedInput label="Name" />}
                >
                  {developmentStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <SelectCheckItem
                        label={option.label}
                        isChecked={developmentStatus === option.value}
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors?.developmentStatus && (
              <FormHelperText error>
                {errors?.developmentStatus.message}
              </FormHelperText>
            )}
          </Stack>
          <Stack
            spacing="20px"
            p="20px"
            borderRadius="10px"
            border="1px solid rgba(255, 255, 255, 0.10)"
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack spacing="10px">
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Open Source
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    lineHeight: 1.2,
                    opacity: 0.8,
                  }}
                >
                  Is this project open source?
                </Typography>
              </Stack>
              <Controller
                control={control}
                name="openSource"
                render={({ field }) => (
                  <ZuSwitch checked={field.value} {...field} />
                )}
              />
            </Stack>
            {openSource && (
              <Stack spacing="10px">
                <FormLabel>Link to Repository</FormLabel>
                <Controller
                  control={control}
                  name="repositoryUrl"
                  render={({ field }) => (
                    <ZuInput {...field} placeholder="https://" />
                  )}
                />
                {errors?.repositoryUrl && (
                  <FormHelperText error>
                    {errors?.repositoryUrl.message}
                  </FormHelperText>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding={3}
        flex={1}
      >
        <Stack direction="column" gap="10px">
          <FormTitle>App Links</FormTitle>
          <FormLabelDesc>
            Links for users to use or learn more about your app
          </FormLabelDesc>
        </Stack>
        <Stack
          direction={'column'}
          spacing="30px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
          <Stack spacing="10px">
            <FormLabel>App Link</FormLabel>
            <FormLabelDesc>Link to hosted app</FormLabelDesc>
            <Controller
              control={control}
              name="appUrl"
              render={({ field }) => (
                <ZuInput {...field} placeholder="https://" />
              )}
            />
            {errors?.appUrl && (
              <FormHelperText error>{errors?.appUrl.message}</FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>Website</FormLabel>
            <FormLabelDesc>App or project website</FormLabelDesc>
            <Controller
              control={control}
              name="websiteUrl"
              render={({ field }) => (
                <ZuInput {...field} placeholder="https://" />
              )}
            />
            {errors?.websiteUrl && (
              <FormHelperText error>
                {errors?.websiteUrl.message}
              </FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>Technical Documentation</FormLabel>
            <FormLabelDesc>
              User or developer docs (can be the same as the repo link)
            </FormLabelDesc>
            <Controller
              control={control}
              name="docsUrl"
              render={({ field }) => (
                <ZuInput {...field} placeholder="https://" />
              )}
            />
            {errors?.docsUrl && (
              <FormHelperText error>{errors?.docsUrl.message}</FormHelperText>
            )}
          </Stack>
        </Stack>
      </Box>
      <Box padding={3}>
        <FormFooter
          confirmText="Confirm App"
          isLoading={submitMutation.isPending}
          disabled={false}
          handleClose={handleClose}
          handleConfirm={handleSubmit(handlePost, onFormError)}
        />
      </Box>
    </Box>
  );
};

export default DappForm;
