'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Drawer, DrawerContent, DrawerHeader, DrawerBody } from '@heroui/react';
import { X } from '@phosphor-icons/react';
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
        }))
      );
    }
  }, [currentPath]);

  const handleItemClick = useCallback((sectionId: string, itemId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const item = section?.items.find((i) => i.id === itemId);

    if (item && !item.locked && item.path) {
      router.push(item.path);
      onClose();
    }
  }, [sections, router, onClose]);

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      placement="bottom"
      classNames={{
        base: "bg-transparent",
        backdrop: "bg-[rgba(34,34,34,0.6)] backdrop-filter backdrop-blur-[20px]",
        closeButton: "hidden",
      }}
    >
      <DrawerContent className="max-h-[600px] bg-[rgba(44,44,44,0.8)] border-t-2 border-[rgba(255,255,255,0.1)] rounded-t-[20px] shadow-[0px_-6px_24px_0px_rgba(0,0,0,0.25)] backdrop-blur-[44px]">
        <DrawerHeader className="flex justify-between items-center h-[56px] px-5 border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex flex-col justify-center">
            <h2 className="text-white text-[18px] font-bold">Navigate Settings</h2>
          </div>
          <button
            className="bg-transparent hover:bg-[rgba(255,255,255,0.1)] rounded-lg w-[44px] h-[36px] flex items-center justify-center"
            onClick={onClose}
          >
            <X size={24} weight="light" className="text-white opacity-50" />
          </button>
        </DrawerHeader>
        
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