import { ArrowPathIcon, CloseIcon } from '@/components/icons';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useQRCode } from 'next-qrcode';
import { useState } from 'react';

interface PropTypes {
  ticketAddress?: string;
  eventId?: string;
  onClose: () => void;
}

const QRCode = ({ ticketAddress, eventId, onClose }: PropTypes) => {
  const { Canvas } = useQRCode();
  const { username, profile } = useAbstractAuthContext();
  // TODO wait supabase update, confirm did usage of qrcode
  const authorId = profile?.did;

  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<string>('M');
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const refreshQRCode = () => {
    getRandomErrorCorrectionLevel();
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const getRandomErrorCorrectionLevel = () => {
    const levels = ['L', 'M', 'Q', 'H'];
    let clevel = levels[Math.floor(Math.random() * levels.length)];

    setIsRotated(true);
    setErrorCorrectionLevel(clevel);
    setTimeout(() => setIsRotated(false), 500);
  };

  const getQRCode = () => {
    const qrCode = {
      authorId,
      eventId,
      ticketAddress,
      createdAt: dayjs().unix(),
      nonce: Math.random().toString(36).substring(7),
    };
    return JSON.stringify(qrCode);
  };

  return (
    <Stack
      width="360px"
      padding="20px"
      borderRadius="10px"
      spacing="14px"
      border="2px solid var(--Hover-White, rgba(255, 255, 255, 0.10))"
      sx={{
        position: 'absolute',
        background: 'rgba(52, 52, 52, 0.80)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backdropFilter: 'blur(20px)',
        color: '#fff',
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ position: 'relative' }}>
        <Typography
          color="white"
          variant="subtitleSB"
          flex="1"
          textAlign="center"
        >
          QR Code
        </Typography>
        <Stack
          onClick={onClose}
          padding="10px"
          bgcolor="#414141"
          borderRadius="10px"
          color="white"
          sx={{ cursor: 'pointer', position: 'absolute', right: 0 }}
        >
          <CloseIcon size={5} />
        </Stack>
      </Stack>
      <Stack
        alignItems="center"
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          width: '316px',
          mt: '18px !important',
        }}
      >
        <Canvas
          text={getQRCode()}
          options={{
            errorCorrectionLevel: errorCorrectionLevel,
            margin: 1,
            scale: 4,
            width: 316,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          }}
          key={refreshKey}
        />
      </Stack>
      <Stack alignItems="center">
        <Stack
          onClick={refreshQRCode}
          sx={{ cursor: 'pointer' }}
          padding="10px"
          bgcolor="#3f3f3f"
          borderRadius="10px"
          width="fit-content"
        >
          <ArrowPathIcon />
        </Stack>
      </Stack>
      <Stack spacing="14px">
        <Stack spacing="10px">
          <Typography
            fontSize="18px"
            fontWeight={700}
            lineHeight={1.2}
            textAlign="center"
          >
            {username}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default QRCode;
