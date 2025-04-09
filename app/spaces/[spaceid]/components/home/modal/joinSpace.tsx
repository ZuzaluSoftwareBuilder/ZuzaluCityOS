import { ArrowSquareRightIcon } from '@/components/icons';
import {
  Divider,
  Avatar,
  Accordion,
  AccordionItem,
  addToast,
  Skeleton,
  cn,
} from '@heroui/react';
import {
  Modal,
  CommonModalHeader,
  Button,
  ModalContent,
} from '@/components/base';
import { useSpaceData } from '../../context/spaceData';
import { joinSpace } from '@/services/member';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useCallback, ReactNode, useMemo, useState } from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { getPOAPs } from '@/services/poap';
import { CheckCircle } from '@phosphor-icons/react';
import { usePOAPVerify } from '@/hooks/useRuleVerify';
import { ZuPassInfo } from '@/types';

const MODAL_BASE_CLASSES = {
  base: 'rounded-[10px] border-2 border-b-w-10 bg-[rgba(44,44,44,0.80)] backdrop-blur-[20px] text-white',
  backdrop: 'bg-[rgba(34,34,34,0.6)]',
};

const COMMON_TEXT = {
  title: 'text-[18px] font-bold leading-[1.2]',
  subtitle: 'text-[16px] font-semibold leading-[1.2] opacity-80',
  description: 'text-[14px] font-normal leading-[1.6] opacity-60',
};

type VerifyItemData =
  | {
      type: 'zuPass';
      zuPassInfo: ZuPassInfo;
    }
  | {
      type: 'poap';
      poapsId: number;
    };

const SpaceInfoCard = () => {
  const { spaceData } = useSpaceData();

  return (
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
        <span className={COMMON_TEXT.description}>{spaceData?.tagline}</span>
      </div>
    </div>
  );
};

type JoinButtonProps = {
  handleJoinSpace: () => void;
  isLoading: boolean;
  isDisabled?: boolean;
  color?: 'functional' | 'default' | undefined;
};

const JoinButton = ({
  handleJoinSpace,
  isLoading,
  isDisabled = false,
  color,
}: JoinButtonProps) => (
  <Button
    color={color}
    startContent={<ArrowSquareRightIcon />}
    onPress={handleJoinSpace}
    isLoading={isLoading}
    isDisabled={isDisabled}
  >
    Confirm & Join
  </Button>
);

const useJoinSpace = () => {
  const { profile } = useCeramicContext();
  const { spaceData } = useSpaceData();
  const { memberRole } = useBuildInRole();
  const queryClient = useQueryClient();
  const userId = profile?.author?.id ?? '';

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

  const handleJoinSpace = useCallback(() => {
    if (!spaceData?.id) return;
    joinMutation.mutate({
      id: spaceData?.id,
      roleId: memberRole?.id ?? '',
      userId,
    });
  }, [spaceData?.id, joinMutation, memberRole?.id, userId]);

  return {
    handleJoinSpace,
    joinMutation,
    spaceData,
  };
};

type JoinSpaceModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
};

const JoinSpaceModal = ({
  children,
  isOpen,
  onClose,
  onOpenChange,
}: JoinSpaceModalProps) => {
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
            title="Verify to Join"
            onClose={onClose}
            isDisabled={false}
          />
          <Divider />
          <div className="flex flex-col gap-[20px] p-[20px]">{children}</div>
        </>
      </ModalContent>
    </Modal>
  );
};

interface JoinSpaceProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const JoinSpaceNoGate = ({ isOpen, onClose, onOpenChange }: JoinSpaceProps) => {
  const { handleJoinSpace, joinMutation } = useJoinSpace();

  return (
    <JoinSpaceModal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <SpaceInfoCard />
      <JoinButton
        handleJoinSpace={handleJoinSpace}
        isLoading={joinMutation.isPending}
        color="functional"
      />
    </JoinSpaceModal>
  );
};

const JoinSpaceWithGate = ({
  isOpen,
  onClose,
  onOpenChange,
}: JoinSpaceProps) => {
  const { spaceData } = useSpaceData();
  const { handleJoinSpace, joinMutation } = useJoinSpace();
  const [verifiedRules, setVerifiedRules] = useState<string[]>([]);
  const [verifyingPoaps, setVerifyingPoaps] = useState<Record<number, boolean>>(
    {},
  );

  const { verifyPOAPMutation } = usePOAPVerify();

  const rules = useMemo(() => {
    return (
      spaceData?.spaceGating?.edges
        .map((edge) => edge.node)
        .filter((v) => v.gatingStatus === '1') ?? []
    );
  }, [spaceData?.spaceGating?.edges]);

  const handleVerifyItem = useCallback(
    async (ruleId: string, data: VerifyItemData) => {
      try {
        if (data.type === 'zuPass') {
          setVerifiedRules((prev) => [...prev, ruleId]);
        } else if (data.type === 'poap') {
          try {
            setVerifyingPoaps((prev) => ({ ...prev, [data.poapsId]: true }));
            const result = await verifyPOAPMutation(data.poapsId!);
            if (result.statusCode === 200) {
              setVerifiedRules((prev) => [...prev, ruleId]);
            }
          } finally {
            setVerifyingPoaps((prev) => ({ ...prev, [data.poapsId]: false }));
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [verifyPOAPMutation],
  );

  const anyRuleVerified = verifiedRules.length > 0;

  const rulesContent = useMemo(() => {
    return rules?.map((v) => {
      const isZuPass = v.zuPassInfo?.eventId;
      const isRuleVerified = isZuPass
        ? verifiedRules.includes(v.zuPassInfo?.eventId ?? '')
        : v.poapsId?.some((p) => verifiedRules.includes(p.poapId.toString()));

      return (
        <AccordionItem
          key={v.id}
          aria-label={isZuPass ? 'ZuPass' : 'POAP'}
          title={isZuPass ? 'ZuPass' : 'POAP'}
          indicator={
            isRuleVerified && <CheckCircle color="#7DFFD1" size={20} />
          }
          disableIndicatorAnimation
          className={cn(
            isRuleVerified &&
              'border border-[rgba(125,255,209,0.4)] bg-[rgba(125,255,209,0.05)]',
          )}
        >
          <Divider className="mb-[10px]" />
          {isZuPass ? (
            <RuleItem
              name={v.zuPassInfo?.eventName ?? ''}
              isVerified={isRuleVerified}
              onVerify={() =>
                handleVerifyItem(v.zuPassInfo?.eventId ?? '', {
                  type: 'zuPass',
                  zuPassInfo: v.zuPassInfo!,
                })
              }
            />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {v.poapsId?.map((p, index) => (
                <>
                  <PoapItem
                    key={p.poapId}
                    poapId={p.poapId}
                    onVerify={() =>
                      handleVerifyItem(p.poapId.toString(), {
                        type: 'poap',
                        poapsId: p.poapId,
                      })
                    }
                    isVerifying={verifyingPoaps[p.poapId]}
                    isVerified={verifiedRules.includes(p.poapId.toString())}
                  />
                  {index !== (v.poapsId?.length ?? 0) - 1 && (
                    <span className="text-[14px] font-medium opacity-50">
                      OR
                    </span>
                  )}
                </>
              ))}
            </div>
          )}
        </AccordionItem>
      );
    });
  }, [rules, handleVerifyItem, verifiedRules, verifyingPoaps]);

  return (
    <JoinSpaceModal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <SpaceInfoCard />
      <p className="text-center text-[14px] font-semibold leading-[1.2] opacity-80">
        Meet any of the following conditions to join:
      </p>
      <Accordion
        keepContentMounted
        variant="splitted"
        className="gap-[10px] p-0"
        itemClasses={{
          base: 'bg-transparent rounded-[10px] border border-white/10 bg-white/5 px-[10px]',
          title: 'text-[14px] font-semibold leading-[1.2] opacity-80',
          trigger: 'py-[10px] gap-[10px]',
          content: 'pb-[10px] pt-[2px]',
        }}
      >
        {rulesContent}
      </Accordion>
      <JoinButton
        handleJoinSpace={handleJoinSpace}
        isLoading={joinMutation.isPending}
        isDisabled={!anyRuleVerified}
        color={anyRuleVerified ? 'functional' : 'default'}
      />
    </JoinSpaceModal>
  );
};

const RuleItem = ({
  name,
  isVerified = false,
  onVerify,
  isLoading = false,
}: {
  name: string;
  isVerified?: boolean;
  onVerify: () => void;
  isLoading?: boolean;
}) => (
  <Button
    size="sm"
    color={isVerified ? 'success' : 'functional'}
    className={cn('h-auto whitespace-normal p-[4px_8px]')}
    onPress={onVerify}
    isLoading={isLoading}
  >
    {name}
  </Button>
);

const PoapItem = ({
  poapId,
  onVerify,
  isVerified = false,
  isVerifying = false,
}: {
  poapId: number;
  onVerify: () => void;
  isVerified?: boolean;
  isVerifying?: boolean;
}) => {
  const { data: poapData, isLoading } = useQuery({
    queryKey: ['poaps', poapId],
    queryFn: ({ queryKey }) => getPOAPs({ queryKey }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <Skeleton className="h-[30px] w-[100px] rounded-lg" />;
  }

  const poap = poapData?.items?.[0];
  if (!poap) return null;

  return (
    <RuleItem
      name={poap.name}
      isVerified={isVerified}
      onVerify={onVerify}
      isLoading={isVerifying}
    />
  );
};

export { JoinSpaceNoGate, JoinSpaceWithGate };
