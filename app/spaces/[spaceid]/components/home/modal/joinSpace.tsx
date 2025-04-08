import { ArrowSquareRightIcon } from '@/components/icons';
import {
  useDisclosure,
  Divider,
  Avatar,
  Accordion,
  AccordionItem,
  addToast,
} from '@heroui/react';
import {
  Modal,
  CommonModalHeader,
  Button,
  ModalContent,
} from '@/components/base';
import { useSpaceData } from '../../context/spaceData';
import { joinSpace } from '@/services/member';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useBuildInRole } from '@/context/BuildInRoleContext';

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
  const { profile } = useCeramicContext();
  const { spaceData } = useSpaceData();
  const { memberRole } = useBuildInRole();
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: joinSpace,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getSpaceMembers', spaceData?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['GET_USER_ROLES_QUERY'],
        }),
      ]);
    },
    onError: (error: any) => {
      console.error(error);
      addToast({
        title: 'Fail to join',
        color: 'danger',
      });
    },
  });

  const userId = profile?.author?.id ?? '';

  const handleJoinSpace = useCallback(() => {
    if (!spaceData?.id) return;
    joinMutation.mutate({
      id: spaceData?.id,
      roleId: memberRole?.id ?? '',
      userId,
    });
  }, [spaceData?.id, joinMutation, memberRole?.id, userId]);

  return (
    <Modal isOpen={isOpen} hideCloseButton onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <CommonModalHeader
              title="Verify to Join"
              onClose={onClose}
              isDisabled={false}
            />
            <Divider />
            <div className="flex flex-col gap-[20px] p-[20px]">
              <p className={COMMON_TEXT.subtitle}>Join this community?</p>
              <div className="flex items-center gap-[10px] rounded-[10px] border border-b-w-10 p-[8px]">
                <Avatar
                  src={spaceData?.avatar}
                  name={spaceData?.name}
                  classNames={{
                    base: 'min-w-[60px] h-[60px] ',
                  }}
                />
                <div className="flex flex-col gap-[6px]">
                  <span className={COMMON_TEXT.title}>{spaceData?.name}</span>
                  <span className={COMMON_TEXT.description}>
                    {spaceData?.tagline}
                  </span>
                </div>
              </div>
              <Button
                color="functional"
                startContent={<ArrowSquareRightIcon />}
                onPress={handleJoinSpace}
                isLoading={joinMutation.isPending}
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    isOpen: true,
  });

  const { profile } = useCeramicContext();
  const { spaceData } = useSpaceData();
  const { memberRole } = useBuildInRole();
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: joinSpace,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getSpaceMembers', spaceData?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['GET_USER_ROLES_QUERY'],
        }),
      ]);
    },
    onError: (error: any) => {
      console.error(error);
      addToast({
        title: 'Fail to join',
        color: 'danger',
      });
    },
  });

  const userId = profile?.author?.id ?? '';

  const handleJoinSpace = useCallback(() => {
    if (!spaceData?.id) return;
    joinMutation.mutate({
      id: spaceData?.id,
      roleId: memberRole?.id ?? '',
      userId,
    });
  }, [spaceData?.id, joinMutation, memberRole?.id, userId]);

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
            <CommonModalHeader
              title="Verify to Join"
              onClose={onClose}
              isDisabled={false}
            />
            <Divider />
            <div className="flex flex-col gap-[20px] p-[20px]">
              <div className="flex items-center gap-[10px] rounded-[10px] border border-b-w-10 p-[8px]">
                <Avatar
                  src={spaceData?.avatar}
                  name={spaceData?.name}
                  classNames={{
                    base: 'min-w-[60px] h-[60px] ',
                  }}
                />
                <div className="flex flex-col gap-[6px]">
                  <span className={COMMON_TEXT.title}>{spaceData?.name}</span>
                  <span className={COMMON_TEXT.description}>
                    {spaceData?.tagline}
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
                  base: 'bg-transparent rounded-[10px] border border-white/10 bg-white/5 px-[10px]',
                  title: 'text-[14px] font-semibold leading-[1.2] opacity-80',
                  trigger: 'py-[10px] gap-[10px]',
                  content: 'pb-[10px] pt-[2px]',
                }}
              >
                <AccordionItem key="1" aria-label="Accordion 1" title="POAP">
                  <Divider className="mb-[10px]" />
                  <span className="rounded-[60px] bg-b-w-10 px-[10px] py-[5px] text-[13px] leading-[1.4] text-white">
                    DevCon3
                  </span>
                </AccordionItem>
                <AccordionItem
                  key="2"
                  aria-label="Accordion 2"
                  title="ZuPass"
                  // indicator={<CheckCircleIcon color="#7DFFD1" />}
                  disableIndicatorAnimation
                  // className="border border-[rgba(125,255,209,0.4)] bg-[rgba(125,255,209,0.05)]"
                >
                  <Divider className="mb-[10px]" />
                  <span className="rounded-[60px] bg-b-w-10 px-[10px] py-[5px] text-[13px] leading-[1.4] text-white">
                    DevCon3
                  </span>
                </AccordionItem>
              </Accordion>
              <Button
                startContent={<ArrowSquareRightIcon />}
                isDisabled
                onPress={handleJoinSpace}
                isLoading={joinMutation.isPending}
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
