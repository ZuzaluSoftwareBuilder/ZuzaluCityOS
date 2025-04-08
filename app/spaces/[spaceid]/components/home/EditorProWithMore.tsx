'use client';

import React, { useState } from 'react';
import EditorPro from '@/components/editorPro';
import { Button } from '@/components/base';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons';
import { EditorProProps } from '@/components/editorPro';

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
          className="mt-[10px] box-border flex w-full cursor-pointer flex-row items-center justify-center rounded-[10px] bg-[#2b2b2b] p-[10px_14px] hover:bg-[#ffffff1a]"
          disableAnimation={true}
          onPress={() => {
            setIsCollapsed((v) => !v);
          }}
        >
          <div className="flex flex-row items-center gap-[10px]">
            {isCollapsed ? (
              <>
                <ChevronDownIcon size={4} />
                <span>Show More</span>
              </>
            ) : (
              <>
                <ChevronUpIcon size={4} />
                <span>Show Less</span>
              </>
            )}
          </div>
        </Button>
      )}
    </>
  );
};

export default EditorProWithMore;
