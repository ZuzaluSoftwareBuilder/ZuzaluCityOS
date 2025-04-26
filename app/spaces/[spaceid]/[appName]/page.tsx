'use client';
import { getDappRepository } from '@/repositories/dapp';
import { CircularProgress, cn, Image, Skeleton } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
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

  const { data, isLoading } = useQuery({
    queryKey: ['dapp', appId],
    queryFn: async () => {
      if (!appId) return null;
      const dappRepository = getDappRepository();
      const result = await dappRepository.getDappById(appId);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!appId,
  });

  useEffect(() => {
    if (!appId) {
      router.replace(`/spaces/${spaceId}`);
    }
  }, [appId, router, spaceId]);

  return (
    <div className="relative size-full overflow-hidden">
      <div className="flex h-[50px] items-center gap-[10px] border-b border-[rgba(255,255,255,0.1)] bg-[#2c2c2c] px-5 backdrop-blur-[20px] pc:flex">
        {isLoading ? (
          <>
            <Skeleton className="size-[20px] rounded-full" />
            <Skeleton className="h-[20px] w-[100px] rounded-md" />
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
