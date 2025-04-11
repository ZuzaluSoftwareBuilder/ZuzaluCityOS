'use client';
import { ChevronUpIcon } from '../icons';

import { ZuButton } from '@/components/core';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { ChevronDownIcon } from '../icons';

const EditorPreview = dynamic(
  () => import('@/components/editor/EditorPreview'),
  {
    ssr: false,
  },
);

interface ShowMoreEditProps {
  value: string;
}

export default function ShowMoreEdit({ value }: ShowMoreEditProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

  return (
    <>
      <EditorPreview
        value={value}
        collapsed={isCollapsed}
        onCollapse={(collapsed) => {
          setIsCanCollapse((v) => {
            return v || collapsed;
          });
          setIsCollapsed(collapsed);
        }}
      />
      {isCanCollapse && (
        <ZuButton
          startIcon={
            isCollapsed ? (
              <ChevronDownIcon size={4} />
            ) : (
              <ChevronUpIcon size={4} />
            )
          }
          sx={{ backgroundColor: '#313131', width: '100%' }}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? 'Show More' : 'Show Less'}
        </ZuButton>
      )}
    </>
  );
}
