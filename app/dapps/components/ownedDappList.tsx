import FormHeader from '@/components/form/FormHeader';

import { Button } from '@/components/base';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useRepositories } from '@/context/RepositoryContext';
import { Dapp } from '@/types';
import { Image } from '@heroui/react';
import { Eye, NotePencil } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface OwnedDappListProps {
  onViewDapp: (_dapp: Dapp) => void;
  onEditDapp: (_dapp: Dapp) => void;
  handleClose: () => void;
}

export default function OwnedDappList({
  onViewDapp,
  onEditDapp,
  handleClose,
}: OwnedDappListProps) {
  const { dappRepository } = useRepositories();
  const { data: dapps } = useQuery({
    queryKey: ['GET_DAPP_LIST_QUERY'],
    queryFn: () => dappRepository.getDapps(),
  });

  const { profile } = useAbstractAuthContext();
  const userDID = profile?.id;

  const ownedDapps = useMemo(() => {
    return dapps?.filter((dapp) => dapp.profile.author.id === userDID) || [];
  }, [dapps, userDID]);

  return (
    <div>
      <FormHeader title="Manage My Listings" handleClose={handleClose} />
      <div className="flex flex-col gap-5 p-5 mobile:p-2.5">
        <div className="flex flex-col gap-2">
          <p className="text-[20px] font-bold leading-[1.2]">
            Your Listed Apps
          </p>
          <p className="text-sm leading-[1.6] opacity-60">
            View and edit your app listings
          </p>
        </div>
        {ownedDapps.map((dapp) => (
          <div
            className="flex flex-row items-center justify-between rounded-[10px] bg-[rgba(255,255,255,0.02)] p-[10px]"
            key={dapp.id}
          >
            <div className="flex flex-row items-center gap-[10px]">
              <Image
                src={dapp.appLogoUrl || ''}
                alt={dapp.appName}
                className="size-[80px] rounded-[10px] border border-[rgba(255,255,255,0.1)]"
                classNames={{
                  wrapper: 'shrink-0',
                }}
              />
              <div className="flex flex-col gap-[5px]">
                <p className="text-[16px] font-bold leading-[1.2] opacity-80">
                  {dapp.appName}
                </p>
                <p className="line-clamp-2 text-[13px] leading-[1.4] opacity-70">
                  {dapp.tagline}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="h-[30px] gap-[5px] p-[4px_10px] opacity-60"
                radius="sm"
                onClick={() => onEditDapp(dapp)}
                startContent={<NotePencil size={18} weight="fill" />}
              >
                Edit
              </Button>
              <Button
                className="h-[30px] gap-[5px] p-[4px_10px] opacity-60"
                radius="sm"
                onClick={() => onViewDapp(dapp)}
                startContent={<Eye size={18} weight="fill" />}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
