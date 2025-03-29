'use client';

import { memo, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InformationIcon,
  PlusCircleIcon,
  PlusIcon,
} from '@/components/icons';
import { Button, Card } from '@/components/base';
import {
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
} from '@heroui/react';
import dayjs from 'dayjs';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

import CreateOrEditorPostDrawer, {
  useCreateOrEditorPostDrawer,
} from '../CreateOrEditorPostDrawer';
import { Announcement } from '@/types';
import EditorPreview from '@/components/editor/EditorPreview';

import { PostListDataProvider, usePostListData } from './PostListDataContext';
import { useSpacePermissions } from '../../../components/permission';

const PostList = () => {
  const { startCreate } = useCreateOrEditorPostDrawer();
  const { posts, loading } = usePostListData();

  const { isAdmin, isOwner } = useSpacePermissions();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <span className="font-bold leading-[140%] text-[20px]">Posts</span>
          <InformationIcon size={5} />
        </div>
        {(isOwner || isAdmin) && (
          <Button
            color="secondary"
            size="sm"
            startContent={<PlusIcon size={4} />}
            onClick={startCreate}
          >
            Add a Post
          </Button>
        )}
      </div>
      <div className="text-[14px] leading-[120%] opacity-80">
        Announcement posts live in the space view under a menu of the same name.
      </div>
      {loading ? (
        <PostList.SkeletonList />
      ) : (
        <>
          {posts.length === 0 && <PostList.Empty />}
          {posts.map((post) => (
            <PostList.Post key={post.node.id} post={post.node} />
          ))}
        </>
      )}
    </div>
  );
};

PostList.Empty = memo(function Empty() {
  const { startCreate } = useCreateOrEditorPostDrawer();
  const { isAdmin, isOwner } = useSpacePermissions();
  return (
    <div
      onClick={() => {
        if (isAdmin || isOwner) {
          startCreate();
        }
      }}
      className="flex flex-col items-center bg-[#2d2d2d] rounded-[8px] p-5 cursor-pointer"
    >
      {isAdmin && <PlusCircleIcon size={15} color="#6c6c6c" />}
      <span className="text-normal font-bold leading-[180%] tracking-[0.01em]">
        No Posts
      </span>
      {isAdmin && (
        <span className="text-[14px] leading-[140%] tracking-[0.01em] opacity-50">
          Add a Post
        </span>
      )}
    </div>
  );
});

PostList.Post = memo(function Post({ post }: { post: Announcement }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);
  const { startEdit } = useCreateOrEditorPostDrawer();
  const { onDelete } = usePostListData();

  return (
    <Card className="p-2.5">
      <div className="flex gap-2.5">
        <div className="size-10 rounded-full overflow-hidden ml-6 shrink-0">
          <Image
            src={post.author.zucityProfile?.avatar}
            alt="avatar"
            className="rounded-full"
            width={40}
            height={40}
          />
        </div>
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          {/* author */}
          <div className="truncate">
            <span className="text-[14px] leading-[160%] font-bold opacity-60">
              {post.author.zucityProfile?.username || 'Anonymous'}
            </span>
          </div>
          {/* title */}
          <div className="truncate">
            <span className="text-[16px] leading-[120%] font-bold tracking-[0.02em]">
              {post.title}
            </span>
          </div>
          {/* description */}
          <EditorPreview
            value={post.description}
            fontSize={13}
            collapsed={isCollapsed}
            onCollapse={(collapsed) => {
              setIsCanCollapse((v) => {
                return v || collapsed;
              });
              setIsCollapsed(collapsed);
            }}
            style={{ opacity: 0.8 }}
          />
          {isCanCollapse && (
            <Button
              size="sm"
              color="secondary"
              startContent={
                isCollapsed ? (
                  <ChevronDownIcon size={4} />
                ) : (
                  <ChevronUpIcon size={4} />
                )
              }
              className="w-full mt-0"
              onClick={() => setIsCollapsed((prev) => !prev)}
            >
              {isCollapsed ? 'Show More' : 'Show Less'}
            </Button>
          )}
          <div className="text-[10px] leading-[120%] font-normal opacity-50">
            {dayjs(post.createdAt).format('YYYY-MM-DD')} CREATED |{' '}
            {post.tags.map((tag) => `# ${tag.tag}`).join(' ')}
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly aria-label="More Options" className="px-0">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Post Actions">
            <DropdownItem key="edit" onClick={() => startEdit(post)}>
              Edit
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-red-500"
              onClick={() => onDelete(post.id)}
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>
  );
});

PostList.SkeletonList = memo(function SkeletonList() {
  return Array.from({ length: 3 }).map((_, index) => (
    <Skeleton className="rounded-[10px] w-full h-[130px]" key={index} />
  ));
});

export default function PostListWithDrawer() {
  return (
    <PostListDataProvider>
      <CreateOrEditorPostDrawer>
        <PostList />
      </CreateOrEditorPostDrawer>
    </PostListDataProvider>
  );
}
