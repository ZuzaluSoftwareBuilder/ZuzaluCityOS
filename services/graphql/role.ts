import { graphql } from '@/graphql/gql';

export const GET_SPACE_MEMBERS_QUERY = graphql(`
  query GetSpaceMembers($resourceId: String) {
    zucityUserRolesIndex(
      first: 1000
      filters: {
        where: {
          source: { equalTo: "space" }
          resourceId: { equalTo: $resourceId }
        }
      }
    ) {
      edges {
        node {
          roleId
          customAttributes {
            tbd
          }
          userId {
            zucityProfile {
              avatar
              username
              author {
                id
              }
            }
          }
        }
      }
    }
  }
`);

export const CHECK_EXISTING_ROLE_QUERY = graphql(`
  query GetUserRole($userId: String, $resourceId: String, $resource: String) {
    zucityUserRolesIndex(
      first: 1
      filters: {
        where: {
          userId: { equalTo: $userId }
          resourceId: { equalTo: $resourceId }
          source: { equalTo: $resource }
        }
      }
    ) {
      edges {
        node {
          roleId
        }
      }
    }
  }
`);

export const CREATE_ROLE_QUERY = graphql(`
  mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {
    createZucityUserRoles(input: $input) {
      document {
        userId {
          id
        }
        created_at
        updated_at
        resourceId
        source
        roleId
      }
    }
  }
`);

export const DELETE_ROLE_QUERY = graphql(`
  mutation enableIndexingZucityUserRoles(
    $input: EnableIndexingZucityUserRolesInput!
  ) {
    enableIndexingZucityUserRoles(input: $input) {
      document {
        id
      }
    }
  }
`);

export const UPDATE_ROLE_QUERY = graphql(`
  mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {
    updateZucityUserRoles(input: $input) {
      document {
        id
      }
    }
  }
`);
