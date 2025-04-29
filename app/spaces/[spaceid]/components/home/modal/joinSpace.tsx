import {
  Button,
  CommonModalHeader,
  Modal,
  ModalContent,
} from '@/components/base';
import { ArrowSquareRightIcon } from '@/components/icons';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useBuildInRole } from '@/context/BuildInRoleContext';
import { useRepositories } from '@/context/RepositoryContext';
import { useZupassContext } from '@/context/ZupassContext';
import { usePOAPVerify } from '@/hooks/useRuleVerify';
import useUserSpace from '@/hooks/useUserSpace';
import { SpaceGating, ZuPassInfo } from '@/models/spaceGating';
import { joinSpace } from '@/services/member';
import { getPOAPs } from '@/services/poap';
import { authenticateWithSpaceId } from '@/utils/ceramic';
import {
  Accordion,
  AccordionItem,
  addToast,
  Avatar,
  cn,
  Divider,
  Skeleton,
} from '@heroui/react';
import { CheckCircle } from '@phosphor-icons/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSpaceData } from '../../context/spaceData';

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

const useJoinSpace = ({
  onClose,
  gated = false,
}: {
  onClose: () => void;
  gated?: boolean;
}) => {
  const { profile } = useAbstractAuthContext();
  const { roleRepository } = useRepositories();
  const { spaceData } = useSpaceData();
  const { memberRole } = useBuildInRole();
  const queryClient = useQueryClient();
  const { userFollowedSpaceIds, userFollowedSpaces } = useUserSpace();
  // TODO wait supabase update, confirm space
  const userId = profile?.did!;
  const spaceId = spaceData?.id ?? '';
  const roleId = memberRole?.id ?? '';
  const isUserFollowed = userFollowedSpaceIds.has(spaceId);

  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!gated) {
        return joinSpace({
          id: spaceId,
          roleId,
          userId,
        });
      } else {
        const error = await authenticateWithSpaceId(spaceId);
        if (error) throw new Error('Failed to authenticate with space id');
        let result;
        if (isUserFollowed) {
          const id =
            userFollowedSpaces.find((role) => role?.resourceId === spaceId)
              ?.id ?? '';
          result = await roleRepository.updateRole(id, {
            roleId,
          });
        }
        result = await roleRepository.createRole({
          userId,
          resourceId: spaceId,
          source: 'space',
          roleId,
        });
        if (result.error) throw new Error('Failed to join');
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['getSpaceMembers', spaceData?.id],
        }),
        queryClient.invalidateQueries({
          queryKey: ['GET_USER_ROLES_QUERY'],
        }),
      ]);
      onClose();
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
    joinMutation.mutate();
  }, [joinMutation]);

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
  const { handleJoinSpace, joinMutation } = useJoinSpace({
    onClose,
    gated: false,
  });

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
  const { handleJoinSpace, joinMutation } = useJoinSpace({
    onClose,
    gated: true,
  });
  const [verifiedRules, setVerifiedRules] = useState<string[]>([]);
  const [verifyingRules, setVerifyingRules] = useState<Record<string, boolean>>(
    {},
  );

  const { verifyPOAPMutation } = usePOAPVerify();
  const { authState, auth } = useZupassContext();

  const rules = useMemo(() => {
    return (
      spaceData?.spaceGating?.filter(
        (v: SpaceGating) => v.gatingStatus === '1',
      ) ?? []
    );
  }, [spaceData?.spaceGating]);

  useEffect(() => {
    if (authState === 'authenticated') {
      setVerifiedRules((prev) => [
        ...prev,
        ...rules.map((v: SpaceGating) => v.id),
      ]);
      setVerifyingRules((prev) => ({
        ...prev,
        zupass: false,
      }));
    } else if (authState === 'error') {
      setVerifyingRules((prev) => ({
        ...prev,
        zupass: false,
      }));
    }
  }, [authState, rules]);

  const handleVerifyItem = useCallback(
    async (ruleId: string, data: VerifyItemData) => {
      try {
        if (data.type === 'zuPass') {
          const zuPassConfig = {
            pcdType: 'eddsa-ticket-pcd' as const,
            publicKey: data.zuPassInfo.registration?.split(',') as [
              string,
              string,
            ],
            eventId: data.zuPassInfo.eventId,
            eventName: data.zuPassInfo.eventName,
          };
          setVerifyingRules((prev) => ({
            ...prev,
            zupass: true,
          }));
          auth([zuPassConfig]);
        } else if (data.type === 'poap') {
          try {
            setVerifyingRules((prev) => ({ ...prev, [data.poapsId]: true }));
            const result = await verifyPOAPMutation(data.poapsId!);
            if (result.tokenId) {
              setVerifiedRules((prev) => [...prev, ruleId]);
            }
          } finally {
            setVerifyingRules((prev) => ({ ...prev, [data.poapsId]: false }));
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [auth, verifyPOAPMutation],
  );

  const anyRuleVerified = verifiedRules.length > 0;

  const rulesContent = useMemo(() => {
    return rules?.map((v: SpaceGating) => {
      const isZuPass = v.zuPassInfo?.eventId;
      const isRuleVerified = isZuPass
        ? verifiedRules.includes(v.zuPassInfo?.eventId ?? '')
        : v.poapsId?.some((p: { poapId: number }) =>
            verifiedRules.includes(p.poapId.toString()),
          );

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
              isLoading={verifyingRules['zupass']}
              isVerified={isRuleVerified}
              onVerify={() =>
                handleVerifyItem(v.zuPassInfo?.eventId ?? '', {
                  type: 'zuPass',
                  zuPassInfo: v.zuPassInfo! as ZuPassInfo,
                })
              }
            />
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {v.poapsId?.map((p: { poapId: number }, index: number) => (
                <Fragment key={p.poapId}>
                  <PoapItem
                    poapId={p.poapId}
                    onVerify={() =>
                      handleVerifyItem(p.poapId.toString(), {
                        type: 'poap',
                        poapsId: p.poapId,
                      })
                    }
                    isVerifying={verifyingRules[p.poapId]}
                    isVerified={verifiedRules.includes(p.poapId.toString())}
                  />
                  {index !== (v.poapsId?.length ?? 0) - 1 && (
                    <span className="text-[14px] font-medium opacity-50">
                      OR
                    </span>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </AccordionItem>
      );
    });
  }, [rules, verifiedRules, handleVerifyItem, verifyingRules]);

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
        // isDisabled={!anyRuleVerified}
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
