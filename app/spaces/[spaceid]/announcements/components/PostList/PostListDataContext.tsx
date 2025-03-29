import Dialog from '@/app/spaces/components/Modal/Dialog';
import {
  getSpaceAnnouncements,
  removeSpaceAnnouncement,
} from '@/services/space/announcement';
import { Announcement } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

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
      <Dialog
        showModal={deleteDialogOpen}
        title="Deleting Post"
        message="Are you sure you want to delete this post?"
        confirmText="Delete"
        onClose={() => setDeleteDialogOpen(false)}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </PostListDataContext.Provider>
  );
};
