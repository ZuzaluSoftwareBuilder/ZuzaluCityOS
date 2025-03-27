import {
  Box,
  FormHelperText,
  MenuItem,
  OutlinedInput,
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
import { Dapp, FilmOptionType } from '@/types';
import SelectCategories from '../select/selectCategories';

import dynamic from 'next/dynamic';
import FormUploader from './FormUploader';
import SelectCheckItem from '../select/selectCheckItem';
import { createDapp, updateDapp } from '@/services/dapp.ts';
import { Button, Select, SelectItem } from '../base';
import { Check } from '@phosphor-icons/react';
import { isAddress } from 'viem';
const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

interface DappFormProps {
  handleClose: () => void;
  initialData?: Dapp;
  refetch?: () => void;
}

const schema = Yup.object().shape({
  appName: Yup.string().required('App name is required'),
  developerName: Yup.string().required('Developer name is required'),
  description: Yup.string(),
  tagline: Yup.string()
    .required('Tagline is required')
    .max(70, 'Maximum 70 characters are allowed'),
  categories: Yup.array(Yup.string().required('Category is required'))
    .min(1, 'At least one category is required')
    .max(5, 'Maximum 5 categories are allowed'),
  appLogoUrl: Yup.string().required('App logo is required'),
  bannerUrl: Yup.string().required('App banner is required'),
  developmentStatus: Yup.string().required('Development status is required'),
  openSource: Yup.boolean(),
  repositoryUrl: Yup.string().when('openSource', (v, schema) => {
    const openSource = v?.[0];
    if (!openSource) return schema;
    return schema.url().required('Repository URL is required');
  }),
  isSCApp: Yup.boolean(),
  scAddresses: Yup.string().test(
    'scAddresses',
    'Enter valid contract addresses',
    (v) => {
      if (!v) return true;
      const a = v?.split(',');
      return a?.map((item) => isAddress(item)).every(Boolean);
    },
  ),
  isInstallable: Yup.boolean(),
  websiteUrl: Yup.string().url(),
  docsUrl: Yup.string().url(),
  auditLogUrl: Yup.string().url(),
  appUrl: Yup.string()
    .url()
    .when('isInstallable', (v, schema) => {
      const isInstallable = v?.[0];
      if (!isInstallable) return schema;
      return schema.required('App URL is required');
    }),
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
  const { profile, composeClient } = useCeramicContext();
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
      tagline: initialData?.tagline || '',
      categories: initialData?.categories?.split(',') || [],
      appLogoUrl: initialData?.appLogoUrl || '',
      bannerUrl: initialData?.bannerUrl || '',
      developmentStatus: initialData?.devStatus || '',
      openSource: Number(initialData?.openSource) === 1 || false,
      repositoryUrl: initialData?.repositoryUrl || '',
      isSCApp: Number(initialData?.isSCApp) === 1 || false,
      scAddresses:
        initialData?.scAddresses?.map((item) => item.address).join(',') || '',
      isInstallable: Number(initialData?.isInstallable) === 1 || false,
      websiteUrl: initialData?.websiteUrl || '',
      docsUrl: initialData?.docsUrl || '',
      appUrl: initialData?.appUrl || '',
      auditLogUrl: initialData?.auditLogUrl || '',
    },
  });

  const openSource = watch('openSource');
  const isSCApp = watch('isSCApp');
  const tagline = watch('tagline');
  const isInstallable = watch('isInstallable');

  const resetForm = useCallback(() => {
    reset();
    descriptionEditorStore.clear();
  }, [descriptionEditorStore, reset]);

  const submitMutation = useMutation({
    mutationFn: ({ type, data }: { type: 'create' | 'edit'; data: any }) => {
      if (type === 'create') {
        return createDapp({ ...data, profileId });
      } else {
        return updateDapp({ ...data, id: initialData?.id });
      }
    },
    onSuccess: () => {
      resetForm();
      refetch?.();
      handleClose();
      queryClient.invalidateQueries({ queryKey: ['GET_DAPP_LIST_QUERY'] });
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
      if (!initialData) {
        await submitMutation.mutateAsync({
          type: 'create',
          data: {
            ...data,
            description,
          },
        });
      } else {
        await submitMutation.mutateAsync({
          type: 'edit',
          data: { ...data, description, id: initialData.id },
        });
      }
    },
    [descriptionEditorStore, setError, submitMutation, initialData],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  const initialTags = useMemo(() => {
    if (!initialData) return [];
    const selectedCategories = initialData?.categories?.split(',') || [];
    return selectedCategories.map((item) => ({
      label: item,
      value: item,
    }));
  }, [initialData]);

  const categoriesOptions = useMemo(() => {
    if (!initialData) return DAPP_TAGS;
    const selectedCategories = initialData?.categories?.split(',') || [];
    const tags: FilmOptionType[] = [];
    selectedCategories.forEach((item) => {
      if (!DAPP_TAGS.find((tag) => tag.value === item)) {
        tags.push({
          label: item,
          value: item,
        });
      }
    });
    return [...DAPP_TAGS, ...tags];
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
        padding="20px"
        pb="0"
        flex={1}
      >
        <Stack direction="column" gap="10px">
          <FormTitle>App Profile</FormTitle>
          <FormLabelDesc>Basic information about your app</FormLabelDesc>
        </Stack>
        <Stack
          direction={'column'}
          spacing="20px"
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
                    options={categoriesOptions}
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
          <Stack spacing="10px">
            <FormLabel>App Logo*</FormLabel>
            <FormLabelDesc>
              Recommend min of 200x200px (1:1 Ratio). Supported Formats: JPG,
              PNG, GIF
            </FormLabelDesc>
            <Controller
              name="appLogoUrl"
              control={control}
              render={({ field }) => (
                <FormUploader
                  previewStyle={{
                    width: '140px',
                    height: '140px',
                  }}
                  {...field}
                />
              )}
            />
            {errors?.appLogoUrl && (
              <FormHelperText error>
                {errors?.appLogoUrl.message}
              </FormHelperText>
            )}
          </Stack>
          <Stack spacing="10px">
            <FormLabel>App Banner Image*</FormLabel>
            <FormLabelDesc>
              Recommend 620 x 280px. Supported Formats: JPG, PNG, GIF
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
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding="20px"
        pb="0"
        flex={1}
      >
        <Stack direction="column" gap="10px">
          <FormTitle>Technical Details</FormTitle>
          <FormLabelDesc>Technical information about your app</FormLabelDesc>
        </Stack>
        <Stack
          direction={'column'}
          spacing="20px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
          <Stack spacing="10px">
            <FormLabel>Development Status*</FormLabel>
            <Controller
              control={control}
              name="developmentStatus"
              render={({ field }) => {
                return (
                  <Select
                    selectedKeys={[field.value]}
                    onSelectionChange={(value) => {
                      console.log(value.currentKey);
                      setValue('developmentStatus', value.currentKey!);
                    }}
                    {...field}
                  >
                    {developmentStatusOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select>
                );
              }}
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
                  Dapp Smart Contracts
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    lineHeight: 1.2,
                    opacity: 0.8,
                  }}
                >
                  Does this app utilize smart contracts?
                </Typography>
              </Stack>
              <Controller
                control={control}
                name="isSCApp"
                render={({ field }) => (
                  <ZuSwitch checked={field.value} {...field} />
                )}
              />
            </Stack>
            {isSCApp && (
              <Stack gap="20px">
                <div className="flex flex-col gap-2">
                  <p className="text-[16px] font-[500] leading-[1.2]">
                    Add smart contract addresses
                  </p>
                  <p className="text-[13px] leading-[1.4] opacity-60">
                    You can add multiple address by using a “,” comma after each
                    address
                  </p>
                </div>
                <Controller
                  control={control}
                  name="scAddresses"
                  render={({ field }) => (
                    <ZuInput multiline rows={3} {...field} placeholder="0x" />
                  )}
                />
                {errors?.scAddresses && (
                  <FormHelperText error>
                    {errors?.scAddresses.message}
                  </FormHelperText>
                )}
              </Stack>
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
                  Installable App?
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    lineHeight: 1.2,
                    opacity: 0.8,
                  }}
                >
                  Is this app installable for community spaces?
                </Typography>
              </Stack>
              <Controller
                control={control}
                name="isInstallable"
                render={({ field }) => (
                  <ZuSwitch checked={field.value} {...field} />
                )}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
        padding="20px"
        pb="0"
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
          spacing="20px"
          bgcolor="#262626"
          padding="20px"
          borderRadius="10px"
        >
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
          <Stack spacing="10px">
            <FormLabel>Audit Reports</FormLabel>
            <FormLabelDesc>Enter the URL for the audit reports</FormLabelDesc>
            <Controller
              control={control}
              name="auditLogUrl"
              render={({ field }) => (
                <ZuInput {...field} placeholder="https://" />
              )}
            />
            {errors?.auditLogUrl && (
              <FormHelperText error>
                {errors?.auditLogUrl.message}
              </FormHelperText>
            )}
          </Stack>
        </Stack>
      </Box>
      {isInstallable && (
        <Box
          display="flex"
          flexDirection="column"
          gap="20px"
          padding="20px"
          pb="0"
          flex={1}
        >
          <Stack direction="column" gap="10px">
            <FormTitle>List App For Community Spaces</FormTitle>
            <FormLabelDesc>
              Include a URL to your app for spaces to install
            </FormLabelDesc>
          </Stack>
          <Stack
            direction={'column'}
            spacing="20px"
            bgcolor="#262626"
            padding="20px"
            borderRadius="10px"
          >
            <p className="text-[14px] leading-[1.6] opacity-60">
              Note: v0.1.0 only include iframe-based apps
            </p>
            <div className="flex flex-col gap-2">
              <FormLabel>Integration Type</FormLabel>
              <FormLabelDesc>
                Select the installation type for spaces
              </FormLabelDesc>
              <div className="flex gap-2">
                <Button
                  size="md"
                  className="rounded-[6px] p-[4px_8px] gap-[5px] border border-white/10 h-[30px]"
                  endContent={<Check size={16} weight="thin" />}
                >
                  iFrame App
                </Button>
                <Button
                  size="md"
                  isDisabled
                  className="rounded-[6px] p-[4px_8px] gap-[5px] border border-white/10 h-[30px]"
                >
                  More Coming Soon
                </Button>
              </div>
            </div>
            <Stack spacing="10px">
              <FormLabel>App URL*</FormLabel>
              <FormLabelDesc>Link for users to use this app</FormLabelDesc>
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
          </Stack>
        </Box>
      )}
      <Box padding={3}>
        <FormFooter
          confirmText={initialData ? 'Update App' : 'Confirm App'}
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
