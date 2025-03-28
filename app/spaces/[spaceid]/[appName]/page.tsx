'use client';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_DAPP_QUERY } from '@/services/graphql/dApp';
import { Dapp } from '@/types';
import { CircularProgress, cn, Image, Skeleton } from '@heroui/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function AppPage() {
  const searchParams = useSearchParams();
  const appId = searchParams?.get('id');
  const spaceId = useParams()?.spaceid;
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleIframeLoad = useCallback(() => {
    console.log('iframe loaded');
    setIsLoaded(true);
  }, []);

  const { data, isLoading } = useGraphQL(
    ['GET_DAPP_QUERY', appId],
    GET_DAPP_QUERY,
    {
      id: appId!,
    },
    {
      enabled: !!appId,
      select: (data) => data?.data?.node as Dapp,
    },
  );

  useEffect(() => {
    if (!appId) {
      router.replace(`/spaces/${spaceId}`);
    }
  }, [appId, router, spaceId]);

  return (
    <div className="w-full h-full overflow-hidden relative">
      <div className="pc:flex h-[50px] border-[#2C2C2C] border-b border-[rgba(255,255,255,0.1)] flex items-center px-5 backdrop-blur-[20px] bg-[#2c2c2c] gap-[10px]">
        {isLoading ? (
          <>
            <Skeleton className="w-[20px] h-[20px] rounded-full" />
            <Skeleton className="w-[100px] h-[20px] rounded-md" />
          </>
        ) : (
          <>
            <Image
              src={data?.appLogoUrl}
              alt={data?.appName}
              width={20}
              height={20}
              className="rounded-full"
            />
            <h1 className="text-[18px] font-bold text-white">
              {data?.appName}
            </h1>
          </>
        )}
      </div>
      <iframe
        src={data?.appUrl}
        className={cn('w-full h-full', {
          'opacity-0': !isLoaded,
        })}
        onLoad={handleIframeLoad}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}
