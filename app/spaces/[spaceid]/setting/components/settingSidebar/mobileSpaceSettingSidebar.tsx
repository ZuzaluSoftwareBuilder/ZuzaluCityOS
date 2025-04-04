'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  CommonDrawerHeader,
} from '@/components/base';
import { SettingSection, getSettingSections } from './settingsData';
import SectionGroup from './sectionGroup';

interface MobileSettingSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

const MobileSpaceSettingSidebar: React.FC<MobileSettingSidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
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
        onClose();
      }
    },
    [sections, router, onClose],
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      hideCloseButton={true}
    >
      <DrawerContent className="max-h-[600px] rounded-t-[20px]  border-t-2 shadow-[0px_-6px_24px_0px_rgba(0,0,0,0.25)]">
        <CommonDrawerHeader title={'Navigate Settings'} onClose={onClose} />

        <DrawerBody className="p-[20px]">
          <div className="flex flex-col gap-[10px]">
            {sections.map((section) => (
              <SectionGroup
                key={section.id}
                section={section}
                onItemClick={handleItemClick}
                showTooltip={false}
              />
            ))}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileSpaceSettingSidebar;
