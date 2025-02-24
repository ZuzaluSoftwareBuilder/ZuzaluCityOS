import { ArrowSquareRightIcon, XCricleIcon } from '@/components/icons';
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  Divider,
  Avatar,
} from '@heroui/react';

const MODAL_BASE_CLASSES = {
  base: 'rounded-[10px] border-2 border-b-w-10 bg-[rgba(44,44,44,0.80)] backdrop-blur-[20px] text-white',
  backdrop: 'bg-[rgba(34,34,34,0.6)]',
};

const COMMON_TEXT = {
  title: 'text-[18px] font-bold leading-[1.2]',
  subtitle: 'text-[16px] font-semibold leading-[1.2] opacity-80',
  description: 'text-[14px] font-normal leading-[1.6] opacity-60',
};

const BUTTON_STYLES = {
  transparent: 'bg-transparent',
  primary: 'w-full rounded-[8px] border border-b-w-20 bg-white-10',
};

const JoinSpaceNoGate = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    isOpen: true,
  });

  return (
    <Modal
      isOpen={isOpen}
      classNames={MODAL_BASE_CLASSES}
      hideCloseButton
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="flex flex-row justify-between p-[20px] h-[62px] w-full items-center">
              <p className={COMMON_TEXT.title}>Verify to Join</p>
              <Button
                isIconOnly
                variant="flat"
                className={BUTTON_STYLES.transparent}
                onPress={onClose}
              >
                <XCricleIcon size={5} />
              </Button>
            </div>
            <Divider />
            <div className="flex flex-col p-[20px] gap-[20px]">
              <p className={COMMON_TEXT.subtitle}>Join this community?</p>
              <div className="flex items-center gap-[10px] rounded-[10px] border border-b-w-10 p-[8px]">
                <Avatar
                  name="Junior"
                  classNames={{
                    base: 'min-w-[60px] h-[60px] flex-0',
                  }}
                />
                <div className="flex flex-col gap-[6px]">
                  <span className={COMMON_TEXT.title}>Community Name</span>
                  <span className={COMMON_TEXT.description}>
                    Community tagline. Kept short, another line for good
                    measure.
                  </span>
                </div>
              </div>
              <Button
                variant="bordered"
                className={BUTTON_STYLES.primary}
                startContent={<ArrowSquareRightIcon />}
              >
                Confirm & Join
              </Button>
            </div>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const JoinSpaceWithGate = () => {
  return <div>JoinSpace</div>;
};

export { JoinSpaceNoGate, JoinSpaceWithGate };
