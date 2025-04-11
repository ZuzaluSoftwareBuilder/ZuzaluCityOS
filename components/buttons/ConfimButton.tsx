import {
  CircularProgress,
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from '@mui/material';

interface ConfirmButtonProps extends MuiButtonProps {
  loading?: boolean;
}

export default function ConfimButton({
  loading,
  ...props
}: ConfirmButtonProps) {
  return (
    <MuiButton
      {...props}
      disabled={loading || props.disabled}
      startIcon={!loading && props.startIcon}
      sx={{
        p: '8px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(103, 219, 255, 0.20)',
        background: 'rgba(103, 219, 255, 0.10)',
        fontSize: '14px',
        fontWeight: 600,
        color: '#67DBFF',
        lineHeight: 1.6,
        height: '38px',
        '&.Mui-disabled': {
          color: '#67DBFF',
        },
        ...props.sx,
      }}
    >
      {loading ? (
        <CircularProgress
          size={20}
          sx={{
            color: 'inherit',
          }}
        />
      ) : (
        props.children
      )}
    </MuiButton>
  );
}
