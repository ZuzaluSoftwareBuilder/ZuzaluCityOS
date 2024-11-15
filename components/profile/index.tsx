import {
  Dialog,
  useTheme,
  useMediaQuery,
  DialogTitle,
  IconButton,
  DialogContent,
  Stack,
  FormHelperText,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FormLabelDesc } from '../typography/formTypography';
import { Controller } from 'react-hook-form';
import FormUploader from '../form/FormUploader';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ZuInput } from '../core';
import { useCeramicContext } from '@/context/CeramicContext';
import ConfimButton from '../buttons/ConfimButton';
import { ArrowUpTrayIcon } from '../icons';
import { useMutation } from '@tanstack/react-query';

interface Props {
  showModal: boolean;
  onClose: () => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  imageUrl: Yup.string(),
});

type FormData = Yup.InferType<typeof schema>;

export default function Profile({ showModal, onClose }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { username, profile, composeClient, getProfile } = useCeramicContext();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { name, imageUrl } = data;
      await composeClient.executeQuery(`
        mutation {
          updateZucityProfile(input: {
            id: "${profile?.id}",
            content: {
              username: "${name}",
              avatar: "${imageUrl}"
            }
          }) {
            document {
              username
            }
          }
        }
      `);
    },
    onSuccess: () => {
      getProfile();
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    values: {
      name: username ?? '',
      imageUrl: profile?.avatar ?? '',
    },
  });

  const handleClick = async (data: FormData) => {
    await updateProfileMutation.mutateAsync(data);
  };

  if (!showModal) return null;

  return (
    <Dialog
      open={showModal}
      onClose={() => onClose?.()}
      PaperProps={{
        style: {
          width: isMobile ? '90%' : '640px',
          height: 'auto',
          padding: isMobile ? '10px 8px' : '20px',
          backgroundColor: 'rgba(34, 34, 34, 0.8)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: isMobile ? '10px' : '20px',
        },
      }}
    >
      <DialogTitle
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          fontSize: '20px',
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        Your Profile
        <IconButton
          onClick={onClose}
          style={{
            color: 'white',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            width: isMobile ? '25px' : '30px',
            height: isMobile ? '25px' : '30px',
            borderRadius: '10px',
          }}
        >
          <CloseIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ padding: 0, width: '100%', color: 'white' }}>
        <Stack spacing="20px">
          <Stack spacing="10px">
            <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
              Username
            </Typography>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <ZuInput {...field} error={!!error} />
                  {error && (
                    <FormHelperText error>{error.message}</FormHelperText>
                  )}
                </>
              )}
            />
          </Stack>
          <Stack spacing="10px">
            <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
              Your Avatar
            </Typography>
            <FormLabelDesc>
              Recommend min of 200x200px (1:1 Ratio)
            </FormLabelDesc>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <FormUploader
                  {...field}
                  previewStyle={{
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                  }}
                />
              )}
            />
          </Stack>
          <ConfimButton
            disabled={!isDirty}
            loading={updateProfileMutation.isPending}
            startIcon={<ArrowUpTrayIcon size={5} />}
            onClick={handleSubmit(handleClick)}
          >
            Save Changes
          </ConfimButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
