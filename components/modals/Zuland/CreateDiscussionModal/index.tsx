'use client';

import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { ZuButton, ZuInput, ZuSwitch } from '@/components/core';
import {
  createApp,
  createZulandAppRelease,
  createZulandSpaceAppRelease,
  getAppByEventId,
} from '@/utils/akasha';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  Stack,
  Typography,
} from '@mui/material';
//import { LIT_CHAINS } from '@lit-protocol/constants';
import { useAkashaAuthStore } from '@/hooks/use-akasha-auth-store';
import { isAddress } from 'viem';
import Link from 'next/link';

interface CreateDiscussionModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  showToast: (
    text: string,
    severity: 'success' | 'error' | 'info' | 'warning',
  ) => void;
  resourceId: string;
  resourceName: string;
  resourceDescription: string;
  resourceType: 'events' | 'spaces';
}

export default function CreateDiscussionModal({
  showModal,
  setShowModal,
  showToast,
  resourceId,
  resourceName,
  resourceDescription,
  resourceType,
}: CreateDiscussionModalProps) {
  const { currentAkashaUser, loginAkasha } = useAkashaAuthStore();

  const [appAlreadyExists, setAppAlreadyExists] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>(resourceName);
  const [description, setDescription] = useState<string>(resourceDescription);

  // nft gated
  const [nftGated, setNftGated] = useState<boolean>(true);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [chainName, setChainName] = useState<string>('ethereum');
  const [functionName, setFunctionName] = useState<string>('balanceOf');
  // const [functionParams, setFunctionParams] = useState<string>(':userAddress');

  const [comparator, setComparator] = useState<string>('>');
  const [comparisonValue, setComparisonValue] = useState<string>('0');

  // const litSupportedChains = useMemo(() => {
  //   return Object.entries(LIT_CHAINS)
  //     .filter(([key]) => key !== 'hushedNorthstar')
  //     .sort(([keyA], [keyB]) =>
  //       keyA.toLowerCase().localeCompare(keyB.toLowerCase()),
  //     )
  //     .map(([key, chain]) => ({
  //       litIdentifier: key,
  //       chainName: chain.name,
  //       symbol: chain.symbol,
  //       chainId: chain.chainId,
  //     }));
  // }, []);

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
      const appAlreadyExists = await getAppByEventId(resourceId);
      console.log('appAlreadyExists', appAlreadyExists);
      if (appAlreadyExists) {
        setAppAlreadyExists(true);
        setDisplayName(appAlreadyExists.name);
        setDescription(appAlreadyExists.description);
      }
    }
    checkAppExists();
  }, [resourceId, resourceName, setShowModal, showToast]);

  /* AKASHA login if not logged in */
  useEffect(() => {
    if (!currentAkashaUser) {
      loginAkasha();
    }
  }, [currentAkashaUser, loginAkasha]);

  const handleCreateDiscussion = async () => {
    if (resourceType === 'events') {
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
    }

    try {
      const appAlreadyExists = await getAppByEventId(resourceId);
      if (appAlreadyExists) {
        console.log('app already exists');
        return;
      }
      console.log('currentAkashaUser', currentAkashaUser);
      console.log('appAlreadyExists', appAlreadyExists);
      /* Create Akasha app */
      if (currentAkashaUser) {
        const createAppResult = await createApp({
          eventID: resourceId,
          displayName: displayName,
          description: description,
        });
        console.log('createAppResult', createAppResult);
        if (createAppResult) {
          if (resourceType === 'events') {
            await createZulandAppRelease({
              applicationID: createAppResult?.document.id,
              version: '0.0.2',
              source: `https://zuzalu.city/${resourceType}/${resourceId}`,
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
          } else if (resourceType === 'spaces') {
            await createZulandSpaceAppRelease({
              applicationID: createAppResult?.document.id,
              version: '0.0.2',
              source: `https://zuzalu.city/${resourceType}/${resourceId}`,
              roleRequirements: {
                roleId: [
                  '2c41c2d0-94bc-4320-8696-5efef3d5e3ff',
                  'e90b1b3b-4af1-4c7a-b943-7595907fefad',
                  '219e3125-4748-43b4-a0e9-0602dbe12869',
                ],
                spaceId: resourceId,
              },
            });
            console.log(
              'createZulandSpaceAppRelease',
              createZulandSpaceAppRelease,
            );
          }
          showToast(
            `Successfully created Akasha discussion for "${resourceName}"`,
            'success',
          );
          setShowModal(false);
        }
      } else {
        showToast(
          `Please connect to Akasha to create a discussion for "${resourceName}"`,
          'error',
        );
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      showToast(
        `Error creating discussion for ${resourceType} "${resourceName}"`,
        'error',
      );
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
          : `Create a Discussion for this ${resourceType === 'events' ? 'event' : 'space'}`}
      </DialogTitle>
      <DialogContent style={{ width: '100%', color: 'white', padding: '10px' }}>
        <Stack
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
          spacing={2}
        >
          {appAlreadyExists ? (
            <Link
              href={`/${resourceType}/${resourceId}?tab=discussions`}
              target="_blank"
            >
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

          {/* 根据resourceType显示不同内容 */}
          {resourceType === 'events' ? (
            <>
              <Stack spacing={1}>
                <Typography fontSize={'18px'}>Event NFT Gated?</Typography>
                <ZuSwitch
                  checked={nftGated}
                  onChange={() => setNftGated((v) => !v)}
                />
              </Stack>
              {nftGated && (
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
                      {/* 链选项... */}
                    </Select>
                  </Stack>
                </>
              )}
            </>
          ) : (
            /* Space类型资源的展示内容 */
            <Stack spacing={1}>
              <Typography fontSize={'18px'}>Gated Roles</Typography>
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#ffd700',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                  ></span>
                  Owner
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#c0c0c0',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                  ></span>
                  Admin
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#cd7f32',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                  ></span>
                  Member
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.6)"
                sx={{ mt: 1 }}
              >
                The discussion will be gated to users with these roles in this
                space.
              </Typography>
            </Stack>
          )}
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
            Connect to Akasha Core and Create
          </ZuButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
