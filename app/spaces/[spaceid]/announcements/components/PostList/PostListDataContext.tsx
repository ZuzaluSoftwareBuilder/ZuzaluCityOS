import { createContext, useCallback, useContext, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Button } from '@heroui/react';

import { Announcement } from '@/types';

import {
  getSpaceAnnouncements,
  removeSpaceAnnouncement,
} from '@/services/space/announcement';

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  CommonModalHeader,
} from '@/components/base/modal';

const PostListDataContext = createContext<{
  loading: boolean;
  posts: { node: Announcement }[];
  onDelete: (announcementId: string) => void;
  refetch: () => void;
}>({
  loading: false,
  posts: [],
  refetch: () => {},
  onDelete: () => {},
});

export const usePostListData = () => useContext(PostListDataContext);

export const PostListDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const spaceId = useParams()?.spaceid;
  const {
    data: posts,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['getAnnouncements', spaceId],
    queryFn: () => getSpaceAnnouncements(spaceId as string),
    select: (data) => {
      if (data.status === 'success' && data.data) {
        return data.data.announcements;
      }
      return [];
    },
  });

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holdToDeletePostId, setHoldToDeletePostId] = useState<string | null>(
    null,
  );
  const { mutate: removeAnnouncement, isPending: isDeleting } = useMutation({
    mutationFn: (announcementId: string) =>
      removeSpaceAnnouncement({
        spaceId: spaceId as string,
        announcementId,
      }),
    onSuccess: () => {
      setDeleteDialogOpen(false);
      refetch();
    },
  });
  const handleDeleteConfirm = useCallback(() => {
    if (holdToDeletePostId) {
      return removeAnnouncement(holdToDeletePostId);
    }
  }, [holdToDeletePostId, removeAnnouncement]);

  return (
    <PostListDataContext.Provider
      value={{
        posts,
        refetch,
        loading: isLoading,
        onDelete: (announcementId: string) => {
          setHoldToDeletePostId(announcementId);
          setDeleteDialogOpen(true);
        },
      }}
    >
      {children}
      <Modal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <ModalContent>
          <CommonModalHeader
            title="Deleting Post"
            onClose={() => setDeleteDialogOpen(false)}
            isDisabled={isDeleting}
          />
          <ModalBody>
            <p className="text-white">
              Are you sure you want to delete this post?
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2 py-4">
            <Button
              variant="flat"
              color="danger"
              onPress={handleDeleteConfirm}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PostListDataContext.Provider>
  );
};
