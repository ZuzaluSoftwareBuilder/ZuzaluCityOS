'use client';

import { CommonModalHeader, Modal, ModalContent } from '@/components/base';
import { Divider, cn } from '@heroui/react';
import { CalendarDots, Chats, Newspaper, Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';

// Define channel types
const CHANNEL_TYPES = [
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Simple calendar for members to host calls & other activities',
    icon: CalendarDots,
  },
  {
    id: 'posts',
    name: 'Posts',
    description: 'A channel for posting updates & announcements',
    icon: Newspaper,
  },
  {
    id: 'forum',
    name: 'Forum Topic',
    description: 'A channel for posting updates & announcements',
    icon: Chats,
  },
];

// Modal styles based on existing modals in the codebase
const MODAL_BASE_CLASSES = {
  base: 'rounded-[10px] border-2 border-b-w-10 bg-[rgba(44,44,44,0.80)] backdrop-blur-[20px] text-white',
  backdrop: 'bg-[rgba(34,34,34,0.6)]',
};

// Common text styles
const COMMON_TEXT = {
  title: 'text-[18px] font-bold leading-[1.2]',
  subtitle: 'text-[14px] font-normal leading-[1.4] opacity-60',
  channelName: 'text-[18px] font-bold leading-[1.2]',
  channelDescription: 'text-[14px] font-normal leading-[1.4] opacity-60',
  footer: 'text-[14px] font-normal leading-[1.2]',
};

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  onpenCalendarDrawer: () => void;
}

const CreateChannelModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onpenCalendarDrawer,
}: CreateChannelModalProps) => {
  // We'll keep the state for future functionality
  const [selectedChannelType, setSelectedChannelType] = useState<string | null>(
    null,
  );

  const handleSelectChannelType = (channelId: string) => {
    setSelectedChannelType(channelId);
    // Here you would typically handle the channel creation
    // For now, we'll just close the modal after selection
    if (channelId === CHANNEL_TYPES[0].id) {
      onpenCalendarDrawer();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      hideCloseButton
      onOpenChange={onOpenChange}
      classNames={MODAL_BASE_CLASSES}
    >
      <ModalContent>
        <>
          <CommonModalHeader
            title="Create a Channel"
            onClose={onClose}
            isDisabled={false}
          />
          <Divider />
          <div className="flex flex-col gap-[20px] p-[20px]">
            <div>
              <span className={cn(COMMON_TEXT.subtitle, 'block')}>
                Channel Types
              </span>
            </div>

            <div className="flex flex-col gap-[10px]">
              {CHANNEL_TYPES.map((channel) => (
                <div
                  key={channel.id}
                  className={cn(
                    'flex items-center gap-[20px] rounded-[10px] border border-white/10 bg-white/[0.05] px-[20px] py-[10px]',
                    'cursor-pointer hover:bg-white/[0.08]',
                  )}
                  onClick={() => handleSelectChannelType(channel.id)}
                >
                  <div className="flex size-[40px] items-center justify-center opacity-60">
                    {React.createElement(channel.icon, {
                      size: 40,
                      weight: 'fill',
                    })}
                  </div>
                  <div className="flex flex-1 flex-col gap-[6px]">
                    <span className={COMMON_TEXT.channelName}>
                      {channel.name}
                    </span>
                    <div className="flex flex-col">
                      <span className={COMMON_TEXT.channelDescription}>
                        {channel.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex size-[24px] items-center justify-center opacity-60">
                    <Plus size={24} weight="regular" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-[10px]">
              <span className={COMMON_TEXT.footer}>
                Want more apps? Explore & Install apps
              </span>
            </div>
          </div>
        </>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannelModal;
