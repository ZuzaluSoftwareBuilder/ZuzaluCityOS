'use client';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from '@/components/base';
import FormHeader from '@/components/form/FormHeader';
import { CloseIcon, PlusCircleIcon } from '@/components/icons';
import { FormTitle } from '@/components/typography/formTypography';
import useOpenDraw from '@/hooks/useOpenDraw';
import { Announcement } from '@/models/announcement';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { getAnnouncementRepository } from '@/repositories/announcements';
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '@/repositories/announcements/type';
import { setSpaceLastViewTime } from '../../lastViewTime';
import PostForm, { PostFormHandle, PostFormResult } from '../PostForm';
import { usePostListData } from '../PostList/PostListDataContext';
const repository = getAnnouncementRepository();
const CreateOrEditorPostDrawerContext = createContext({
  startCreate: () => {},
  startEdit: (post: Announcement) => {},
});

export const useCreateOrEditorPostDrawer = () =>
  useContext(CreateOrEditorPostDrawerContext);

const CreateOrEditorPostDrawer = (props: PropsWithChildren) => {
  const { children } = props;
  const spaceId = useParams()?.spaceid;
  const { refetch } = usePostListData();
  const { open, setOpen, handleOpen, handleClose } = useOpenDraw();
  const { profile } = useAbstractAuthContext();
  const profileId = profile?.id || '';
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
      const input: CreateAnnouncementInput = {
        title: data.title,
        description: data.description,
        tags: data.tags,
        spaceId: spaceId as string,
        author: profileId,
      };

      const result = await repository.create(input);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    onSuccess: () => {
      refetch();
      handleClose();
      setSpaceLastViewTime(spaceId as string);
    },
  });
  const { mutate: updateAnnouncement, isPending: isUpdating } = useMutation<
    void,
    Error,
    PostFormResult
  >({
    mutationFn: async (data: PostFormResult) => {
      if (!defaultAnnouncement?.id) return;

      const input: UpdateAnnouncementInput = {
        title: data.title,
        description: data.description,
        tags: data.tags,
      };

      const result = await repository.update(defaultAnnouncement.id, input);

      if (result.error) {
        throw result.error;
      }
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
              <DrawerBody className="flex flex-col gap-5 p-5">
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
