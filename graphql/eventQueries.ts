/**
 * GraphQL query for fetching upcoming events
 * Parameters:
 * - startTime: The minimum start time for events (format: YYYY-MM-DDT00:00:00Z)
 */
export const UPCOMING_EVENTS_QUERY = `
  query GetUpcomingEvents($startTime: String!) {
    zucityEventIndex(
      filters: {
        where: {
          startTime: { greaterThanOrEqualTo: $startTime }
        }
      },
      first: 100
    ) {
      edges {
        node {
          createdAt
          description
          endTime
          externalUrl
          gated
          id
          imageUrl
          meetingUrl
          profileId
          spaceId
          startTime
          status
          tagline
          timezone
          title
          profile {
            username
            avatar
          }
          tracks
          space {
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query for fetching ongoing events
 * Parameters:
 * - referenceTime: The reference time point (format: YYYY-MM-DDT00:00:00Z)
 *   Events with start time <= reference time and end time >= reference time
 */
export const ONGOING_EVENTS_QUERY = `
  query GetOngoingEvents($referenceTime: String!) {
    zucityEventIndex(
      filters: {
        where: {
          startTime: { lessThanOrEqualTo: $referenceTime },
          endTime: { greaterThanOrEqualTo: $referenceTime }
        }
      },
      first: 100
    ) {
      edges {
        node {
          createdAt
          description
          endTime
          externalUrl
          gated
          id
          imageUrl
          meetingUrl
          profileId
          spaceId
          startTime
          status
          tagline
          timezone
          title
          profile {
            username
            avatar
          }
          space {
            name
          }
          tracks
        }
      }
    }
  }
`;

export const PAST_EVENTS_QUERY = `
  query PastEvents($endTime: String!) {
    zucityEventIndex(
      filters: { 
        where: { 
          endTime: { lessThan: $endTime } 
        } 
      }
      first: 100
    ) {
      edges {
        node {
          createdAt
          description
          endTime
          externalUrl
          gated
          id
          imageUrl
          meetingUrl
          profileId
          spaceId
          startTime
          status
          tagline
          timezone
          title
          profile {
            username
            avatar
          }
          tracks
          space {
            name
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query for fetching events
 */
export const EVENTS_QUERY = `
  query GetUserEvents {
    zucityEventIndex(first: 100) {
      edges {
        node {
          id
          imageUrl
          title
          members{
            id
          }
          admins{
            id
          }
          superAdmin{
            id
          }
          profile {
            username
            avatar
          }
          space {
            name
            avatar
          }
          tracks
        }
      }
    }
  }
`;
