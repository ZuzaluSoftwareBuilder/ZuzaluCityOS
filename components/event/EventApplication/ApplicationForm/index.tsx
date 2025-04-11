import { RightArrowIcon } from '@/components/icons';
import { createApplicationForm } from '@/services/event/createApplicationForm';
import { Event } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface ApplicationFormProps {
  setIsApplicationStep: React.Dispatch<React.SetStateAction<boolean>>;
  event: Event;
  handleClose: () => void;
  setIsApplicationSubmitStep: React.Dispatch<React.SetStateAction<boolean>>;
  profileId: string;
}

interface FormData {
  selectedTicket: string;
  address: string;
  [key: string]: string;
}

interface QuestionItem {
  question: string;
  type: string;
}

const schema = yup.object().shape({
  selectedTicket: yup.string().required('Please select a ticket type'),
  address: yup
    .string()
    .required('Please enter your receiving address')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Please enter a valid EVM address'),
});

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  event,
  handleClose,
  profileId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      interface JsonDataItem {
        'selected ticket'?: string;
        'receiving address'?: string;
        answer?: string;
        type: string;
      }

      const jsonData: JsonDataItem[] = [
        {
          'selected ticket': data.selectedTicket,
          type: 'required',
        },
        {
          'receiving address': data.address,
          type: 'required',
        },
      ];

      Object.keys(data).forEach((key) => {
        if (key !== 'selectedTicket' && key !== 'address') {
          jsonData.push({
            answer: data[key],
            type: 'input',
          });
        }
      });
      const response = await createApplicationForm({
        eventId: event.id,
        profileId: profileId,
        answers: JSON.stringify(jsonData),
      });
      console.log(response);
      handleClose();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack padding={2.5} spacing={2.5} bgcolor="#262626" height="auto">
      <Stack spacing={1.25}>
        <Typography
          fontSize="20px"
          fontWeight={700}
          lineHeight={1.2}
          sx={{ opacity: 0.7 }}
        >
          Submit Application
        </Typography>
        <Typography
          fontSize="14px"
          fontWeight={600}
          lineHeight={1.6}
          sx={{ opacity: 0.8 }}
        >
          Fill out the below form to submit to the event for approval
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          padding={2.5}
          spacing={2.5}
          height="auto"
          border="1px solid rgba(255, 255, 255, 0.10)"
          bgcolor="rgba(255, 255, 255, 0.02)"
          borderRadius="10px"
        >
          <Stack spacing={1.25}>
            <Typography fontSize="16px" fontWeight={700} lineHeight={1.2}>
              You are selecting:
            </Typography>
            <Accordion
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.02)',
                mt: '10px !important',
                mb: '0 !important',
              }}
              defaultExpanded
            >
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon sx={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ minHeight: '64px' }}
              >
                <Typography fontSize="14px" fontWeight={600}>
                  Click to expand to view ticket types
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <RadioGroup>
                  {event.regAndAccess?.edges?.[0]?.node.scrollPassTickets?.map(
                    (contract, index) => (
                      <FormControlLabel
                        key={index}
                        value={contract.name}
                        control={<Radio {...register('selectedTicket')} />}
                        sx={{ marginBottom: 2 }}
                        label={
                          <Stack>
                            <Typography fontSize="14px" fontWeight={600}>
                              {contract.name}
                            </Typography>
                            <Typography fontSize="12px">
                              Description: {contract.description}
                            </Typography>
                            <Typography fontSize="12px">
                              Price: {contract.price} {contract.tokenType}
                            </Typography>
                          </Stack>
                        }
                      />
                    ),
                  )}
                </RadioGroup>
              </AccordionDetails>
            </Accordion>
            {errors.selectedTicket && (
              <Typography color="error">
                {errors.selectedTicket.message}
              </Typography>
            )}
            <Stack spacing={1.25}>
              <Stack
                spacing={2}
                sx={{
                  width: '100%',
                  paddingTop: 1.25,
                  paddingBottom: 2.5,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                <Stack spacing={1.25}>
                  <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                    Receiving Address
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    lineHeight={1.2}
                    sx={{ opacity: 0.8 }}
                  >
                    This will be the address to assign tickets to
                  </Typography>
                </Stack>
                <Stack spacing={1.25}>
                  <TextField
                    fullWidth
                    placeholder="Copy and paste your address here"
                    variant="outlined"
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Stack>
                <Typography
                  fontSize={13}
                  fontWeight={400}
                  color="#FF9C66"
                  sx={{ opacity: 0.8, letterSpacing: 0.13 }}
                >
                  Note: Once approved, this address will be used to create an
                  account on Zuzalu.city and to verify in the event.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack spacing="20px">
            {JSON.parse(
              event.regAndAccess?.edges?.[0]?.node.applicationForm ?? '',
            ).map((item: QuestionItem, index: number) => (
              <Stack key={index} spacing="10px" width="100%">
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: '1.2',
                  }}
                >
                  {item.question}
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Enter your answer here"
                  variant="outlined"
                  {...register(`question_${index}`)}
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Typography
          sx={{
            width: '100%',
            color: '#FF9C66',
            fontSize: 13,
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: '18.20px',
            letterSpacing: 0.13,
            wordWrap: 'break-word',
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          Privacy reminder: The organizer of this event will see your address,
          your tickets, and their address on the public blockchain. Using a
          Zuzalu ZK-enabled passport, verifier, or anyone scanning your ticket
          will not be able to see your personal address.
        </Typography>
        <Button
          type="submit"
          sx={{
            color: '#67DBFF',
            borderRadius: '10px',
            backgroundColor: 'rgba(103, 219, 255, 0.10)',
            fontSize: '14px',
            padding: '6px 16px',
            border: '1px solid rgba(103, 219, 255, 0.20)',
            flex: 1,
            height: '42px',
            width: '100%',
          }}
          onClick={handleSubmit(onSubmit)}
          startIcon={
            !isLoading ? <RightArrowIcon size={5} color="#67DBFF" /> : null
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Stack>
  );
};
