'use client';

import { Button } from '@/components/base';
import EditorPro, { EditorProProps } from '@/components/editorPro';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';
import { useState } from 'react';

export interface EditorProWithMoreProps
  extends Omit<EditorProProps, 'collapsed' | 'onCollapse'> {
  collapseHeight?: number;
  defaultCollapsed?: boolean;
}

const EditorProWithMore = ({
  collapseHeight = 150,
  defaultCollapsed = true,
  ...editorProps
}: EditorProWithMoreProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);
  const [isCanCollapse, setIsCanCollapse] = useState<boolean>(false);

  return (
    <>
      <EditorPro
        {...editorProps}
        collapsed={isCollapsed}
        collapsable={true}
        collapseHeight={collapseHeight}
        onCollapse={(canCollapse) => {
          setIsCanCollapse(canCollapse);
        }}
      />

      {isCanCollapse && (
        <Button
          className="mt-[10px] flex h-[34px] w-full rounded-[10px] bg-[#2b2b2b] p-[6px_10px] "
          disableAnimation={true}
          onPress={() => {
            setIsCollapsed((v) => !v);
          }}
        >
          <div className="flex flex-row items-center gap-[10px]">
            <div className="opacity-50">
              {isCollapsed ? (
                <ChevronDownIcon size={4} />
              ) : (
                <ChevronUpIcon size={4} />
              )}
            </div>
            <span className="text-[14px] font-[600] leading-[1.6] text-white">
              {isCollapsed ? 'Show More' : 'Show Less'}
            </span>
          </div>
        </Button>
      )}
    </>
  );
};

export default EditorProWithMore;
