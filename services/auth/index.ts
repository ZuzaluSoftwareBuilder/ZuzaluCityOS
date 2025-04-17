import axiosInstance from '@/utils/axiosInstance';

export async function getNonce(address: string) {
  try {
    const { data } = await axiosInstance.post(`/api/auth/supabase/nonce`, {
      address,
    });
    return data.data?.nonce;
  } catch (error) {
    return '';
  }
}

export async function checkRegistration(address: string) {
  try {
    const { data } = await axiosInstance.get(
      `/api/auth/supabase/checkRegistration?address=${address}`,
    );
    return !!data.data?.registered;
  } catch (error) {
    return false;
  }
}

export interface IVerifyParams {
  address: string;
  message: string;
  signature: string;
  username?: string;
}

export async function verify(params: IVerifyParams) {
  try {
    const { data } = await axiosInstance.post(
      '/api/auth/supabase/verify',
      params,
    );
    return data.data as {
      isNewUser: boolean;
      token: string;
    };
  } catch (error: any) {
    throw new Error(error);
  }
}
