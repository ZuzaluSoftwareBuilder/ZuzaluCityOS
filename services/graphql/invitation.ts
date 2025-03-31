import { graphql } from '@/graphql/gql';
import gql from 'graphql-tag';

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

export const GET_USER_INVITATION_QUERY = graphql(`
    query GetUserInvitation($userDid: String) {
      zucityInvitationIndex(
        first: 100
        filters: { where: { inviteeId: { equalTo: $userDid } } }
      ) {
        edges {
          node {
            id
          resource
          resourceId
          inviterId {
            id
          }
          inviteeId {
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
