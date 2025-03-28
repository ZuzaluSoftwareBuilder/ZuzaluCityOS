'use client';
import { useGraphQL } from '@/hooks/useGraphQL';
import { GET_DAPP_QUERY } from '@/services/graphql/dApp';
import { Dapp } from '@/types';
import { Image, Skeleton } from '@heroui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AppPage() {
  const searchParams = useSearchParams();
  const appId = searchParams?.get('id');
  const router = useRouter();

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

  console.log(data);

  useEffect(() => {
    if (!appId) {
      router.push('/');
    }
  }, [appId, router]);

  return (
    <div className="w-full h-full overflow-hidden">
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
      <iframe src={data?.appUrl} className="w-full h-full" />
    </div>
  );
}
