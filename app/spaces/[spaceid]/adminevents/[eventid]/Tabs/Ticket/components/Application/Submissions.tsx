import Dialog from '@/app/spaces/components/Modal/Dialog';
import { ZuButton } from '@/components/core';
import Draw from '@/components/drawer';
import { CheckIcon, XMarkIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import { updateApplicationForm } from '@/services/event/updateEvent';
import { ApplicationForm, RegistrationAndAccess } from '@/types';
import { Divider, Stack, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ConfigButton } from '../Common';
import ViewForm from './ViewForm';

interface ItemProps {
  data: ApplicationForm;
  isLast: boolean;
  handleOperate: (type: 'approve' | 'deny') => void;
  handleView: () => void;
}

const Item = ({ data, isLast, handleOperate, handleView }: ItemProps) => {
  const isOperated = data.approveStatus !== null;
  const isApproved = data.approveStatus === 'approved';

  return (
    <Stack spacing="10px">
      <Stack
        direction="row"
        spacing="40px"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack spacing="10px" direction="row" alignItems="center">
          <ZuButton sx={{ padding: '4px 10px' }} onClick={handleView}>
            View
          </ZuButton>
          <Typography
            fontSize={14}
            fontWeight={600}
            lineHeight={1.6}
            sx={{ opacity: 0.8 }}
          >
            {data.profile.username}&apos;s Application
          </Typography>
        </Stack>
        <Stack spacing="10px" direction="row" alignItems="center">
          {!isOperated ? (
            <>
              <ConfigButton onClick={() => handleOperate('approve')}>
                Approve
              </ConfigButton>
              <ConfigButton onClick={() => handleOperate('deny')}>
                Deny
              </ConfigButton>
            </>
          ) : (
            <Stack
              p="4px 10px"
              spacing="8px"
              direction="row"
              alignItems="center"
              borderRadius="8px"
              bgcolor={
                isApproved
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 94, 94, 0.10)'
              }
              color={isApproved ? '#7DFFD1' : '#FF5E5E'}
            >
              {isApproved ? (
                <CheckIcon size={4} />
              ) : (
                <XMarkIcon size={4} color="#FF5E5E" />
              )}
              <Typography fontSize={14} fontWeight={600} lineHeight={1.2}>
                {isApproved ? 'Approved' : 'Denied'}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      {!isLast && <Divider />}
    </Stack>
  );
};

interface SubmissionsProps {
  list: ApplicationForm[];
  questions: string[];
  regAndAccess?: RegistrationAndAccess;
}

export default function Submissions({
  regAndAccess,
  list = [],
  questions = [],
}: SubmissionsProps) {
  const pathname = useParams();
  const eventId = pathname.eventid?.toString() ?? '';

  const queryClient = useQueryClient();
  const { open, handleOpen, handleClose } = useOpenDraw();
  const [showDialog, setShowDialog] = useState(false);
  const [needApprove, setNeedApprove] = useState(false);
  const [currentApplication, setCurrentApplication] =
    useState<ApplicationForm>();

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; approveStatus: string }) =>
      updateApplicationForm(eventId, data.id, data.approveStatus),
    onSuccess: () => {
      setCurrentApplication(undefined);
      setNeedApprove(false);
      handleClose();
      handleDialog();
      queryClient.invalidateQueries({
        queryKey: ['fetchEventById'],
      });
    },
  });

  const handleDialog = useCallback(() => {
    setShowDialog((v) => !v);
  }, []);

  const handleOperate = useCallback(
    (type: 'approve' | 'deny', data: ApplicationForm) => {
      setCurrentApplication(data);
      setNeedApprove(type === 'approve');
      handleDialog();
    },
    [handleDialog],
  );

  const handleView = useCallback(
    (data: ApplicationForm) => {
      setCurrentApplication(data);
      handleOpen();
    },
    [handleOpen],
  );

  const handleConfirm = useCallback(() => {
    updateMutation.mutate({
      id: currentApplication!.id,
      approveStatus: needApprove ? 'approved' : 'denied',
    });
  }, [updateMutation, currentApplication, needApprove]);

  return (
    <>
      <Stack
        p="20px"
        mt="20px"
        spacing="20px"
        bgcolor="rgba(255, 255, 255, 0.02)"
        sx={{ borderRadius: '10px' }}
      >
        <Typography
          fontSize={16}
          fontWeight={600}
          lineHeight={1.2}
          sx={{ opacity: 0.8 }}
        >
          Application Submissions
        </Typography>
        <Stack spacing="10px">
          {list.length === 0 ? (
            <Typography fontSize={14} lineHeight={1.6} sx={{ opacity: 0.8 }}>
              No Submissions
            </Typography>
          ) : (
            list.map((item, index) => (
              <Item
                key={index}
                data={item}
                isLast={index === list.length - 1}
                handleOperate={(type) => handleOperate(type, item)}
                handleView={() => handleView(item)}
              />
            ))
          )}
        </Stack>
      </Stack>
      <Dialog
        title={needApprove ? 'Approve Applicant' : 'Deny Applicant'}
        message={
          needApprove
            ? 'Do you want to approve this applicant?'
            : 'Do you want to deny this applicant?'
        }
        confirmText="Confirm"
        showModal={showDialog}
        isLoading={updateMutation.isPending}
        onClose={handleDialog}
        onConfirm={handleConfirm}
      />
      <Draw open={open} onClose={handleClose} onOpen={handleOpen}>
        <ViewForm
          regAndAccess={regAndAccess}
          currentApplication={currentApplication}
          questions={questions}
          onClose={handleClose}
          handleOperate={(type) => handleOperate(type, currentApplication!)}
        />
      </Draw>
    </>
  );
}
