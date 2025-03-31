import { graphql } from '@/graphql/gql';

// 获取空间邀请列表的查询
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

const GET_INVITATION_QUERY_BY_ID = graphql(`
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
        spaceId
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

// 获取用户收到的邀请列表的查询
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

// 根据ID获取邀请详情的查询
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
        spaceId
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

// 验证角色的查询
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

// 验证资源访问权限的查询
export const VALIDATE_RESOURCE_ACCESS = graphql(`
  query ValidateUserResourceAccess($userId: String!, $resourceId: String!, $source: String!) {
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

// 创建邀请的mutation
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
`);

// 更新邀请的mutation
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
