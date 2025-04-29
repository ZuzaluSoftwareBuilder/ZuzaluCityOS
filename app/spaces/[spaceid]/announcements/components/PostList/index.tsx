'use client';

import { Button, Card } from '@/components/base';
import { PlusCircleIcon, PlusIcon } from '@/components/icons';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Skeleton,
} from '@heroui/react';
import dayjs from 'dayjs';
import { memo } from 'react';

import EditorProWithMore from '@/app/spaces/[spaceid]/components/home/EditorProWithMore';
import { Announcement } from '@/models/announcement';
import CreateOrEditorPostDrawer, {
  useCreateOrEditorPostDrawer,
} from '../CreateOrEditorPostDrawer';

import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { PermissionName } from '@/types';
import clsx from 'clsx';
import { useSpacePermissions } from '../../../components/permission';
import { PostListDataProvider, usePostListData } from './PostListDataContext';

const PostList = () => {
  const { startCreate } = useCreateOrEditorPostDrawer();
  const { posts, loading } = usePostListData();
  const { checkPermission } = useSpacePermissions();

  const hasManageSpaceAccess = checkPermission(
    PermissionName.MANAGE_ANNOUNCEMENTS,
  );

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[20px] font-bold leading-[140%]">Posts</span>
        </div>
        {hasManageSpaceAccess && (
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
      className={clsx(
        'flex flex-col items-center rounded-[8px] bg-[#2d2d2d] p-5',
        isAdmin || isOwner ? 'cursor-pointer' : '',
      )}
    >
      {(isAdmin || isOwner) && <PlusCircleIcon size={15} color="#6c6c6c" />}
      <span className="font-bold leading-[180%] tracking-[0.01em]">
        No Posts
      </span>
      {(isAdmin || isOwner) && (
        <span className="text-[14px] leading-[140%] tracking-[0.01em] opacity-50">
          Add a Post
        </span>
      )}
    </div>
  );
});

PostList.Post = memo(function Post({ post }: { post: Announcement }) {
  const { startEdit } = useCreateOrEditorPostDrawer();
  const { onDelete } = usePostListData();
  const { profile } = useAbstractAuthContext();
  const userDID = profile?.id;

  return (
    <Card className="border-[rgba(255,255,255,0.06)] bg-[#2d2d2d] p-2.5">
      <div className="flex gap-2.5">
        <div className="size-10 shrink-0 overflow-hidden rounded-full">
          <Image
            src={post.author?.avatar ?? '/user/avatar_p.png'}
            alt="avatar"
            className="rounded-full object-cover"
            width={40}
            height={40}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {/* author */}
          <div className="truncate">
            <span className="text-[14px] font-bold leading-[160%] opacity-60">
              {post.author?.username || 'Anonymous'}
            </span>
          </div>
          {/* title */}
          <div className="truncate">
            <span className="text-[16px] font-bold leading-[120%] tracking-[0.02em]">
              {post.title}
            </span>
          </div>
          {/* description */}
          <EditorProWithMore
            value={post.description}
            isEdit={false}
            className={{
              base: 'bg-transparent',
              editorWrapper: 'p-0',
              editor: 'text-[13px] opacity-80',
            }}
            collapseHeight={150}
            defaultCollapsed={true}
          />
          <div className="text-[10px] font-normal leading-[120%] opacity-50">
            {dayjs(post.createdAt).format('YYYY-MM-DD')} |{' '}
            {post.tags.map((tag) => `# ${tag.tag}`).join(' ')}
          </div>
        </div>
        <Dropdown>
          <DropdownTrigger>
            {userDID === post.author.id ? (
              <Button
                isIconOnly
                aria-label="More Options"
                className="bg-transparent px-0"
              >
                <EllipsisVerticalIcon className="size-5" />
              </Button>
            ) : (
              <></>
            )}
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
    <Skeleton className="h-[130px] w-full rounded-[10px]" key={index} />
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
