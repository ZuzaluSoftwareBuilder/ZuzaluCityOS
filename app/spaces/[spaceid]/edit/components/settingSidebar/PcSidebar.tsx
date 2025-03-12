'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { ArrowLineDown, X } from '@phosphor-icons/react';
import BackHeader from '@/app/spaces/[spaceid]/edit/components/backHeader';
import { SettingSection, getSettingSections } from './settingsData';
import SectionGroup from './SectionGroup';

interface SettingSubSidebarProps {
  currentPath?: string;
  onBack?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  hasChanges?: boolean;
}

const PcSidebar: React.FC<SettingSubSidebarProps> = ({
  currentPath,
  onBack,
  onSave,
  onDiscard,
  hasChanges = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [sections, setSections] = useState<SettingSection[]>(() => 
    getSettingSections(spaceId)
  );

  useEffect(() => {
    if (currentPath) {
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({
            ...item,
            active: item.path === currentPath,
          })),
        })),
      );
    }
  }, [currentPath]);

  const handleItemClick = (sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const item = section?.items.find((i) => i.id === itemId);

    if (item && !item.locked && item.path) {
      router.push(item.path);

      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({
            ...item,
            active: item.id === itemId && section.id === sectionId,
          })),
        })),
      );
    }
  };

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] tablet:hidden mobile:hidden bg-[#222222] border-r border-[rgba(255,255,255,0.1)] flex flex-col justify-between">
      <div className="flex flex-col gap-[20px] p-[20px] overflow-y-auto">
        <div className="flex flex-col gap-[20px]">
          <BackHeader spaceId={spaceId} />

          <div className="flex flex-col gap-[10px]">
            {sections.map((section) => (
              <SectionGroup 
                key={section.id}
                section={section}
                onItemClick={handleItemClick}
                showTooltip={true}
              />
            ))}
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="flex flex-col items-center gap-[20px] p-[20px] border-t border-[rgba(255,255,255,0.1)]">
          <Button
            className="w-full bg-[rgba(103,219,255,0.1)] hover:bg-[rgba(103,219,255,0.2)] rounded-lg py-2 px-3.5 flex justify-center items-center gap-[10px]"
            onPress={onSave}
          >
            <ArrowLineDown size={20} weight="bold" className="text-[#67DBFF]" />
            <span className="text-[#67DBFF] text-[13px] font-medium">
              Save Changes
            </span>
          </Button>
          <Button
            className="w-full bg-[#363636] hover:bg-[#424242] opacity-60 rounded-lg py-2 px-3.5 flex justify-center items-center gap-[10px]"
            onPress={onDiscard}
          >
            <X size={20} weight="bold" className="text-white" />
            <span className="text-white text-[13px] font-medium">
              Discard Changes
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PcSidebar;
