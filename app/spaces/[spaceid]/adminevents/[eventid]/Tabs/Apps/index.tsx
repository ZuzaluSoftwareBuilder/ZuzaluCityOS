'use client';
import React from 'react';
import { Stack, Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Event } from '@/types';
import { ZuButton } from '@/components/core';
import { useDialog } from '@/components/dialog/DialogContext';
import { createZulandAppRelease } from '@/utils/akasha';
import { createApp } from '@/utils/akasha/app';
import { getAppByEventId } from '@/utils/akasha';
import { apps } from '@/constant';
interface IVenue {
  event?: Event;
}
interface PropTypes {
  event?: Event;
}
const Home = ({ event }: PropTypes) => {
  const { breakpoints } = useTheme();
  const params = useParams();
  const eventId = params.eventid.toString();
  const { showDialog, hideDialog } = useDialog();
  const handleCreateDiscussion = async () => {
    /*if (nftGated && (!contractAddress || !isAddress(contractAddress))) {
      showDialog({
        title: 'Error',
        message: 'Please enter a valid contract address',
        onConfirm: () => {
          hideDialog();
        },
      });
      return;
    }
    if (nftGated && (!functionName || !comparator || !comparisonValue)) {
      showDialog({
        title: 'Error',
        message: 'Please enter valid contract details',
        onConfirm: () => {
          hideDialog();
        },
      });
      return;
    }
    if (!chainName) {
      showDialog({
        title: 'Error',
        message: 'Please select a chain',
        onConfirm: () => {
          hideDialog();
        },
      });
      return;
    }
    if (!displayName) {
      showDialog({
        title: 'Error',
        message: 'Please enter a display name',
        onConfirm: () => {
          hideDialog();
        },
      });
      return;
    }

    try {
      const appAlreadyExists = await getAppByEventId(eventId);
      if (appAlreadyExists) {
        console.log('app already exists');
        return;
      }
      
      if (currentAkashaUser) {
        const createAppResult = await createApp({
          eventID: eventId,
          displayName: displayName,
          description: description,
        });
        if (createAppResult) {
          await createZulandAppRelease({
            applicationID: createAppResult?.document.id,
            version: '0.0.2',
            source: `https://zuzalu.city/events/${eventId}`,
            ticketRequirements: nftGated
              ? {
                  contractAddress: contractAddress,
                  chain: chainName,
                  method: functionName,
                  comparator: comparator,
                  value: comparisonValue,
                }
              : undefined,
          });
          showDialog({
            title: 'Success',
            message: `Successfully created Akasha discussion for "${eventName}"`,
            onConfirm: () => {
              hideDialog();
            },
          });
        }
      } else {
        showDialog({
          title: 'Error',
          message: `Please connect to Akasha to create a discussion for "${eventName}"`,
          onConfirm: () => {
            hideDialog();
          },
        });
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      showDialog({
        title: 'Error',
        message: `Error creating discussion for event "${eventName}"`,
        onConfirm: () => {
          hideDialog();
        },
      });
    }*/
  };
  return (
    <Stack spacing="30px" padding="0 30px 30px">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          width: '100%',
        }}
      >
        {apps.map((app) => (
          <Stack key={app.name} alignItems="center" spacing={1}>
            <Typography fontSize={16}>{app.name}</Typography>
            <Box
              sx={{
                width: '75px',
                height: '75px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#262626',
                borderRadius: '4px',
              }}
            >
              <Image src={app.image} alt={app.name} width={75} height={75} />
            </Box>
            <ZuButton sx={{ width: '100px', height: '30px' }}>
              Description
            </ZuButton>
          </Stack>
        ))}
      </Box>
    </Stack>
  );
};

export default Home;
