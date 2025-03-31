import { Box, Stack } from '@mui/material';
import { TitleWithTag } from '../Common';
import { ZuButton } from '@/components/core';
import { PlusIcon } from '@/components/icons';
import useOpenDraw from '@/hooks/useOpenDraw';
import Drawer from '@/components/drawer';
import Form from './Form';
import Submissions from './Submissions';
import { RegistrationAndAccess } from '@/types';
import { useMemo } from 'react';
import { TagProps } from '../types';
import { useEventContext } from '../../../../EventContext';

interface PanelProps {
  regAndAccess?: RegistrationAndAccess;
}

export default function Panel({ regAndAccess }: PanelProps) {
  const { open, handleOpen, handleClose } = useOpenDraw();
  const { event } = useEventContext();

  const hasConfiged = !!regAndAccess?.applicationForm;
  const applicationForms = event?.applicationForms?.edges ?? [];

  const questions = useMemo(() => {
    if (!hasConfiged) return [''];
    try {
      return JSON.parse(regAndAccess!.applicationForm!).map(
        (q: { question: string }) => q.question,
      );
    } catch (error) {
      return [''];
    }
  }, [hasConfiged, regAndAccess]);

  const tags = useMemo(() => {
    const tags: TagProps[] = [
      {
        type: 'text',
        text: `Setting: ${regAndAccess?.applyRule}${
          regAndAccess?.applyOption ? `- ${regAndAccess?.applyOption}` : ''
        }`,
      },
    ];
    if (!hasConfiged) {
      tags.push({
        type: 'warning',
        text: 'Required to open event',
      });
    }
    return tags;
  }, [hasConfiged, regAndAccess?.applyOption, regAndAccess?.applyRule]);

  return (
    <Stack>
      <TitleWithTag
        tags={tags}
        title="Event Applications"
        desc="Add a series of questions for users to answer when they apply for your event"
        buttonText={hasConfiged ? 'Configure Questions' : undefined}
        required={!hasConfiged}
        onClick={handleOpen}
      />
      <Box>
        {hasConfiged ? (
          <Submissions
            regAndAccess={regAndAccess}
            questions={questions}
            list={applicationForms.map((form) => form.node)}
          />
        ) : (
          <ZuButton
            startIcon={<PlusIcon size={4} />}
            sx={{ mt: '20px', width: '100%', p: '10px', fontWeight: 600 }}
            onClick={handleOpen}
          >
            Create Registration Form
          </ZuButton>
        )}
      </Box>
      <Drawer open={open} onClose={handleClose} onOpen={handleOpen}>
        <Form
          questions={questions}
          onClose={handleClose}
          regAndAccess={regAndAccess}
        />
      </Drawer>
    </Stack>
  );
}
