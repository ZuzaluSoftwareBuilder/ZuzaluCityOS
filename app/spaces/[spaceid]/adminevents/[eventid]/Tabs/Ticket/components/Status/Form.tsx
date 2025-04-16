import Dialog from '@/app/spaces/components/Modal/Dialog';
import { ZuButton } from '@/components/core';
import FormHeader from '@/components/form/FormHeader';
import {
  ArrowTopRightSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  Square2StackIcon,
  XCricleIcon,
  XMarkIcon,
} from '@/components/icons';
import { formatAddressString } from '@/components/layout/Header/UserProfileSection';
import { isDev } from '@/constant';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { updateRegAndAccess } from '@/services/event/regAndAccess';
import { RegistrationAndAccess } from '@/types';
import { getWalletAddressFromDid } from '@/utils/did';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import * as yup from 'yup';
import { ButtonGroup, CommonWrapper } from '../Common';

interface FormProps {
  regAndAccess?: RegistrationAndAccess;
  onClose: () => void;
}

const schema = yup.object().shape({
  addresses: yup.array().of(
    yup.object().shape({
      address: yup
        .string()
        .required('Address is required')
        .test('is-ethereum-address', 'Invalid EVM address', (value) => {
          return value ? isAddress(value) : false;
        }),
    }),
  ),
  whitelist: yup.array().of(
    yup.object().shape({
      address: yup.string(),
    }),
  ),
});

export default function Form({ regAndAccess, onClose }: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    values: {
      addresses: [{ address: '' }],
      whitelist:
        regAndAccess?.registrationWhitelist?.map((q) => ({
          address: getWalletAddressFromDid(q.id),
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });
  const { fields: whitelistFields, remove: whitelistRemove } = useFieldArray({
    control,
    name: 'whitelist',
  });

  const queryClient = useQueryClient();
  const pathname = useParams();
  const { profile } = useAbstractAuthContext();
  const profileId = profile?.id || '';
  const eventId = pathname.eventid?.toString() ?? '';

  const [openTips, setOpenTips] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(-1);

  const updateMutation = useMutation({
    mutationFn: updateRegAndAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      setOpenTips(false);
      reset();
      onClose();
    },
  });
  const isLoading = updateMutation.isPending;

  const onSubmit = useCallback(
    (data: yup.InferType<typeof schema>) => {
      const registrationWhitelist = data.addresses
        ?.map((q) => q.address)
        .concat(whitelistFields.map((v) => v.address || ''))
        .filter(Boolean)
        .map(
          (address) =>
            `did:pkh:eip155:${isDev ? sepolia.id : mainnet.id}:${address}`,
        );
      updateMutation.mutate({
        type: 'whitelist',
        id: regAndAccess!.id,
        registrationWhitelist,
        profileId,
        eventId,
      });
    },
    [whitelistFields, updateMutation, regAndAccess, profileId, eventId],
  );

  const handleDialog = useCallback(() => {
    setShowDialog((v) => !v);
  }, []);

  const handleClick = useCallback(
    (index: number) => {
      setRemoveIndex(index);
      handleDialog();
    },
    [handleDialog, setRemoveIndex],
  );

  const handleConfirm = useCallback(async () => {
    whitelistRemove(removeIndex);
    handleDialog();
    const registrationWhitelist = whitelistFields
      ?.map((q) => q.address)
      .filter(Boolean)
      .filter((v, index) => index !== removeIndex)
      .map(
        (address) =>
          `did:pkh:eip155:${isDev ? sepolia.id : mainnet.id}:${address}`,
      );
    queryClient.cancelQueries({
      queryKey: ['fetchEventById'],
    });
    await updateRegAndAccess({
      type: 'whitelist',
      id: regAndAccess!.id,
      registrationWhitelist,
      profileId,
      eventId,
    });
    queryClient.invalidateQueries({
      queryKey: ['fetchEventById'],
    });
  }, [
    eventId,
    handleDialog,
    profileId,
    queryClient,
    regAndAccess,
    removeIndex,
    whitelistFields,
    whitelistRemove,
  ]);

  return (
    <>
      <Dialog
        title="De-list Address?"
        message="Confirm Action"
        confirmText="Confirm"
        showModal={showDialog}
        onClose={handleDialog}
        onConfirm={handleConfirm}
      />
      <Box>
        <FormHeader handleClose={onClose} title="Application Form" />
        <Stack padding="20px" spacing="20px">
          <Stack spacing="10px">
            <Typography fontSize={20} fontWeight={700} lineHeight={1.2}>
              Configure Whitelist
            </Typography>
            <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: 0.6 }}>
              Add user addresses to be whitelisted to register to this event
            </Typography>
          </Stack>
          <CommonWrapper>
            <Stack
              p="5px 10px"
              bgcolor="rgba(255, 255, 255, 0.02)"
              borderRadius="5px"
              spacing="10px"
              direction="row"
              alignItems="center"
            >
              <Typography fontSize={13} lineHeight={1.4} sx={{ opacity: 0.8 }}>
                Total Whitelisted Addresses:
              </Typography>
              <Typography fontSize={14} fontWeight={600} lineHeight={1.6}>
                {whitelistFields.length || 0}
              </Typography>
            </Stack>
            <Stack spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                Whitelist Addresses
              </Typography>
              <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
                Input addresses of individuals to directly gain access to
                register.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Stack key={field.id} spacing="10px">
                  <Stack direction="row" spacing="10px" alignItems="center">
                    <Controller
                      name={`addresses.${index}.address`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          placeholder="0x..."
                          fullWidth
                          error={!!errors.addresses?.[index]?.address}
                          helperText={
                            errors.addresses?.[index]?.address?.message
                          }
                        />
                      )}
                    />
                    <IconButton onClick={() => remove(index)}>
                      <XCricleIcon size={6} color="rgba(255, 255, 255, 0.5)" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
              <ZuButton
                startIcon={<PlusIcon size={4} />}
                sx={{ width: '100%', p: '10px', fontWeight: 600 }}
                onClick={() => append({ address: '' })}
              >
                Add Address
              </ZuButton>
            </Stack>
            {whitelistFields.length > 0 && (
              <Stack
                p="10px 20px"
                borderRadius="10px"
                border="1px solid rgba(255, 255, 255, 0.10)"
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  onClick={() => setOpenTips(!openTips)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography>
                    View existing list of addresses added{' '}
                  </Typography>
                  {openTips ? (
                    <ChevronDownIcon size={4.5} />
                  ) : (
                    <ChevronUpIcon size={4.5} />
                  )}
                </Stack>
                <Collapse in={openTips}>
                  <Divider sx={{ mt: '10px' }} />
                  <Stack mt="20px" spacing={2}>
                    {whitelistFields.map((field, index) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        key={field.id}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing="10px"
                        >
                          <Typography
                            fontSize={16}
                            fontWeight={600}
                            lineHeight={1.2}
                            sx={{ opacity: 0.8 }}
                          >
                            {formatAddressString(field.address)}
                          </Typography>
                          <CopyToClipboard text={field.address || ''}>
                            <IconButton
                              sx={{ p: 0, color: 'rgba(255, 255, 255, 0.5)' }}
                            >
                              <Square2StackIcon size={4.5} />
                            </IconButton>
                          </CopyToClipboard>

                          <IconButton
                            sx={{
                              p: 0,
                              color: 'rgba(255, 255, 255, 0.5)',
                              position: 'relative',
                              top: '-1px',
                            }}
                            onClick={() => {
                              window.open(
                                `https://scrollscan.com/address/${field.address}`,
                                '_blank',
                              );
                            }}
                          >
                            <ArrowTopRightSquareIcon size={4.5} />
                          </IconButton>
                        </Stack>
                        <ZuButton
                          startIcon={<XMarkIcon size={4} color="#FF5E5E" />}
                          sx={{
                            bgcolor: 'rgba(255, 94, 94, 0.10)',
                            color: '#FF5E5E',
                            p: '4px 10px',
                          }}
                          onClick={() => handleClick(index)}
                        >
                          De-List
                        </ZuButton>
                      </Stack>
                    ))}
                  </Stack>
                </Collapse>
              </Stack>
            )}
          </CommonWrapper>
          <ButtonGroup
            isBackButton={false}
            isConfirmButton
            isLoading={isLoading}
            handleNext={handleSubmit(onSubmit)}
            handleBack={onClose}
          />
        </Stack>
      </Box>
    </>
  );
}
