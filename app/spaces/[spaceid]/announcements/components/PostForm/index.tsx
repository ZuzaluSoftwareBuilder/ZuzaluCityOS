'use client';

import {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import SelectCategories from '@/components/select/selectCategories';
import SuperEditor from '@/components/editor/SuperEditor';
import { yupResolver } from '@hookform/resolvers/yup';
import Yup from '@/utils/yupExtensions';
import { POST_TAGS } from '@/constant';
import { useEditorStore } from '@/components/editor/useEditorStore';
import { ZuInput } from '@/components/core';
import { FormHelperText } from '@mui/material';

export interface PostFormResult {
  title: string;
  tags: string[];
  description: string;
}

export interface PostFormHandle {
  submit: () => Promise<PostFormResult | undefined>;
  reset: () => void;
}

interface PostFormProps {
  initialData?: PostFormResult;
}

const schema = Yup.object().shape({
  title: Yup.string().required('Post title is required'),
  tags: Yup.array(Yup.string().required('Tag is required')).min(
    1,
    'At least one tag is required',
  ),
  description: Yup.string(),
});

type FormData = Yup.InferType<typeof schema>;

const PostForm = forwardRef<PostFormHandle, PostFormProps>((props, ref) => {
  const { initialData } = props;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || '',
      tags: initialData?.tags || [],
    },
  });

  const descriptionEditorStore = useEditorStore();
  const initialTags = useMemo(() => {
    if (!initialData) return [];
    return POST_TAGS.filter((item) => initialData?.tags.includes(item.value));
  }, [initialData]);

  const resetForm = useCallback(() => {
    reset({
      title: initialData?.title || '',
      tags: initialData?.tags || [],
    });
    descriptionEditorStore.setValue(initialData?.description || '');
  }, [reset, initialData, descriptionEditorStore]);

  const submitForm = useCallback(
    async (data: FormData): Promise<PostFormResult | undefined> => {
      const description = descriptionEditorStore.value;
      console.log(description);
      if (
        !description ||
        !description.blocks ||
        description.blocks.length === 0
      ) {
        setError('description', {
          message: 'Description is required',
        });
        return undefined;
      }
      return {
        title: data.title,
        tags: data.tags || [],
        description: descriptionEditorStore.getValueString(),
      };
    },
    [descriptionEditorStore.value, setError],
  );

  const onFormError = useCallback(() => {
    window.alert('Please input all necessary fields.');
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      submit: () =>
        new Promise((resolve) => {
          handleSubmit(async (data) => {
            const result = await submitForm(data);
            resolve(result);
          }, onFormError)();
        }),
      reset: resetForm,
    }),
    [handleSubmit, submitForm, resetForm],
  );

  return (
    <div className="flex flex-col gap-5 p-5 bg-[#262626] rounded-lg">
      <FormTitle>Post Details</FormTitle>
      <div className="flex flex-col gap-5">
        <FormLabel>Post Title*</FormLabel>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <ZuInput {...field} placeholder="Type a title" />
          )}
        />
        {errors?.title && (
          <FormHelperText error>{errors?.title.message}</FormHelperText>
        )}

        <div className="flex flex-col gap-2.5">
          <FormLabel>Post Tags</FormLabel>
          <FormLabelDesc>
            Search or create categories related to your post
          </FormLabelDesc>
        </div>

        <Controller
          control={control}
          name="tags"
          render={() => (
            <SelectCategories
              onChange={(value) => {
                setValue('tags', value);
              }}
              initialValues={initialTags}
              options={POST_TAGS}
            />
          )}
        />

        {errors?.tags && (
          <FormHelperText error>{errors?.tags.message}</FormHelperText>
        )}

        <div className="flex flex-col gap-2.5">
          <FormLabel>Post Content*</FormLabel>
          <FormLabelDesc>Write your post here</FormLabelDesc>
        </div>

        <SuperEditor
          placeholder="Type post content"
          value={descriptionEditorStore.value}
          onChange={(val) => {
            descriptionEditorStore.setValue(val);
            if (!val || !val.blocks || val.blocks.length == 0) {
              setError('description', {
                message: 'Description is required',
              });
            }
          }}
        />
        {errors?.description && (
          <FormHelperText error>{errors?.description.message}</FormHelperText>
        )}
      </div>
    </div>
  );
});

PostForm.displayName = 'PostForm';

export default PostForm;
