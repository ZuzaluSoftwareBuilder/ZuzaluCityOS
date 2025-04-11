'use client';

import BackHeader from '@/app/spaces/[spaceid]/setting/components/backHeader';
import { Button } from '@heroui/react';
import { ArrowLineDown, X } from '@phosphor-icons/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import SectionGroup from './sectionGroup';
import { SettingSection, getSettingSections } from './settingsData';

interface SettingSubSidebarProps {
  currentPath?: string;
  onBack?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  hasChanges?: boolean;
}

const PcSpaceSettingSidebar: React.FC<SettingSubSidebarProps> = ({
  currentPath,
  onBack,
  onSave,
  onDiscard,
  hasChanges = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid?.toString() ?? '';

  const [sections, setSections] = useState<SettingSection[]>(() =>
    getSettingSections(spaceId),
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

  const handleItemClick = useCallback(
    (sectionId: string, itemId: string) => {
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
    },
    [sections, router, setSections],
  );

  return (
    <div className="flex h-[calc(100vh-50px)] w-[260px] flex-col justify-between border-r border-[rgba(255,255,255,0.1)] bg-[#222222] tablet:hidden mobile:hidden">
      <div className="flex flex-col gap-[20px] overflow-y-auto p-[20px]">
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
        <div className="flex flex-col items-center gap-[20px] border-t border-[rgba(255,255,255,0.1)] p-[20px]">
          <Button
            className="flex w-full items-center justify-center gap-[10px] rounded-lg bg-[rgba(103,219,255,0.1)] px-3.5 py-2 hover:bg-[rgba(103,219,255,0.2)]"
            onPress={onSave}
          >
            <ArrowLineDown size={20} weight="bold" className="text-[#67DBFF]" />
            <span className="text-[13px] font-medium text-[#67DBFF]">
              Save Changes
            </span>
          </Button>
          <Button
            className="flex w-full items-center justify-center gap-[10px] rounded-lg bg-[#363636] px-3.5 py-2 opacity-60 hover:bg-[#424242]"
            onPress={onDiscard}
          >
            <X size={20} weight="bold" className="text-white" />
            <span className="text-[13px] font-medium text-white">
              Discard Changes
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PcSpaceSettingSidebar;
