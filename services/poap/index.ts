import axiosInstance from '@/utils/axiosInstance';

const getPOAPs = async ({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number;
  queryKey: readonly unknown[];
}) => {
  const [_, name] = queryKey;

  const response = await axiosInstance.get(
    `/api/poap?name=${name}&offset=${pageParam}`,
  );

  return response.data?.data;
};

const verifyPOAP = async (id: number, address: string) => {
  const response = await axiosInstance.get(`/api/poap/verify`, {
    params: {
      id,
      address,
    },
  });

  return response.data?.data;
};

export { getPOAPs, verifyPOAP };
