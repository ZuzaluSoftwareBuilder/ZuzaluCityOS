import { verifyPOAP } from '@/services/poap';
import { addToast } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const usePOAPVerify = () => {
  const { address } = useAccount();

  const { mutateAsync: verifyPOAPMutation, isPending } = useMutation({
    mutationFn: (poapId: number) => {
      return verifyPOAP(188484, address!);
    },
    onSuccess: (data) => {
      if (data.statusCode === 404) {
        addToast({
          title: 'POAP Verification Failed',
          description: 'Please change your wallet address',
          color: 'danger',
        });
      }
    },
  });

  return { verifyPOAPMutation, isPending };
};
