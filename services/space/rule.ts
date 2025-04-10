import axiosInstance from '@/utils/axiosInstance';

export const createRule = async (rule: any) => {
  return axiosInstance.post('/api/space/rule/create', {
    ...rule,
  });
};

export const deleteRule = async (rule: any) => {
  return axiosInstance.post('/api/space/rule/delete', {
    ...rule,
  });
};

export const updateRule = async (rule: any) => {
  return axiosInstance.post('/api/space/rule/update', {
    ...rule,
  });
};
