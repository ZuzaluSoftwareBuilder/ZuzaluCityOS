import { graphql } from '@/graphql/gql';

export const GET_DAPP_LIST_QUERY = graphql(`
  query GetDappList {
    zucityDappInfoIndex(first: 100) {
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
