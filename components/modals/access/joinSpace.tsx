import {
  ArrowSquareRightIcon,
  CheckCircleIcon,
  XCricleIcon,
} from '@/components/icons';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Divider,
  Modal,
  ModalContent,
  useDisclosure,
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
            <div className="flex h-[62px] w-full flex-row items-center justify-between p-[20px]">
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
            <div className="flex flex-col gap-[20px] p-[20px]">
              <p className={COMMON_TEXT.subtitle}>Join this community?</p>
              <div className="flex items-center gap-[10px] rounded-[10px] border border-b-w-10 p-[8px]">
                <Avatar
                  name="Junior"
                  classNames={{
                    base: 'min-w-[60px] h-[60px] ',
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

const defaultContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const JoinSpaceWithGate = () => {
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
            <div className="flex h-[62px] w-full flex-row items-center justify-between p-[20px]">
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
            <div className="flex flex-col gap-[20px] p-[20px]">
              <div className="flex items-center gap-[10px] rounded-[10px] border border-b-w-10 p-[8px]">
                <Avatar
                  name="Junior"
                  classNames={{
                    base: 'min-w-[60px] h-[60px] ',
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
              <p className="text-center text-[14px] font-semibold leading-[1.2] opacity-80">
                Following credentials are required to join:
              </p>
              <Accordion
                variant="splitted"
                className="gap-[10px] p-0"
                itemClasses={{
                  base: 'bg-transparent rounded-[10px] border border-white/10 bg-white/5 px-[8px]',
                  title: 'text-[14px] font-semibold leading-[1.2] opacity-80',
                  trigger: 'py-[8px] gap-[10px]',
                  content: 'pb-[10px] pt-[2px]',
                }}
              >
                <AccordionItem
                  key="1"
                  aria-label="Accordion 1"
                  title="CredentialType"
                  startContent={
                    <Avatar
                      name="Junior"
                      classNames={{
                        base: 'w-[30px] h-[30px] ',
                      }}
                    />
                  }
                >
                  <Divider className="mb-[10px]" />
                  <span className="rounded-[60px] bg-b-w-10 px-[10px] py-[5px] text-[13px] leading-[1.4] text-white">
                    DevCon3
                  </span>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Accordion 2"
                  title="CredentialType"
                  startContent={
                    <Avatar
                      name="Junior"
                      classNames={{
                        base: 'w-[30px] h-[30px] ',
                      }}
                    />
                  }
                  indicator={<CheckCircleIcon color="#7DFFD1" />}
                  disableIndicatorAnimation
                  className="border border-[rgba(125,255,209,0.4)] bg-[rgba(125,255,209,0.05)]"
                >
                  <Divider className="mb-[10px]" />
                  <span className="rounded-[60px] bg-b-w-10 px-[10px] py-[5px] text-[13px] leading-[1.4] text-white">
                    DevCon3
                  </span>
                </AccordionItem>
              </Accordion>
              <Button
                variant="bordered"
                className={BUTTON_STYLES.primary}
                startContent={<ArrowSquareRightIcon />}
                isDisabled
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

export { JoinSpaceNoGate, JoinSpaceWithGate };
