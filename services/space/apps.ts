import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

export type InstallDAppParams =
  | {
      spaceId: string;
      appId: string;
    }
  | {
      spaceId: string;
      nativeAppName: string;
    };
export const installDApp = async (installDAppInput: InstallDAppParams) => {
  try {
    const response = await axiosInstance.post('/api/space/dApp/install', {
      ...installDAppInput,
      id: installDAppInput.spaceId,
      resource: 'space',
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error('An unknown error occurred while installing dApp');
    }
  }
};

export type UninstallDAppParams = {
  spaceId: string;
  installedAppIndexId: string;
};
export const uninstallDApp = async (
  uninstallDAppInput: UninstallDAppParams,
) => {
  try {
    const response = await axiosInstance.post('/api/space/dApp/uninstall', {
      id: uninstallDAppInput.spaceId,
      resource: 'space',
      installedAppIndexId: uninstallDAppInput.installedAppIndexId,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error('An unknown error occurred while uninstalling dApp');
    }
  }
};

export const getInstalledDApps = async (spaceId: string) => {
  try {
    const response = await axiosInstance.get('/api/space/dApp', {
      params: {
        id: spaceId,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    } else {
      throw new Error(
        'An unknown error occurred while fetching installed dApps',
      );
    }
  }
};
