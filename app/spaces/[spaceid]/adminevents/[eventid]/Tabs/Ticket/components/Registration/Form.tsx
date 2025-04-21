import FormHeader from '@/components/form/FormHeader';
import { isDev } from '@/constant';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import {
  createRegAndAccess,
  updateRegAndAccess,
} from '@/services/event/regAndAccess';
import {
  CreateRegAndAccessRequest,
  RegistrationAndAccess,
  UpdateRegAndAccessRequest,
} from '@/types';
import { getDidByAddress } from '@/utils/did';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mainnet, sepolia } from 'viem/chains';
import { useEventContext } from '../../../../EventContext';
import { useCreateEventId } from '../../hooks/useCreateEventId';
import { ConfigFormType, schema, TicketingMethod } from '../types';
import { StepFour, StepOne, StepThree, StepTwo } from './Step';

interface RegistrationMethodSelectorProps {
  regAndAccess?: RegistrationAndAccess;
  onClose: () => void;
  initialStep?: number;
}

const ConfigForm: React.FC<RegistrationMethodSelectorProps> = ({
  onClose,
  initialStep = 1,
  regAndAccess,
}) => {
  const [step, setStep] = useState(initialStep);

  const { event } = useEventContext();
  const { createEventID, isLoading: createEventIDLoading } = useCreateEventId({
    event: event!,
  });
  const queryClient = useQueryClient();
  const pathname = useParams();
  const formMethods = useForm({
    resolver: yupResolver(schema),
    values: regAndAccess
      ? {
          apply: regAndAccess.applyRule,
          options: regAndAccess.applyOption,
          access: regAndAccess.registrationAccess,
          pass: regAndAccess.ticketType,
        }
      : {},
  });
  const { profile } = useAbstractAuthContext();
  const pass = formMethods.watch('pass');
  // TODO wait supabase update, confirm profile.id of RegAndAccess
  const profileId = profile?.id || '';

  const eventId = pathname.eventid?.toString() ?? '';

  const createMutation = useMutation({
    mutationFn: (input: CreateRegAndAccessRequest) => {
      return createRegAndAccess(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      setStep(initialStep);
      formMethods.reset();
      onClose();
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: UpdateRegAndAccessRequest) => {
      return updateRegAndAccess(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
      setStep(initialStep);
      formMethods.reset();
      onClose();
    },
  });
  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    createEventIDLoading;

  const handleSubmit = useCallback(
    async (data: ConfigFormType) => {
      try {
        const { apply, options, whitelist, access, pass } = data;
        if (!regAndAccess?.id) {
          let scrollPassContractFactoryID;
          if (pass === TicketingMethod.ScrollPass) {
            const result = await createEventID();
            if (!result?.contractID) {
              throw new Error('Failed to create scroll pass contract');
            }
            scrollPassContractFactoryID = result?.contractID;
          }
          const registrationWhitelist =
            whitelist
              ?.split(',')
              .filter(Boolean)
              .map((address) =>
                getDidByAddress(
                  address.trim(),
                  isDev ? sepolia.id : mainnet.id,
                ),
              ) || undefined;
          createMutation.mutate({
            eventId,
            registrationWhitelist,
            applyOption: options || '',
            applyRule: apply!,
            registrationAccess: access!,
            ticketType: pass!,
            profileId,
            scrollPassContractFactoryID,
          });
        } else {
          let scrollPassContractFactoryID;
          if (
            pass === TicketingMethod.ScrollPass &&
            !regAndAccess?.scrollPassContractFactoryID
          ) {
            const result = await createEventID();
            if (!result?.contractID) {
              throw new Error('Failed to create scroll pass contract');
            }
            scrollPassContractFactoryID = result?.contractID;
          }
          updateMutation.mutate({
            eventId,
            id: regAndAccess!.id,
            type: 'method',
            applyOption: options || '',
            applyRule: apply || '',
            registrationAccess: access!,
            ticketType: pass!,
            scrollPassContractFactoryID,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      createEventID,
      createMutation,
      eventId,
      profileId,
      regAndAccess,
      updateMutation,
    ],
  );

  const handleStep = useCallback(
    (type: 'next' | 'back') => {
      if (type === 'back' && step === initialStep) {
        onClose();
        return;
      }
      if (type === 'next') {
        if (step === 4 || pass === TicketingMethod.LottoPGF) {
          formMethods.handleSubmit(handleSubmit)();
          return;
        }
      }
      setStep((v) => (type === 'next' ? v + 1 : v - 1));
    },
    [formMethods, handleSubmit, initialStep, onClose, pass, step],
  );

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Configure Passes" />
      <FormProvider {...formMethods}>
        {step === 1 ? (
          <StepOne
            handleClose={onClose}
            handleNext={() => handleStep('next')}
          />
        ) : step === 2 ? (
          <StepTwo
            isFirstStep={step === initialStep}
            isLoading={isLoading}
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        ) : step === 3 ? (
          <StepThree
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        ) : (
          <StepFour
            isLoading={isLoading}
            handleClose={() => handleStep('back')}
            handleNext={() => handleStep('next')}
          />
        )}
      </FormProvider>
    </Box>
  );
};

export default ConfigForm;
