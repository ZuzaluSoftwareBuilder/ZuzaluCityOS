import { Button } from '@heroui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { createContext, useCallback, useContext, useState } from 'react';

import { Announcement } from '@/types';

import {
  CommonModalHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/base/modal';
import {
  ENABLE_ANNOUNCEMENT_INDEXING_MUTATION,
  GET_SPACE_ANNOUNCEMENTS_QUERY,
} from '@/services/graphql/announcements';
import { executeQuery } from '@/utils/ceramic';
import { get } from 'lodash';

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
    data: posts = [],
    refetch,
    isLoading,
  } = useQuery({
    enabled: !!spaceId,
    queryKey: ['getAnnouncements', spaceId],
    queryFn: () =>
      executeQuery(GET_SPACE_ANNOUNCEMENTS_QUERY, {
        id: spaceId as string,
      }),
    select: (data) => {
      return (
        get(data, 'data.node.announcements.edges', []) as {
          node: Announcement;
        }[]
      ).sort((a, b) => {
        return (
          new Date(b.node.createdAt).getTime() -
          new Date(a.node.createdAt).getTime()
        );
      });
    },
  });

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [holdToDeletePostId, setHoldToDeletePostId] = useState<string | null>(
    null,
  );
  const { mutate: removeAnnouncement, isPending: isDeleting } = useMutation({
    mutationFn: (announcementId: string) =>
      executeQuery(ENABLE_ANNOUNCEMENT_INDEXING_MUTATION, {
        input: {
          id: announcementId,
          shouldIndex: false,
        },
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
