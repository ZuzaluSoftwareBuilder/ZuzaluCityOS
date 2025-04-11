'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormHelperText } from '@mui/material';
import { omit } from 'lodash';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Controller, useForm } from 'react-hook-form';

import SelectCategories from '@/components/select/selectCategories';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';

import { Input } from '@/components/base';
import EditorPro from '@/components/editorPro';
import { POST_TAGS } from '@/constant';
import Yup from '@/utils/yupExtensions';

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
  description: Yup.string().notEmptyJson('Description is required'),
});

type FormData = Yup.InferType<typeof schema>;

const PostForm = forwardRef<PostFormHandle, PostFormProps>((props, ref) => {
  const { initialData } = props;
  const formContainerRef = useRef<HTMLDivElement>(null);

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
      description: initialData?.description || '',
    },
  });

  const initialTags = useMemo(() => {
    if (!initialData) return [];
    return POST_TAGS.filter((item) => initialData?.tags.includes(item.value));
  }, [initialData]);

  const resetForm = useCallback(() => {
    reset({
      title: initialData?.title || '',
      tags: initialData?.tags || [],
      description: initialData?.description || '',
    });
  }, [reset, initialData]);

  const onFormError = useCallback(() => {
    if (!formContainerRef.current) return;
    const firstErrorField = Object.keys(omit(errors, 'root'))[0];
    if (firstErrorField) {
      const errorElement = formContainerRef.current.querySelector(
        `[data-field="${firstErrorField}"]`,
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors]);

  const submitForm = useCallback(
    async (data: FormData): Promise<PostFormResult | undefined> => {
      return {
        title: data.title,
        tags: data.tags || [],
        description: data.description || '',
      };
    },
    [],
  );

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
    [handleSubmit, submitForm, resetForm, onFormError],
  );

  return (
    <div
      ref={formContainerRef}
      className="flex flex-col gap-5 rounded-lg bg-[#262626] p-5"
    >
      <FormTitle>Post Details</FormTitle>
      <div className="flex flex-col gap-5">
        <FormLabel>Post Title*</FormLabel>
        <div data-field="title" className="flex flex-col gap-2.5">
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Input {...field} placeholder="Type a title" />
            )}
          />
          {errors?.title && (
            <FormHelperText error>{errors?.title.message}</FormHelperText>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <FormLabel>Post Tags*</FormLabel>
          <FormLabelDesc>
            Search or create categories related to your post
          </FormLabelDesc>
        </div>

        <div data-field="tags" className="flex flex-col gap-2.5">
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
        </div>

        <div className="flex flex-col gap-2.5">
          <FormLabel>Post Content*</FormLabel>
          <FormLabelDesc>Write your post here</FormLabelDesc>
        </div>

        <div data-field="description" className="flex flex-col gap-2.5">
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <EditorPro
                value={value}
                onChange={onChange}
                className={{ base: 'min-h-[190px]' }}
                placeholder="Type post content"
              />
            )}
          />
          {errors?.description && (
            <FormHelperText error>{errors?.description.message}</FormHelperText>
          )}
        </div>
      </div>
    </div>
  );
});

PostForm.displayName = 'PostForm';

export default PostForm;
