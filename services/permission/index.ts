import { Permission } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const getAllPermission = async () => {
  const response = await axiosInstance.get('/api/permission');
  return response.data as { data: Permission[] };
};
