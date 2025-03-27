import { graphql } from '@/graphql/gql';

export const GET_DAPP_LIST_QUERY = graphql(`
  query GetDappList($first: Int = 100) {
    zucityDappInfoIndex(first: $first) {
      edges {
        node {
          id
          appName
          tagline
          developerName
          description
          bannerUrl
          categories
          devStatus
          openSource
          repositoryUrl
          appUrl
          websiteUrl
          docsUrl
          isInstallable
          appLogoUrl
          auditLogUrl
          isSCApp
          scAddresses {
            address
            chain
          }
          profile {
            author {
              id
            }
            avatar
            username
          }
        }
      }
    }
  }
`);

export const CREATE_DAPP_MUTATION = graphql(`
  mutation CreateZucityDappMutation($input: CreateZucityDappInfoInput!) {
    createZucityDappInfo(input: $input) {
      document {
        id
      }
    }
  }
`);

export const UPDATE_DAPP_MUTATION = graphql(`
  mutation UpdateZucityDappMutation($input: UpdateZucityDappInfoInput!) {
    updateZucityDappInfo(input: $input) {
      document {
        id
      }
    }
  }
`);
