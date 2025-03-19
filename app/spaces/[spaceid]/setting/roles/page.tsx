'use client';
import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ViewRole from './components/viewRole';
import RoleDetail from './components/roleDetail';
import useGetSpaceMember from '@/hooks/useGetSpaceMember';
import { useCeramicContext } from '@/context/CeramicContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function RolesPage() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  const spaceId = useParams().spaceid;
  const { composeClient, ceramic } = useCeramicContext();
  const { isLoading, owner, roles, members } = useGetSpaceMember(
    spaceId as string,
  );

  const handlePost = async () => {
    const Create_QUERY = `
      mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {
        createZucityUserRoles(
          input: $input
        ) {
          document {
            userId {
              id
            }
            created_at
            updated_at
            resourceId
            source
            customAttributes {
              tbd
            }
            roleId
          }
        }
      }
      `;

    const result = await composeClient.executeQuery(Create_QUERY, {
      input: {
        content: {
          userId:
            'did:pkh:eip155:534351:0x16e082c5aeda46b8a4e8bdb85b67df60087997ba',
          resourceId: spaceId,
          source: 'space',
          customAttributes: [
            {
              tbd: JSON.stringify({
                key: 'roleId',
                value: 'e90b1b3b-4af1-4c7a-b943-7595907fefad',
              }),
            },
          ],
          created_at: dayjs().utc().toISOString(),
          updated_at: dayjs().utc().toISOString(),
          roleId:
            'kjzl6kcym7w8y53v6hfdlp1tpwvbdd7rn5iy3bmgtndxh17gzny118q1uzfqv7w',
        },
      },
    });
    console.log(result);
  };

  return (
    <div className="w-full pc:p-[20px_40px_0] flex flex-col gap-10 p-[20px]">
      {roleParam ? (
        <RoleDetail
          roleData={roles?.data || []}
          isLoading={isLoading}
          members={members || []}
          owner={owner}
        />
      ) : (
        <ViewRole
          roleData={roles?.data || []}
          isLoading={isLoading}
          members={members || []}
        />
      )}
    </div>
  );
}
