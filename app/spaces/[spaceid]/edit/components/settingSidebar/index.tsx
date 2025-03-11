'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button, Tooltip } from '@heroui/react';
import { CaretLeft, ArrowLineDown, X, Barricade } from '@phosphor-icons/react';

interface SettingItem {
  id: string;
  label: string;
  active?: boolean;
  locked?: boolean;
  path?: string;
}

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

interface SettingSubSidebarProps {
  currentPath?: string;
  onBack?: () => void;
  onSave?: () => void;
  onDiscard?: () => void;
  hasChanges?: boolean;
}

const SettingSubSidebar: React.FC<SettingSubSidebarProps> = ({
  currentPath,
  onBack,
  onSave,
  onDiscard,
  hasChanges = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const spaceId = params.spaceid.toString();

  const [sections, setSections] = useState<SettingSection[]>(() => {
    return [
      {
        id: 'General',
        title: 'General',
        items: [
          {
            id: 'Overview',
            label: 'Community Overview',
            path: `/spaces/${spaceId}/edit`,
          },
          {
            id: 'AccessManagement',
            label: 'Access Management',
            path: `/spaces/${spaceId}/edit/access`,
            locked: true,
          },
          {
            id: 'Event',
            label: 'Event',
            path: `/spaces/${spaceId}/edit/event`,
            locked: true,
          },
        ],
      },
      {
        id: 'AppManagement',
        title: 'App Management',
        items: [
          {
            id: 'ExploreApps',
            label: 'Explore Apps',
            path: `/spaces/${spaceId}/edit/apps`,
          },
          {
            id: 'ManageApps',
            label: 'Manage Apps',
            path: `/spaces/${spaceId}/edit/manage-apps`,
            locked: true,
          },
        ],
      },
      {
        id: 'MemberManagement',
        title: 'Member Management',
        items: [
          {
            id: 'MemberList',
            label: 'Member List',
            path: `/spaces/${spaceId}/edit/member-list`,
            locked: true,
          },
          {
            id: 'Invitations',
            label: 'Invitations',
            path: `/spaces/${spaceId}/edit/invitations`,
            locked: true,
          },
        ],
      },
    ];
  });

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push(`/spaces/${spaceId}`);
    }
  };

  return (
    <div className="w-[260px] h-[calc(100vh-50px)] tablet:hidden mobile:hidden bg-[#222222] border-r border-[rgba(255,255,255,0.1)] flex flex-col justify-between">
      <div className="flex flex-col gap-[20px] p-[20px] overflow-y-auto">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-center gap-[10px]">
            <Button
              className="h-[34px] bg-[#2C2C2C] hover:bg-[#363636] rounded-lg py-2 px-3.5 flex items-center gap-[5px]"
              onPress={handleBack}
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
                  <span className="text-white text-[11px] font-medium tracking-[0.02em]">
                    {section.title}
                  </span>
                  <div className="flex flex-col gap-[5px]">
                    {section.items.map((item) => (
                      <Tooltip
                        key={item.id}
                        placement="right"
                        content="Coming soon"
                        isDisabled={!item.locked}
                        classNames={{
                          base: ['bg-transparent'],
                          content: [
                            'px-2.5 py-1 bg-[rgba(44,44,44,0.8)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm',
                          ],
                        }}
                      >
                        <div
                          className={`flex justify-between items-center h-[34px] px-2.5 rounded-lg ${
                            item.active
                              ? 'bg-[#363636]'
                              : ' bg-transparent hover:bg-[#2C2C2C]'
                          } ${item.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          onClick={() =>
                            !item.locked && handleItemClick(section.id, item.id)
                          }
                        >
                          <span className="text-white text-[13px] font-medium">
                            {item.label}
                          </span>
                          {item.locked && (
                            <Barricade
                              size={16}
                              weight="light"
                              format="Stroke"
                              className="text-white"
                            />
                          )}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
