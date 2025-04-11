'use client';

import { ZuButton, ZuInput, ZuSwitch } from '@/components/core';
import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import {
  createApp,
  createZulandAppRelease,
  getAppByEventId,
} from '@/utils/akasha';
import { LIT_CHAINS } from '@lit-protocol/constants';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { isAddress } from 'viem';

interface CreateDiscussionModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showToast: (
    text: string,
    severity: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  eventId: string;
  eventName: string;
  eventDescription: string;
}

export default function CreateDiscussionModal({
  showModal,
  setShowModal,
  showToast,
  eventId,
  eventName,
  eventDescription,
}: CreateDiscussionModalProps) {
  const { currentAkashaUser, loginAkasha } = useAkashaAuthStore();

  const [appAlreadyExists, setAppAlreadyExists] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(eventName);
  const [description, setDescription] = useState<string>(eventDescription);

  // nft gated
  const [nftGated, setNftGated] = useState<boolean>(true);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [chainName, setChainName] = useState<string>('ethereum');
  const [functionName, setFunctionName] = useState<string>('balanceOf');
  // const [functionParams, setFunctionParams] = useState<string>(':userAddress');

  const [comparator, setComparator] = useState<string>('>');
  const [comparisonValue, setComparisonValue] = useState<string>('0');

  const litSupportedChains = useMemo(() => {
    return Object.entries(LIT_CHAINS)
      .filter(([key]) => key !== 'hushedNorthstar')
      .sort(([keyA], [keyB]) =>
        keyA.toLowerCase().localeCompare(keyB.toLowerCase()),
      )
      .map(([key, chain]) => ({
        litIdentifier: key,
        chainName: chain.name,
        symbol: chain.symbol,
        chainId: chain.chainId,
      }));
  }, []);

  // const availableComparators = [
  //   { id: 1, value: '>', label: 'Greater Than' },
  //   { id: 2, value: '<', label: 'Less Than' },
  //   { id: 3, value: '>=', label: 'Greater Than or Equal to' },
  //   { id: 4, value: '<=', label: 'Less Than or Equal to' },
  //   { id: 5, value: '=', label: 'Equal To' },
  //   { id: 6, value: '!=', label: 'Not Equal To' },
  //   { id: 7, value: 'contains', label: 'Contains' },
  //   { id: 7, value: '!contains', label: 'Not Contains' },
  // ];

  useEffect(() => {
    async function checkAppExists() {
      const appAlreadyExists = await getAppByEventId(eventId);
      if (appAlreadyExists) {
        setAppAlreadyExists(true);
        setDisplayName(appAlreadyExists.name);
        setDescription(appAlreadyExists.description);
      }
    }
    checkAppExists();
  }, [eventId, eventName, setShowModal, showToast]);

  /* AKASHA login if not logged in */
  useEffect(() => {
    if (!currentAkashaUser) {
      loginAkasha();
    }
  }, [currentAkashaUser, loginAkasha]);

  const handleCreateDiscussion = async () => {
    if (nftGated && (!contractAddress || !isAddress(contractAddress))) {
      showToast('Please enter a valid contract address', 'error');
      return;
    }
    if (nftGated && (!functionName || !comparator || !comparisonValue)) {
      showToast('Please enter valid contract details', 'error');
      return;
    }
    if (!chainName) {
      showToast('Please select a chain', 'error');
      return;
    }
    if (!displayName) {
      showToast('Please enter a display name', 'error');
      return;
    }

    try {
      const appAlreadyExists = await getAppByEventId(eventId);
      if (appAlreadyExists) {
        console.log('app already exists');
        return;
      }
      /* Create Akasha app */
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
          showToast(
            `Successfully created Akasha discussion for "${eventName}"`,
            'success',
          );
          setShowModal(false);
        }
      } else {
        showToast(
          `Please connect to Akasha to create a discussion for "${eventName}"`,
          'error',
        );
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      showToast(`Error creating discussion for event "${eventName}"`, 'error');
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(false)}
      PaperProps={{
        style: {
          width: '692px',
          height: 'auto',
          padding: '20px 16px',
          backgroundColor: 'rgba(34, 34, 34, 0.9)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '20px',
          margin: '0px',
          maxWidth: 'unset',
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
          fontSize: '25px',
          fontWeight: 'bold',
        }}
      >
        {appAlreadyExists
          ? 'Discussion already exists'
          : 'Create a Discussion for this event'}
      </DialogTitle>
      <DialogContent style={{ width: '100%', color: 'white', padding: '10px' }}>
        <Stack
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
          spacing={2}
        >
          {appAlreadyExists ? (
            <Link href={`/events/${eventId}?tab=discussions`} target="_blank">
              <ZuButton
                sx={{
                  width: '100%',
                  fontSize: '18px',
                }}
              >
                View Discussion
              </ZuButton>
            </Link>
          ) : null}
          <Stack spacing={1}>
            <Typography fontSize={'18px'}>Display Name</Typography>
            <ZuInput
              value={displayName}
              onChange={(e) => {
                if (!appAlreadyExists) {
                  setDisplayName(e.target.value);
                }
              }}
              disabled={appAlreadyExists}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography fontSize={'18px'}>Description</Typography>
            <ZuInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
          <Stack spacing={1}>
            <Typography fontSize={'18px'}>Event NFT Gated?</Typography>
            <ZuSwitch
              checked={nftGated}
              onChange={() => setNftGated((v) => !v)}
            />
          </Stack>
          {nftGated ? (
            <>
              <Stack spacing={0}>
                <Typography variant="body2">
                  We support NFT contracts following OpenZeppelin ERC721
                  standard.
                </Typography>
                <Typography variant="body2">
                  We check if balanceOf(userAddress) &#x3e; 0.
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography fontSize={'18px'}>Contract Address</Typography>
                <ZuInput
                  value={contractAddress}
                  placeholder="0x..."
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </Stack>
              <Stack spacing={1}>
                <Typography fontSize={'18px'}>Contract Chain</Typography>
                <Select
                  value={chainName}
                  placeholder="Select Lit Compatible Chain"
                  onChange={(e) => setChainName(e.target.value)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        backgroundColor: '#222222',
                      },
                    },
                  }}
                >
                  {litSupportedChains &&
                    litSupportedChains.map((chain) => (
                      <MenuItem
                        key={chain.litIdentifier}
                        value={chain.litIdentifier}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#333333',
                          },
                        }}
                      >
                        {chain.chainName} ({chain.chainId})
                      </MenuItem>
                    ))}
                </Select>
              </Stack>
              {/*
              <Accordion
                sx={{
                  backgroundColor: '#222222',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{ marginTop: '10px' }}
                >
                  <Typography>Advanced Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Stack spacing={1}>
                      <Typography fontSize={'18px'}>Function Name</Typography>
                      <ZuInput
                        value={functionName}
                        placeholder="functionName"
                        onChange={(e) => setFunctionName(e.target.value)}
                      />
                    </Stack>
                     <Stack spacing={1}>
                      <Typography fontSize={'18px'}>Function Params</Typography>
                      <ZuInput
                        value={functionParams}
                        placeholder="functionParams"
                        onChange={(e) => setFunctionParams(e.target.value)}
                      />
                      <Typography variant="body2" color="gray.700">
                        <a
                          href="https://developer.litprotocol.com/sdk/access-control/evm/basic-examples"
                          style={{
                            textDecoration: 'underline',
                            color: 'white',
                          }}
                          target="_blank"
                        >
                          See more examples using Function Params.
                        </a>{' '}
                        If you need multiple params, separate them with a
                        semicolon (;)
                      </Typography>
                    </Stack> 
                    <Stack spacing={1}>
                      <Typography fontSize={'18px'}>Comparator</Typography>
                      <Select
                        value={comparator}
                        placeholder="Select Comparator"
                        onChange={(e) => setComparator(e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              backgroundColor: '#222222',
                            },
                          },
                        }}
                      >
                        {availableComparators &&
                          availableComparators.map((comparator) => (
                            <MenuItem
                              key={comparator.id}
                              value={comparator.value}
                              sx={{
                                '&:hover': {
                                  backgroundColor: '#333333',
                                },
                              }}
                            >
                              {comparator.label} ({comparator.value})
                            </MenuItem>
                          ))}
                      </Select>
                      <Typography variant="body2" color="gray.700">
                        <a
                          href="https://developer.litprotocol.com/sdk/access-control/evm/basic-examples"
                          style={{
                            textDecoration: 'underline',
                            color: 'white',
                          }}
                          target="_blank"
                        >
                          Learn more about Lit comparators.
                        </a>
                      </Typography>
                    </Stack>
                    {comparator !== 'contains' && comparator !== '!contains' ? (
                      <>
                        <Stack spacing={1}>
                          <Typography fontSize={'18px'}>
                            Comparison Value
                          </Typography>
                          <ZuInput
                            value={comparisonValue}
                            placeholder="comparisonValue"
                            onChange={(e) => setComparisonValue(e.target.value)}
                          />
                        </Stack>
                      </>
                    ) : null}
                  </Stack>
                </AccordionDetails>
              </Accordion>*/}
            </>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions
        style={{
          justifyContent: 'center',
          width: '100%',
          padding: 0,
          flexDirection: 'column',
        }}
      >
        <Stack spacing={1} width="100%">
          <ZuButton
            sx={{
              width: '100%',
              fontSize: '18px',
            }}
            onClick={handleCreateDiscussion}
            disabled={appAlreadyExists}
          >
            Create
          </ZuButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
