import {
  Box,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
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
import { POST_TAGS } from '@/constant';
import { createPost, updatePost } from '@/services/announcements';
import { useCeramicContext } from '@/context/CeramicContext';
import { useMutation } from '@tanstack/react-query';
import { Post } from '@/types';
import SelectCategories from '../select/selectCategories';

import dynamic from 'next/dynamic';
import FormUploader from './FormUploader';
import SelectCheckItem from '../select/selectCheckItem';
const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

interface DappFormProps {
  handleClose: () => void;
  initialData?: Post;
  refetch: () => void;
}

const schema = Yup.object().shape({
  appName: Yup.string().required('App name is required'),
  developerName: Yup.string().required('Developer name is required'),
  description: Yup.string(),
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

const DappForm: React.FC<DappFormProps> = ({
  handleClose,
  initialData,
  refetch,
}) => {
  const descriptionEditorStore = useEditorStore();
  const { profile } = useCeramicContext();

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
    defaultValues: {
      categories: [],
    },
  });

  const openSource = watch('openSource');

  const resetForm = useCallback(() => {
    reset();
    descriptionEditorStore.clear();
  }, [descriptionEditorStore, reset]);

  const submitMutation = useMutation({
    mutationFn: ({ type, data }: { type: 'create' | 'edit'; data: any }) => {
      if (type === 'create') {
        return createPost(data);
      } else {
        return updatePost(data.id, data);
      }
    },
    onSuccess: () => {
      resetForm();
      refetch();
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
    },
    [descriptionEditorStore, initialData, setError, submitMutation, profile],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  return (
    <Box>
      <FormHeader title="Submit Your App" handleClose={handleClose} />
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
              <FormLabel>Select App Categories *</FormLabel>
              <FormLabelDesc>
                Search or create categories related to your app
              </FormLabelDesc>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <SelectCategories
                    {...field}
                    onChange={(value) => {
                      setValue('categories', value);
                    }}
                    options={POST_TAGS}
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
            <FormLabel>Development Status</FormLabel>
            <Controller
              control={control}
              name="developmentStatus"
              render={({ field }) => (
                <Select {...field} size="small" placeholder="https://">
                  <MenuItem value="1">
                    <SelectCheckItem label="1" isChecked />
                  </MenuItem>
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
                render={({ field }) => <ZuSwitch {...field} />}
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
          disabled={false}
          handleClose={handleClose}
          handleConfirm={handleSubmit(handlePost, onFormError)}
        />
      </Box>
    </Box>
  );
};

export default DappForm;
