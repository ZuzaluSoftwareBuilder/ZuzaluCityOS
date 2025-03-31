import { graphql } from '@/graphql/gql';

export const GET_INVITATIONS_QUERY = graphql(`
  query GetInvitation($resourceId: String) {
    zucityInvitationIndex(
      first: 100
      filters: { where: { resourceId: { equalTo: $resourceId } } }
    ) {
      edges {
        node {
          id
          resource
          resourceId
          inviterId {
            id
          }
          inviterProfile {
            id
            username
            address
            avatar
          }
          inviteeProfile {
            id
            username
            address
            avatar
          }
          isRead
          lastSentAt
          message
          roleId
          spaceId
          status
          updatedAt
          inviteeProfileId
          author {
            id
          }
          createdAt
          eventId
          expiresAt
          inviterProfileId
          customAttributes {
            tbd
          }
        }
      }
    }
  }
`);
