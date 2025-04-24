'use client';

import { Button } from '@/components/base';
import { useRepositories } from '@/context/RepositoryContext';
import { DoorOpen, LockLaminated } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSpaceData } from '../../components/context/spaceData';
import { useSpacePermissions } from '../../components/permission';
import RuleList from './components/ruleList';

export default function AccessSettingPage() {
  const { spaceData, refreshSpaceData } = useSpaceData();
  const { isOwner } = useSpacePermissions();
  const { spaceRepository } = useRepositories();

  const { mutate: updateSpace, isPending: isUpdating } = useMutation({
    mutationFn: (input: any) => {
      return spaceRepository.update(spaceData?.id as string, input);
    },
    onSuccess: () => {
      refreshSpaceData();
    },
  });

  const handleGateSpace = useCallback(() => {
    updateSpace({
      gated: '1',
    });
  }, [updateSpace]);

  const hasGated = spaceData?.gated === '1';

  return (
    <div className="size-full p-0 pc:p-[20px_40px]">
      <div className="mx-auto w-[600px] p-[20px] mobile:w-full">
        <div className="flex w-full flex-col gap-5">
          <div className="flex h-[50px] w-full items-center gap-2.5 rounded-[10px] border border-white/10 p-2.5">
            {hasGated ? (
              <LockLaminated size={30} weight="duotone" />
            ) : (
              <DoorOpen size={30} weight="duotone" />
            )}
            <span className="text-base font-semibold text-white">
              {hasGated ? 'Gated Space' : 'Open Space'}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-base font-bold leading-[1.2] text-white">
              Create Rules
            </p>
            <p className="text-[13px] leading-[1.4] text-white/60">
              Create rules for access based on conditions
            </p>
          </div>

          {hasGated ? (
            <RuleList />
          ) : (
            <div className="flex flex-col gap-2.5">
              <Button
                size="lg"
                color="functional"
                className="p-[12px]"
                fullWidth
                endContent={<LockLaminated size={18} />}
                isLoading={isUpdating}
                disabled={!isOwner}
                onPress={handleGateSpace}
              >
                Gate Space
              </Button>
              <p className="text-[13px] leading-[1.4] text-[#FF9C66]">
                Warning: Once you gate your space, you cannot revert back to an
                open space
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
