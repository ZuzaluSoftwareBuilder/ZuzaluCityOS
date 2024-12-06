'use client';

/* eslint-disable react/jsx-no-undef */
import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Divider,
  Flex,
  Box,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { BadgeStatus, BadgeTagIcon } from './BadgeTagIcon';
import { useTrustful } from '@/context/TrustfulContext';
import { CalendarTimeIcon, HeartLoveIcon, UserIcon } from '@/components/icons';
import { getEllipsedAddress } from '@/utils/format';
import { Address } from 'viem';

export interface Schema {
  index: string;
  id: string;
}

export interface BadgeData {
  id: string;
  title: string;
  status: BadgeStatus;
  comment?: string;
  timeCreated: number;
  attester: string;
  recipient: string;
  txid: string;
  schema: Schema;
  revoked: boolean;
  responseId?: string;
}

interface BadgeCardProps {
  badgeData: BadgeData[];
}

export const BadgeCard: React.FC<BadgeCardProps> = ({ badgeData }) => {
  const router = useRouter();
  const { setSelectedBadge } = useTrustful();
  const params = useParams();
  const actualURL = `/spaces/${params.spaceid}/trustful/my-badges`;

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
    >
      {badgeData.map((badge) => (
        <Card
          key={badge.id}
          className="cursor-pointer"
          background={'#F5FFFF0D'}
          border={2}
          onClick={() => {
            setSelectedBadge(badge);
            router.push(`${actualURL}/details`);
          }}
        >
          <CardHeader
            gap={4}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            pt="0.75rem"
            pb="0.75rem"
          >
            <Flex gap={4} className={'items-center'}>
              <Box
                boxSize="16px"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <HeartLoveIcon className="w-4 h-4 opacity-50 text-slate-50" />
              </Box>
              <Text fontSize="md" className="text-slate-50">
                {badge.title}
              </Text>
            </Flex>
            <Flex className={'items-center'} gap={2}>
              <BadgeTagIcon status={badge.status} />
            </Flex>
          </CardHeader>
          <Divider color={'#F5FFFF14'} />
          <CardBody gap={4} display={'flex'} flexDirection={'column'}>
            <Flex gap={4} alignItems={'center'} flexDirection={'row'}>
              <CalendarTimeIcon className="w-4 h-4" />
              <Flex gap={2} alignItems={'center'}>
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Date
                </Text>
                <Text className="text-slate-50 opacity-70 text-sm font-normal ">
                  {new Date(badge.timeCreated * 1000).toLocaleString()}
                </Text>
              </Flex>
            </Flex>
            <Flex gap={4} alignItems={'center'} flexDirection={'row'}>
              <UserIcon className="text-white" />
              <Flex gap={2} alignItems={'center'} className="text-slate-50">
                <Text className="text-slate-50 opacity-70 text-sm font-normal leading-tight">
                  Issuer
                </Text>
                {getEllipsedAddress(badge.attester as Address)}
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};
