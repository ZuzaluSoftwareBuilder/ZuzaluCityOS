import FormHeader from '@/components/form/FormHeader';
import { CheckIcon, XMarkIcon } from '@/components/icons';
import { ApplicationForm, RegistrationAndAccess } from '@/types';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { CommonWrapper } from '../Common';
import { TicketingMethod } from '../types';

interface ViewFormProps {
  regAndAccess?: RegistrationAndAccess;
  currentApplication?: ApplicationForm;
  onClose: () => void;
  questions: string[];
  handleOperate: (type: 'approve' | 'deny') => void;
}

interface Answer {
  answer: string;
  ['selected ticket']: string;
  ['receiving address']: string;
  ['applicant email']: string;
}

export default function ViewForm({
  regAndAccess,
  currentApplication,
  questions,
  onClose,
  handleOperate,
}: ViewFormProps) {
  const answers: Answer[] = JSON.parse(currentApplication?.answers || '[]');
  const isOperated = currentApplication?.approveStatus !== null;
  const isApproved = currentApplication?.approveStatus === 'approved';

  const finalQuestions = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      return ['Selected Ticket', 'Receiving Address', ...questions];
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      return ['Applicant Email', ...questions];
    }
    return questions;
  }, [questions, regAndAccess?.ticketType]);

  const finalAnswer = useMemo(() => {
    if (regAndAccess?.ticketType === TicketingMethod.ScrollPass) {
      return [
        answers?.[0]?.['selected ticket'],
        answers?.[1]?.['receiving address'],
        ...answers.map((item) => item.answer).filter(Boolean),
      ];
    }
    if (regAndAccess?.ticketType === TicketingMethod.ZuPass) {
      return [
        answers?.[0]?.['applicant email'],
        ...answers.map((item) => item.answer).filter(Boolean),
      ];
    }
    return answers.map((item: any) => item.answer);
  }, [answers, regAndAccess?.ticketType]);

  if (!currentApplication) return null;

  return (
    <Box>
      <FormHeader handleClose={onClose} title="Application Submission" />
      <Stack padding="20px" spacing="20px">
        <Stack spacing="10px">
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Manage Submission
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            {currentApplication.profile.username}&apos;s Application
          </Typography>
        </Stack>
        {!isOperated ? (
          <Stack gap="20px" direction="row">
            <Button
              sx={{
                color: '#FF5E5E',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 94, 94, 0.05)',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid rgba(255, 94, 94, 0.20)',
                flex: 1,
              }}
              startIcon={<XMarkIcon size={5} color="#FF5E5E" />}
              onClick={() => handleOperate('deny')}
            >
              Deny Applicant
            </Button>
            <Button
              sx={{
                color: '#7DFFD1',
                borderRadius: '10px',
                backgroundColor: 'rgba(125, 255, 209, 0.10)',
                fontSize: '14px',
                padding: '6px 16px',
                border: '1px solid rgba(125, 255, 209, 0.20)',
                flex: 1,
              }}
              startIcon={<CheckIcon size={5} />}
              onClick={() => handleOperate('approve')}
            >
              Approve Applicant
            </Button>
          </Stack>
        ) : (
          <Stack spacing="10px">
            <Divider />
            <Typography
              fontSize={14}
              fontWeight={600}
              lineHeight={1.6}
              sx={{ opacity: 0.8 }}
              color={isApproved ? '#7DFFD1' : '#FF5E5E'}
            >
              This applicant&apos;s submission was{' '}
              {isApproved ? 'approved' : 'denied'}
            </Typography>
            {!isApproved && (
              <Stack spacing="20px" direction="row" alignItems="center">
                <Typography
                  fontSize={14}
                  lineHeight={1.6}
                  sx={{ opacity: 0.8 }}
                >
                  Do you want to approve this submission?
                </Typography>
                <Button
                  variant="text"
                  startIcon={<CheckIcon size={5} />}
                  sx={{
                    p: '4px 8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    lineHeight: 1.2,
                    '& > .MuiButton-startIcon': {
                      marginRight: '5px',
                    },
                    color: '#7DFFD1',
                    borderRadius: '10px',
                    border: '1px solid rgba(125, 255, 209, 0.20)',
                  }}
                  onClick={() => handleOperate('approve')}
                >
                  Approve Submission
                </Button>
              </Stack>
            )}
          </Stack>
        )}
        <CommonWrapper>
          <Typography
            fontSize={20}
            fontWeight={700}
            lineHeight={1.2}
            sx={{ opacity: 0.7 }}
          >
            Answers
          </Typography>
          {finalQuestions.map((question, index) => (
            <Stack key={index} spacing="10px">
              <Typography fontSize={16} fontWeight={700} lineHeight={1.2}>
                {question}
              </Typography>
              <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
                {finalAnswer[index]}
              </Typography>
            </Stack>
          ))}
        </CommonWrapper>
      </Stack>
    </Box>
  );
}
