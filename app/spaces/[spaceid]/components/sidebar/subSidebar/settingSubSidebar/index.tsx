'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import { CaretLeft, ArrowLineDown, X } from '@phosphor-icons/react';

interface SettingItem {
  id: string;
  label: string;
  active?: boolean;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

interface SettingSubSidebarProps {
  onBack?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  hasChanges?: boolean;
}

const SettingSubSidebar: React.FC<SettingSubSidebarProps> = ({
  onBack,
  onSave,
  onDiscard,
  hasChanges = false,
}) => {
  const router = useRouter();
  const [sections, setSections] = useState<SettingSection[]>([
    {
      id: 'general',
      title: 'General',
      items: [
        { id: 'Overview', label: 'Space Overview', active: true },
        { id: 'setting1', label: 'Setting' },
        { id: 'setting2', label: 'Setting' },
      ],
    },
    {
      id: 'apps',
      title: 'Apps',
      items: [
        { id: 'advanced1', label: 'Coming Soon' },
      ],
    },
  ]);

  const handleItemClick = (sectionId: string, itemId: string) => {
    setSections(
      sections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          active: section.id === sectionId && item.id === itemId,
        })),
      }))
    );
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] tablet:hidden mobile:hidden bg-[#222222] border-r border-[rgba(255,255,255,0.1)] flex flex-col justify-between">
      <div className="flex flex-col gap-[20px] p-[20px] overflow-y-auto">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <Button
              className="h-[34px] bg-[#2C2C2C] hover:bg-[#363636] rounded-lg py-2 px-3.5 flex items-center gap-[5px]"
              onClick={handleBack}
            >
              <CaretLeft size={20} weight="bold" />
              <span className="text-white text-[13px] font-medium">Back</span>
            </Button>
            <span className="text-white text-[14px]">Space Settings</span>
          </div>

          <div className="flex flex-col gap-[10px]">
            {sections.map((section) => (
              <div key={section.id} className="flex flex-col">
                <div className="flex flex-col gap-[10px] border-b border-[rgba(255,255,255,0.1)] py-[10px]">
                  <span className="text-white text-[11px] font-medium uppercase tracking-[0.02em]">
                    {section.title}
                  </span>
                  <div className="flex flex-col gap-[5px]">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center h-[34px] px-2.5 rounded-lg cursor-pointer ${
                          item.active
                            ? 'bg-[#363636] opacity-100'
                            : 'opacity-50 bg-transparent hover:opacity-100 hover:bg-[#2C2C2C]'
                        }`}
                        onClick={() => handleItemClick(section.id, item.id)}
                      >
                        <span className="text-white text-[13px] font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*TODO to confirm save change */}
      {hasChanges && (
        <div className="flex flex-col items-center gap-[20px] p-[20px] border-t border-[rgba(255,255,255,0.1)]">
          <Button
            className="w-full bg-[rgba(103,219,255,0.1)] hover:bg-[rgba(103,219,255,0.2)] rounded-lg py-2 px-3.5 flex justify-center items-center gap-[10px]"
            onClick={onSave}
          >
            <ArrowLineDown size={20} weight="bold" className="text-[#67DBFF]" />
            <span className="text-[#67DBFF] text-[13px] font-medium">
              Save Changes
            </span>
          </Button>
          <Button
            className="w-full bg-[#363636] hover:bg-[#424242] opacity-60 rounded-lg py-2 px-3.5 flex justify-center items-center gap-[10px]"
            onClick={onDiscard}
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

export default SettingSubSidebar; 