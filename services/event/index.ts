import { GET_SPACE_AND_EVENTS_QUERY_BY_ID } from '@/services/graphql/space';
import { composeClient } from '@/constant';

/**
 * 根据空间ID获取该空间下的所有事件
 * @param spaceId 空间ID
 */
export const getSpaceEvents = async (spaceId: string) => {
  try {
    if (!spaceId) {
      throw new Error('Space ID is required');
    }

    const result = await composeClient.executeQuery(GET_SPACE_AND_EVENTS_QUERY_BY_ID, {
      id: spaceId
    });

    if (result.errors) {
      throw new Error(result.errors.map((e: any) => e.message).join(', '));
    }

    const events = result.data?.node?.events?.edges.map((edge: any) => edge.node) || [];

    return {
      data: events,
      success: true
    };
  } catch (error: any) {
    console.error('Failed to get space events:', error);
    return {
      data: [],
      success: false,
      message: error.message || 'Failed to get space events'
    };
  }
}; 