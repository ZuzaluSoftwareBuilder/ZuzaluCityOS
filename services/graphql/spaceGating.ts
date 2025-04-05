import { graphql } from "@/graphql";

export const CREATE_SPACE_GATING_RULE = graphql(`
  mutation CreateSpaceGatingRule($input: CreateZucitySpaceGatingInput!) {
    createZucitySpaceGating(input: $input) {
      document {
        id
        spaceId
        poapsId {
          poapId
        }
        zuPassInfo {
          registration
          eventId
          eventName
        }
      }
    } 
  }
`);

export const UPDATE_SPACE_GATING_RULE = graphql(`
  mutation UpdateSpaceGatingRule($input: UpdateZucitySpaceGatingInput!) {
    updateZucitySpaceGating(input: $input) {
      document {
        id
      }
    }
  }
`);

export const DELETE_SPACE_GATING_RULE = graphql(`
  mutation DeleteSpaceGatingRule($input: EnableIndexingZucitySpaceGatingInput!) {
    enableIndexingZucitySpaceGating(input: $input) {
      document {
        id
      }
    }
  }
`);