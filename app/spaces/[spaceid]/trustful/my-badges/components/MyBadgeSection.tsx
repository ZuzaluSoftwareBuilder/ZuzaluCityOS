'use client';

import React, { useEffect, useState } from 'react';

import { Box, ChakraProvider, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { BadgeCard, BadgeData, Schema } from './BadgeCard';
import { BadgeStatus } from './BadgeTagIcon';
import { TRUSTFUL_SCHEMAS } from '../../constants/constants';
import { BADGE_QUERY } from '../../constants/schemaQueries';
import { TheFooterNavbar } from '../../components/TheFooterNavbar';
import { TheHeader } from '../../components/TheHeader';
import { fetchEASData } from '../../service';
import chakraTheme from '@/theme/lib/chakra-ui';
import { isDev } from '@/constant';

interface Attestation {
  decodedDataJson: string;
  timeCreated: number;
  attester: string;
  revoked: boolean;
  id: string;
  recipient: string;
  txid: string;
  schema: Schema;
  refUID: string;
  status: boolean;
}

export const MyBadgeSection: React.FC = () => {
  const { address } = useAccount();
  const { push } = useRouter();
  const [badgeData, setBadgeData] = useState<BadgeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const { villagerAttestationCount } = useContext(WalletContext);
  const villagerAttestationCount = Number(1);

  useEffect(() => {
    if (villagerAttestationCount === 0) {
      toast.error(
        <span className="flex flex-col">
          <strong>You have not checked in.</strong>{' '}
          <p>Please check-in first.</p>
        </span>,
      );
      push('/pre-checkin');
    }
  }, [villagerAttestationCount]);

  useEffect(() => {
    if (address && !isDev) {
      fetchData();
    } else if (isDev) {
      toast.error(
        <span className="flex flex-col">
          <strong>Cannot fetch your badges.</strong>{' '}
          <p>
            Please connect your wallet to Scroll Mainnet to view your badges.
          </p>
        </span>,
      );
    }
  }, [address]);

  const fetchData = async () => {
    setIsLoading(true);
    const responseAttestBadges: Attestation[] = await handleQuery(
      false,
      null,
      null,
    );
    console.log('responseAttestBadges', responseAttestBadges);
    if (responseAttestBadges) {
      const decodedDataPromises: Promise<BadgeData>[] = responseAttestBadges
        .filter((attestation: Attestation) => attestation.decodedDataJson)
        .map(async (attestation: Attestation) => {
          const parsedJson = JSON.parse(attestation.decodedDataJson);
          let title = parsedJson.find((item: any) => item.name === 'title')
            ?.value.value;
          if (!title) {
            title = parsedJson.find((item: any) => item.name === 'status')
              ?.value.value;

            if (!title) {
              title = parsedJson.find((item: any) => item.name === 'role')
                ?.value.value;
            }
          }
          const comment = parsedJson.find(
            (item: any) => item.name === 'comment',
          )?.value.value;
          let badgeStatus = BadgeStatus.PENDING;
          let responseId: string | undefined = undefined;
          const responseAttestResponse: Attestation[] = await handleQuery(
            true,
            attestation.attester,
            attestation.id,
          );
          if (responseAttestResponse.length > 0) {
            responseAttestResponse.sort(
              (a, b) => b.timeCreated - a.timeCreated,
            );
            const lastItem = responseAttestResponse[0];
            const parsedJson = JSON.parse(lastItem.decodedDataJson);
            const status = parsedJson.find(
              (item: any) => item.name === 'status',
            )?.value.value;
            const revoked = lastItem.revoked;
            responseId = lastItem.id ?? undefined;
            if (!revoked && !status) {
              badgeStatus = BadgeStatus.REJECTED;
            } else if (!revoked && status) {
              badgeStatus = BadgeStatus.CONFIRMED;
            }
          } else if (
            attestation.schema.id === TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.uid ||
            (attestation.schema.id === TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid &&
              !attestation.revoked)
          ) {
            badgeStatus = BadgeStatus.CONFIRMED;
          } else if (
            attestation.schema.id === TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid &&
            attestation.revoked
          ) {
            badgeStatus = BadgeStatus.REJECTED;
          }

          return {
            id: attestation.id,
            title,
            comment,
            timeCreated: attestation.timeCreated,
            attester: attestation.attester,
            recipient: attestation.recipient,
            txid: attestation.txid,
            schema: attestation.schema,
            status: badgeStatus,
            revoked: attestation.revoked,
            responseId: responseId,
          };
        });

      const decodedData = await Promise.all(decodedDataPromises);
      setBadgeData(decodedData);
    }

    setIsLoading(false);
  };

  const handleQuery = async (
    isAttestResponse: boolean,
    recipient: string | null,
    attestation: string | null,
  ) => {
    let queryVariables = {};
    queryVariables = {
      where: {
        OR: [
          {
            schemaId: {
              equals: TRUSTFUL_SCHEMAS.ATTEST_EVENT.uid,
            },
            recipient: {
              equals: address,
            },
          },
          {
            schemaId: {
              equals: TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid,
            },
            recipient: {
              equals: address,
            },
          },
          {
            schemaId: {
              equals: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.uid,
            },
            recipient: {
              equals: address,
            },
          },
        ],
      },
      orderBy: [
        {
          timeCreated: 'desc',
        },
      ],
    };
    if (isAttestResponse) {
      queryVariables = {
        where: {
          schemaId: {
            equals: TRUSTFUL_SCHEMAS.ATTEST_RESPONSE.uid,
          },
          recipient: {
            equals: recipient,
          },
          refUID: {
            equals: attestation,
          },
        },
        orderBy: [
          {
            timeCreated: 'desc',
          },
        ],
      };
    }

    try {
      const { response } = await fetchEASData(BADGE_QUERY, queryVariables);
      const attestations = response?.data?.data.attestations;
      if (!attestations) {
        toast.error(
          <span>
            <strong>Cannot fetch EAS.</strong>{' '}
            <p>Subgraph returned error with current query</p>
          </span>,
        );
        return null;
      }

      return attestations;
    } catch (error) {
      toast.error(
        <span className="flex flex-col">
          <strong>Cannot fetch EAS.</strong> <p>Subgraph returned error</p>
        </span>,
      );

      return null;
    }
  };

  return (
    <Flex flexDirection="column" minHeight="10vh" marginBottom="60px">
      {villagerAttestationCount !== null ? (
        <>
          <TheHeader />
          <Box
            flex={1}
            as="main"
            className="p-6 sm:px-[60px] sm:py-[80px] justify-center flex items-center"
            marginBottom="60px"
          >
            <Flex flexDirection={'column'} gap={2} className="w-full">
              {isLoading ? (
                <Box flex={1} className="flex justify-center items-center">
                  <BeatLoader size={8} color="#B1EF42" />
                </Box>
              ) : (
                <ChakraProvider theme={chakraTheme}>
                  <BadgeCard badgeData={badgeData} />
                </ChakraProvider>
              )}
            </Flex>
          </Box>
          <Box className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full items-center">
            <TheFooterNavbar />
          </Box>
        </>
      ) : (
        <Box flex={1} className="flex justify-center items-center">
          <BeatLoader size={8} color="#B1EF42" />
        </Box>
      )}
    </Flex>
  );
};
