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

export const getAssignableRoles = async (resourceType: string, resourceId: string) => {
  const response = await axiosInstance.get('/api/role/assignable', {
    params: {
      resource: resourceType,
      id: resourceId,
    },
  });
  return response.data as { data: RolePermission[] };
};
