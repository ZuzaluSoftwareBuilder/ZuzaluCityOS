'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { dayjs } from '@/utils/dayjs';
import { useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from '@/components/base';
import FormHeader from '@/components/form/FormHeader';
import { CloseIcon, PlusCircleIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import { FormTitle } from '@/components/typography/formTypography';
import { Announcement } from '@/types';
import { executeQuery } from '@/utils/ceramic';
import {
  CREATE_ANNOUNCEMENT_MUTATION,
  UPDATE_ANNOUNCEMENT_MUTATION,
} from '@/services/graphql/announcements';

import { usePostListData } from '../PostList/PostListDataContext';
import PostForm, { PostFormHandle, PostFormResult } from '../PostForm';
import { useSpaceData } from '../../../components/context/spaceData';

const CreateOrEditorPostDrawerContext = createContext({
  startCreate: () => {},
  startEdit: (post: Announcement) => {},
});

export const useCreateOrEditorPostDrawer = () =>
  useContext(CreateOrEditorPostDrawerContext);

const CreateOrEditorPostDrawer = (props: PropsWithChildren) => {
  const { children } = props;
  const { refreshSpaceData } = useSpaceData();
  const spaceId = useParams()?.spaceid;
  const { refetch } = usePostListData();
  const { open, setOpen, handleOpen, handleClose } = useOpenDraw();
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const title = useMemo(() => {
    if (mode === 'create') return 'Create Post';
    if (mode === 'edit') return 'Edit Post';
    return '';
  }, [mode]);

  // mode control
  const startEdit = useCallback(
    (post: Announcement) => {
      setMode('edit');
      handleOpen();
      setDefaultAnnouncement(post);
      setTimeout(() => formRef.current?.reset());
    },
    [handleOpen],
  );

  const startCreate = useCallback(() => {
    setMode('create');
    handleOpen();
    setTimeout(() => formRef.current?.reset());
  }, [handleOpen]);

  // form control
  const formRef = useRef<PostFormHandle>(null);

  const [defaultAnnouncement, setDefaultAnnouncement] =
    useState<Announcement | null>(null);
  const formInitialData = useMemo(() => {
    if (mode === 'edit' && defaultAnnouncement) {
      return {
        title: defaultAnnouncement.title,
        tags: defaultAnnouncement.tags.map((tag) => tag.tag),
        description: defaultAnnouncement.description,
      };
    }
    return undefined;
  }, [defaultAnnouncement, mode]);

  const { mutate: createAnnouncement, isPending: isCreating } = useMutation({
    mutationFn: async (data: PostFormResult) => {
      const response = await executeQuery(CREATE_ANNOUNCEMENT_MUTATION, {
        input: {
          content: {
            title: data.title,
            sourceId: spaceId as string,
            spaceId: spaceId as string,
            description: data.description,
            tags: data.tags.map((tag) => ({ tag })),
            createdAt: dayjs().utc().toISOString(),
            updatedAt: dayjs().utc().toISOString(),
          },
        },
      });

      return response.data;
    },
    onSuccess: () => {
      refetch();
      refreshSpaceData();
      handleClose();
    },
  });
  const { mutate: updateAnnouncement, isPending: isUpdating } = useMutation<
    void,
    Error,
    PostFormResult
  >({
    mutationFn: async (data: PostFormResult) => {
      if (!defaultAnnouncement?.id) return;
      await executeQuery(UPDATE_ANNOUNCEMENT_MUTATION, {
        input: {
          id: defaultAnnouncement.id,
          content: {
            title: data.title,
            description: data.description,
            tags: data.tags.map((tag) => ({ tag })),
            updatedAt: dayjs().utc().toISOString(),
          },
        },
      });
    },
    onSuccess: () => {
      refetch();
      handleClose();
    },
  });

  const handleSubmit = useCallback(async () => {
    const result = await formRef.current?.submit();
    if (result) {
      if (mode === 'create') {
        createAnnouncement(result);
      } else {
        updateAnnouncement(result);
      }
    }
  }, [mode, createAnnouncement, updateAnnouncement]);

  const isSubmitting = isCreating || isUpdating;

  return (
    <CreateOrEditorPostDrawerContext.Provider
      value={{
        startCreate,
        startEdit,
      }}
    >
      {children}
      <Drawer
        isOpen={open}
        onOpenChange={setOpen}
        classNames={{
          base: 'w-[700px] max-w-[700px] mobile:w-[100%] mobile:max-w-[100%]',
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <FormHeader title={title} handleClose={onClose} />
              <DrawerBody className="p-5 flex flex-col gap-5">
                <FormTitle>Post Announcement</FormTitle>
                <PostForm ref={formRef} initialData={formInitialData} />
              </DrawerBody>
              <DrawerFooter className="gap-5">
                <Button
                  className="flex-1"
                  startContent={<CloseIcon size={5} />}
                  color="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Discard
                </Button>
                <Button
                  color="submit"
                  className="flex-1"
                  startContent={
                    isSubmitting ? null : (
                      <PlusCircleIcon color="#67DBFF" size={5} />
                    )
                  }
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  {`${mode === 'create' ? 'Create' : 'Update'} Post`}
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </CreateOrEditorPostDrawerContext.Provider>
  );
};

export default CreateOrEditorPostDrawer;
