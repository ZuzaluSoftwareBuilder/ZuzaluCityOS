'use client';

import React from 'react';
import SectionItem from './sectionItem';
import { SettingSection } from './settingsData';

interface SectionGroupProps {
  section: SettingSection;
  onItemClick: (sectionId: string, itemId: string) => void;
  showTooltip?: boolean;
}

const SectionGroup: React.FC<SectionGroupProps> = ({
  section,
  onItemClick,
  showTooltip = false,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[10px] border-b border-[rgba(255,255,255,0.1)] py-[10px]">
        <span className="text-[11px] font-medium tracking-[0.02em] text-white">
          {section.title}
        </span>
        <div className="flex flex-col gap-[5px]">
          {section.items.map((item) => (
            <SectionItem
              key={item.id}
              item={item}
              sectionId={section.id}
              onItemClick={onItemClick}
              showTooltip={showTooltip}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionGroup;
