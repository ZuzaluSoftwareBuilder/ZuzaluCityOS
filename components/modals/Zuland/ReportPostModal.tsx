'use client';

import { FlagIcon } from '@/components/icons';
import { useState } from 'react';

import { Box, Chip, Typography } from '@mui/material';

import { ZuButton } from '@/components/core';
import { Modal } from '@mui/material';

interface ReportPostModalProps {
  openReportModal: boolean;
  setOpenReportModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReportPostModal = ({
  openReportModal,
  setOpenReportModal,
}: ReportPostModalProps) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const reportReasons = [
    'Harassment',
    'Fraud or scam',
    'Spam',
    'Misinformation',
    'Hateful speech',
    'Threat or violence',
    'Self harm',
    'Graphic content',
    'Sexual content',
    'Fake account',
    'Bot account',
  ];
  const handleCloseReportModal = () => setOpenReportModal(false);

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleReportUser = () => {
    if (selectedReason) {
      // Implement the report logic here
      console.log(`Reporting user for: ${selectedReason}`);
      handleCloseReportModal();
    }
  };

  return (
    <Modal
      open={openReportModal}
      onClose={handleCloseReportModal}
      aria-labelledby="report-modal-title"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.default',
          border: '2px solid #222222',
          borderRadius: '10px',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="report-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          Report this discussion
        </Typography>
        <Typography variant="body1" gutterBottom>
          Select a reason that applies
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {reportReasons.map((reason) => (
            <Chip
              key={reason}
              label={reason}
              onClick={() => handleReasonSelect(reason)}
              color={selectedReason === reason ? 'primary' : 'secondary'}
              sx={{
                m: 0.5,
                backgroundColor:
                  selectedReason === reason ? ' rgb(238, 75, 43)' : '',
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <ZuButton
            onClick={handleCloseReportModal}
            sx={{
              color: 'white',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '4px 20px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
            }}
          >
            Cancel
          </ZuButton>
          <ZuButton
            disabled={!selectedReason}
            onClick={handleReportUser}
            sx={{
              color: ' rgb(238, 75, 43)',
              borderRadius: '10px',
              border: '1px solid rgba(238, 75, 43, 0.2)',
              padding: '4px 20px',
              fontSize: '14px',
              fontWeight: '700',
              gap: '10px',
              '& > span': {
                margin: '0px',
              },
            }}
          >
            <FlagIcon size={4} />
            Report post
          </ZuButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReportPostModal;
