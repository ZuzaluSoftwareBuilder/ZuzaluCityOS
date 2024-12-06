'use client';

import { type FC } from 'react';
import { Divider, HStack, Heading } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { TrustfulIcon } from '@/components/icons';

export const TheHeader: FC = () => {
  const router = useRouter();
  const params = useParams();

  const actualURL = `/spaces/${params.spaceid}/trustful`;

  return (
    <>
      <HStack as="header" justifyContent={'space-between'}>
        <HStack
          className="cursor-pointer"
          onClick={() => {
            router.push(actualURL);
          }}
        >
          <TrustfulIcon />
          <Heading
            as="h1"
            fontSize={'1.5rem'}
            className="text-shadow"
            color="white"
          >
            Trustful
          </Heading>
        </HStack>
      </HStack>
      <Divider className="border-slate-50 opacity-10" />
    </>
  );
};
