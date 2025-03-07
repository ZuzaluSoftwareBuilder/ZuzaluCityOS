import { CloseIcon } from '@/components/icons';
import { Drawer } from '@mui/material';
import { Button, Image } from '@heroui/react';
import Sidebar from '.';

interface PropTypes {
  open: boolean;
  onClose: () => void;
  selected: string;
}

export default function SidebarDrawer({ open, onClose, selected }: PropTypes) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      hideBackdrop
      sx={{
        '& .MuiDrawer-paper': {
          background: 'none',
        },
      }}
    >
      <div className="w-[260px] h-screen bg-[rgba(34,34,34,0.8)] border-r border-[rgb(58,60,62)] flex flex-col justify-between backdrop-blur-[20px]">
        <div className="p-[10px] flex items-center bg-none pb-0">
          <Button
            isIconOnly
            aria-label="close"
            variant="light"
            onPress={onClose}
          >
            <CloseIcon size={5} />
          </Button>
          <Image
            src="/header/logoWithText.png"
            alt="logo"
            height={30}
            radius="none"
          />
        </div>
        <Sidebar selected={selected} onClose={onClose} isMobile />
      </div>
    </Drawer>
  );
}
