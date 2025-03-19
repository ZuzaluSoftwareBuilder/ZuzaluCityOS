import axiosInstance from '@/utils/axiosInstance';

export const getMembers = async (id: string, resource: string) => {
  const response = await axiosInstance.get('/api/member', {
    params: { id, resource },
  });
  return response.data;
};
