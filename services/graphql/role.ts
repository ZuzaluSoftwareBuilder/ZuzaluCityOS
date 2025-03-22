import { graphql } from '@/graphql/gql';

export const GET_MEMBERS_QUERY = graphql(`
  query GetMembers($source: String, $resourceId: String) {
    zucityUserRolesIndex(
      first: 1000
      filters: {
        where: {
          source: { equalTo: $source }
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
`).toString();

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
          userId {
            zucityProfile {
              avatar
              author {
                id
              }
            }
          }
        }
      }
    }
  }
`).toString();

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
`).toString();

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
`).toString();

export const UPDATE_ROLE_QUERY = graphql(`
  mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {
    updateZucityUserRoles(input: $input) {
      document {
        id
      }
    }
  }
`).toString();
