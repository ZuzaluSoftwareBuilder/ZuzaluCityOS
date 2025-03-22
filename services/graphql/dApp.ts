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
`).toString();
