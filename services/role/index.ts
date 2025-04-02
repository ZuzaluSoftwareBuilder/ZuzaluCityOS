import { RolePermission } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const getRoles = async (resource: string, id: string) => {
  const response = await axiosInstance.get('/api/role', {
    params: {
      resource,
      id,
    },
  });
  return response.data as { data: RolePermission[] };
};
