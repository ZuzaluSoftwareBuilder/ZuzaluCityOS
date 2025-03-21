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
