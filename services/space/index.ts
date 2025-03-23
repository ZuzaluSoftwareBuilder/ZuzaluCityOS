import { executeQuery } from '@/utils/ceramic';
import { GET_SPACE_INSTALLED_DAPPS } from '../graphql/space';

export const getSpaceEventsQuery = (eventCount: number = 10) => `
      query GetSpaceEvents($id: ID!) {
        node(id: $id) {
          ...on ZucitySpace {
            id
            avatar
            banner
            description
            name
            profileId
            tagline
            website
            twitter
            telegram
            nostr
            lens
            github
            discord
            ens
            customAttributes {
              tbd
            }
            admins {
              id
            }
            superAdmin{
              id
              zucityProfile {
                id
                avatar
                author {
                  id
                }
                username
              }
            }
            events(first: ${eventCount}) {
              edges {
                node {
                  createdAt
                  description
                  endTime
                  externalUrl
                  gated
                  id
                  imageUrl
                  maxParticipant
                  meetingUrl
                  minParticipant
                  participantCount
                  profileId
                  spaceId
                  startTime
                  status
                  tagline
                  timezone
                  title
                  space {
                    name
                    avatar
                  }
                }
              }
            }
          }
        }
      }
      `;

export const getSpacesQuery = `
      query GetSpaces {
        zucitySpaceIndex(first: 30) {
          edges {
            node {
              admins {
                id
              }
              avatar
              banner
              category
              description
              discord
              ens
              gated
              github
              id
              lens
              name
              nostr
              superAdmin {
                id
              }
              admins {
                id
              }
              members {
                id
              }
              tagline
              telegram
              twitter
              website
              customAttributes {
                tbd
              }
            }
          }
        }
      }
      `;

export const getSpaceInstalledDapps = async (
  appId: string,
): Promise<{
  id: string;
  installedSpaces: string[] | null;
}> => {
  const dappResponse: any = await executeQuery(GET_SPACE_INSTALLED_DAPPS, {
    id: appId,
  });

  return dappResponse.data.node;
};
