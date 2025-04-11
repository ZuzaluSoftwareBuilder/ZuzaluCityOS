'use client';

import { Tooltip } from '@heroui/react';
import { Barricade } from '@phosphor-icons/react';
import React from 'react';
import { SettingItem } from './settingsData';

export interface SectionItemProps {
  item: SettingItem;
  sectionId: string;
  onItemClick: (sectionId: string, itemId: string) => void;
  showTooltip?: boolean;
}

const SectionItem: React.FC<SectionItemProps> = ({
  item,
  sectionId,
  onItemClick,
  showTooltip = false,
}) => {
  const itemContent = (
    <div
      className={`flex h-[34px] items-center justify-between rounded-lg px-2.5 ${
        item.active ? 'bg-[#363636]' : 'bg-transparent hover:bg-[#2C2C2C]'
      } ${item.locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={() => !item.locked && onItemClick(sectionId, item.id)}
    >
      <span className="text-[13px] font-medium text-white">{item.label}</span>
      {item.locked && (
        <Barricade size={16} weight="light" className="text-white" />
      )}
    </div>
  );

  if (showTooltip && item.locked) {
    return (
      <Tooltip
        placement="right"
        content="Coming soon"
        classNames={{
          base: ['bg-transparent'],
          content: [
            'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm',
          ],
        }}
      >
        {itemContent}
      </Tooltip>
    );
  }

  return itemContent;
};

export default SectionItem;
