import { graphql } from '@/graphql/gql';

export const GET_INVITATIONS_QUERY = graphql(`
  query GetSpaceInvitations($resourceId: String) {
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
          eventId
          event {
            id
            imageUrl
            title
          }
          spaceId
          space {
            id
            name
            avatar
          }
          status
          updatedAt
          inviteeProfileId
          author {
            id
          }
          createdAt
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
  query GetUserInvitations($inviteeId: String!) {
    zucityInvitationIndex(
      first: 100
      filters: { where: { inviteeId: { equalTo: $inviteeId } } }
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
          space {
            id
            name
          }
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

export const GET_INVITATION_BY_ID_QUERY = graphql(`
  query GetInvitationById($id: ID!) {
    node(id: $id) {
      ... on ZucityInvitation {
        id
        inviterId {
          id
        }
        inviteeId {
          id
        }
        resource
        resourceId
        roleId
        status
        message
        isRead
        inviteeProfileId
        inviterProfileId
        eventId
        event {
          id
          imageUrl
          title
        }
        spaceId
        space {
          id
          name
          avatar
        }
        createdAt
        expiresAt
        updatedAt
        lastSentAt
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
      }
    }
  }
`);

export const VALIDATE_ROLE_QUERY = graphql(`
  query ValidateRoleById($roleId: ID!, $resourceId: String!) {
    zucityRoleIndex(
      first: 1
      filters: { where: { resourceId: { equalTo: $resourceId } } }
    ) {
      edges {
        node {
          id
          name
          source
          color
          created_at
          updated_at
        }
      }
    }
  }
`);

export const VALIDATE_RESOURCE_ACCESS = graphql(`
  query ValidateUserResourceAccess(
    $userId: String!
    $resourceId: String!
    $source: String!
  ) {
    zucityUserRolesIndex(
      first: 1
      filters: {
        where: {
          userId: { equalTo: $userId }
          resourceId: { equalTo: $resourceId }
          source: { equalTo: $source }
        }
      }
    ) {
      edges {
        node {
          id
          roleId
          userId {
            id
          }
        }
      }
    }
  }
`);

export const CREATE_INVITATION_MUTATION = graphql(`
  mutation CreateZucityInvitation($input: CreateZucityInvitationInput!) {
    createZucityInvitation(input: $input) {
      document {
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
        space {
          id
          name
          avatar
        }
        status
        updatedAt
        inviteeProfileId
        author {
          id
        }
        createdAt
        eventId
        event {
          id
          imageUrl
          title
        }
        expiresAt
        inviterProfileId
        customAttributes {
          tbd
        }
      }
    }
  }
`);

export const UPDATE_INVITATION_MUTATION = graphql(`
  mutation UpdateZucityInvitation($input: UpdateZucityInvitationInput!) {
    updateZucityInvitation(input: $input) {
      document {
        id
        author {
          id
        }
        inviterId {
          id
        }
        inviteeId {
          id
        }
        resource
        resourceId
        roleId
        status
        message
        isRead
        inviterProfileId
        inviterProfile {
          id
          username
          avatar
        }
        inviteeProfileId
        inviteeProfile {
          id
          username
          avatar
        }
        createdAt
        expiresAt
        updatedAt
        lastSentAt
      }
    }
  }
`);

export const GET_UNREAD_INVITATION_COUNT = graphql(`
  query GetUnreadInvitationsCount($userId: String!) {
    zucityInvitationCount(
      filters: {
        where: { isRead: { equalTo: "false" }, inviteeId: { equalTo: $userId } }
      }
    )
  }
`);

export const MARK_INVITATION_READ = graphql(`
  mutation MarkInvitationAsRead($invitationId: ID!) {
    updateZucityInvitation(
      input: { id: $invitationId, content: { isRead: "true" } }
    ) {
      document {
        id
        isRead
      }
    }
  }
`);