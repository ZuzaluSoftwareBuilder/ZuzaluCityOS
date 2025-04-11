import { ZuButton } from '@/components/core';
import { PlusCircleIcon, XMarkIcon } from '@/components/icons';
import { useMediaQuery } from '@/hooks';
import { Box, CircularProgress } from '@mui/material';

interface IProps {
  confirmText: string;
  disabled: boolean;
  isLoading?: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

export default function FormFooter({
  confirmText,
  disabled,
  isLoading,
  handleClose,
  handleConfirm,
}: IProps) {
  const { isMobile } = useMediaQuery();
  return (
    <Box display="flex" gap="20px" flexDirection={isMobile ? 'column' : 'row'}>
      <ZuButton
        sx={{
          flex: 1,
          width: isMobile ? '100%' : 'auto',
          height: '40px',
        }}
        disabled={disabled || isLoading}
        startIcon={<XMarkIcon />}
        onClick={handleClose}
      >
        Discard
      </ZuButton>
      <ZuButton
        sx={{
          color: '#67DBFF',
          backgroundColor: 'rgba(103, 219, 255, 0.10)',
          flex: 1,
          width: isMobile ? '100%' : 'auto',
          height: '40px',
        }}
        startIcon={!isLoading ? <PlusCircleIcon color="#67DBFF" /> : null}
        disabled={disabled || isLoading}
        onClick={handleConfirm}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          confirmText
        )}
      </ZuButton>
    </Box>
  );
}
