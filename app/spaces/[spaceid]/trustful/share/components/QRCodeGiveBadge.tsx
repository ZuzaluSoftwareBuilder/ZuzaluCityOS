'use client';

import { useQRCode } from 'next-qrcode';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';

export const QRCodeGiveBadge = () => {
  const { Canvas } = useQRCode();
  const { address } = useAccount();
  const params = useParams();

  //TODO: Check if the link works in production development and it's redirecting to zuzalu page correctly.
  const isDev = process.env.NEXT_PUBLIC_ENV;
  const prefixToGiveBadge = `${isDev ? `http://localhost:3000/spaces/${params.spaceid}/trustful` : `https://www.zuzalu.city/spaces/${params.spaceid}/trustful`}`;
  const linkToGiveBadgeAddress = `${prefixToGiveBadge}?address=${address}`;

  return (
    <Canvas
      text={linkToGiveBadgeAddress}
      options={{
        errorCorrectionLevel: 'M',
        width: 250,
        color: {
          dark: '#F5FFFFDC',
          light: '#212223',
        },
      }}
    />
  );
};
