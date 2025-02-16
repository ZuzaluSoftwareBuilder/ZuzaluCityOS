import axiosInstance from '@/utils/axiosInstance';

export const createDapp = async (dappInput: any) => {
  return axiosInstance.post('/api/dapp/create', dappInput);
};
