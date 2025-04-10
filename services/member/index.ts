import axiosInstance from '@/utils/axiosInstance';

export const getMembers = async (id: string, resource: string) => {
  const response = await axiosInstance.get('/api/member', {
    params: { id, resource },
  });
  return response.data;
};

export const addMembersToRole = async (
  resource: string,
  id: string,
  roleId: string,
  memberIds: string[],
) => {
  const requests = memberIds.map((userId) =>
    axiosInstance.post('/api/member/add', {
      id,
      resource,
      roleId,
      userId,
    }),
  );

  const responses = await Promise.all(requests);
  return responses.map((response) => response.data);
};

export const removeMembersFromRole = async (
  resource: string,
  id: string,
  memberIds: string[],
) => {
  const requests = memberIds.map((userId) =>
    axiosInstance.post('/api/member/remove', {
      id,
      resource,
      userId,
    }),
  );

  const responses = await Promise.all(requests);
  return responses.map((response) => response.data);
};

export const updateMembersRole = async (
  resource: string,
  id: string,
  roleId: string,
  memberIds: string[],
) => {
  const requests = memberIds.map((userId) =>
    axiosInstance.post('/api/member/update', {
      id,
      resource,
      roleId,
      userId,
    }),
  );

  const responses = await Promise.all(requests);
  return responses.map((response) => response.data);
};

export const followSpace = async (spaceId: string, userId: string) => {
  const response = await axiosInstance.post('/api/member/follow', {
    spaceId,
    userId,
  });
  return response.data;
};

export const unFollowSpace = async (spaceId: string, userId: string) => {
  const response = await axiosInstance.post('/api/member/unfollow', {
    spaceId,
    userId,
  });
  return response.data;
};

export const joinSpace = async ({
  id,
  roleId,
  userId,
}: {
  id: string;
  roleId: string;
  userId: string;
}) => {
  const response = await axiosInstance.post('/api/member/join', {
    id,
    resource: 'space',
    roleId,
    userId,
  });
  return response.data;
};
