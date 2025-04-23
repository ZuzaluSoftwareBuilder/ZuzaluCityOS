import { ZuButton, ZuInput } from '@/components/core';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { useLitContext } from '@/context/LitContext';
import { useZupassContext } from '@/context/ZupassContext';
import { updateScrollpassMember } from '@/services/event/addScrollpassMember';
import { updateZupassMember } from '@/services/event/addZupassMember';
import { getWalletAddressFromProfile } from '@/utils/profile';
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDisconnect, useWalletClient } from 'wagmi';

interface NewUserPromptModalProps {
  showModal: boolean;
  onClose: () => void;
  setVerify: React.Dispatch<React.SetStateAction<boolean>> | any;
  eventId: string;
  ticketType: string;
  setStep: React.Dispatch<React.SetStateAction<number>> | any;
}

export default function NewUserPromptModal({
  showModal,
  onClose,
  setVerify,
  eventId,
  ticketType,
  setStep,
}: NewUserPromptModalProps) {
  const [stage, setStage] = useState('Initial');
  const [nickname, setNickName] = useState<string>('');
  const [haveRead, setHaveRead] = useState<boolean>(false);
  const maxCharacters = 15;
  const [showZupassModal, setShowZupassModal] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalText, setModalText] = useState<string>('');
  const charactersLeft = maxCharacters - nickname.length;
  const {
    ceramic,
    isAuthenticated,
    showAuthPrompt,
    profile,
    username,
    authenticate,
    logout: CeramicLogout,
    createProfile,
  } = useAbstractAuthContext();
  const {
    pcdStr,
    authState,
    log,
    user,
    auth,
    logout,
    nullifierHash,
    setNullifierHash,
  } = useZupassContext();
  const hasProcessedNullifier = useRef(false);
  const { disconnect } = useDisconnect();
  const { litConnect, litEncryptString, litDecryptString } = useLitContext();
  const { data: walletClient } = useWalletClient();
  const handleConinue = async () => {
    await createProfile(nickname);
    setStage('Final');
  };
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    if (newNickname.length <= maxCharacters) {
      setNickName(newNickname);
    }
  };
  const handleLogout = () => {
    disconnect();
    CeramicLogout();
    window.location.reload();
  };

  useEffect(() => {
    if (username) {
      setStage('Final');
    } else {
      setStage('Initial');
      setNickName('');
    }
  }, [showModal]);

  useEffect(() => {
    const connectAndProcess = async () => {
      if (isAuthenticated) {
        switch (ticketType) {
          case 'Zupass':
            if (
              nullifierHash &&
              ceramic?.did?.parent &&
              !hasProcessedNullifier.current
            ) {
              setStage('Updating');
              const addZupassMemberInput = {
                eventId: eventId,
                memberDID: ceramic?.did?.parent,
                memberZupass: nullifierHash,
              };
              updateZupassMember(addZupassMemberInput)
                .then((result) => {
                  hasProcessedNullifier.current = true;
                  if (result.status === 200) {
                    setVerify(true);
                    setStep(3);
                    if (username) {
                      setStage('Final');
                    } else {
                      setStage('Nickname');
                    }
                  }
                })
                .catch((error) => {
                  const errorMessage =
                    typeof error === 'string'
                      ? error
                      : error instanceof Error
                        ? error.message
                        : 'An unknown error occurred';
                  if (errorMessage === 'You are already whitelisted') {
                    setVerify(true);
                    setStep(3);
                    if (username) {
                      setStage('Final');
                    } else {
                      setStage('Nickname');
                    }
                  } else if (
                    errorMessage ===
                    'You have already use this zupass to whitelist an account, please login with that address'
                  ) {
                    setStage('Double Check-in');
                  }
                });
            }
            break;
          case 'Scrollpass':
            try {
              const litClient = await litConnect();
              if (!litClient) {
                throw new Error('Failed to connect to Lit Network');
              }

              const encryptString = getWalletAddressFromProfile(profile);

              const accessControlConditions = [
                {
                  contractAddress: '',
                  standardContractType: '',
                  chain: 'ethereum',
                  method: '',
                  parameters: [':userAddress'],
                  returnValueTest: {
                    comparator: '=',
                    value: encryptString,
                  },
                },
              ];
              const encryptedMemberScrollpass = await litEncryptString(
                encryptString,
                accessControlConditions,
                litClient,
              );
              console.log(
                'encryptedMemberScrollpass',
                encryptedMemberScrollpass,
              );
              /*if (walletClient) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const ethersWallet = await provider.getSigner();
                console.log('ethersWallet', ethersWallet);
                const decryptedString = await litDecryptString(
                  encryptedMemberScrollpass.ciphertext,
                  encryptedMemberScrollpass.dataToEncryptHash,
                  accessControlConditions,
                  litClient,
                  ethersWallet,
                );
                console.log('decryptedString', decryptedString);
              }*/
              if (
                encryptString &&
                encryptedMemberScrollpass &&
                ceramic?.did?.parent &&
                !hasProcessedNullifier.current
              ) {
                setStage('Updating');
                const addScrollpassMemberInput = {
                  eventId: eventId,
                  memberDID: ceramic?.did?.parent,
                  encryptedMemberScrollpass:
                    encryptedMemberScrollpass.ciphertext,
                };

                const result = await updateScrollpassMember(
                  addScrollpassMemberInput,
                );
                hasProcessedNullifier.current = true;
                if (result.status === 200) {
                  setVerify(true);
                  setStep(3);
                  if (username) {
                    setStage('Final');
                  } else {
                    setStage('Nickname');
                  }
                }
              }
            } catch (error) {
              console.error('Lit error:', error);
              const errorMessage =
                error instanceof Error ? error.message : 'unknown error';
              if (errorMessage === 'You are already whitelisted') {
                setVerify(true);
                setStep(3);
                if (username) {
                  setStage('Final');
                } else {
                  setStage('Nickname');
                }
              } else if (
                errorMessage ===
                'You have already use this scrollpass ticket to whitelist an account, please login with that address'
              ) {
                setStage('Double Check-in');
              }
              console.error('error:', errorMessage);
            }
            break;
        }
      }
    };
    connectAndProcess();
  }, [isAuthenticated]);

  return (
    <Dialog
      open={showModal}
      onClose={onClose}
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
        {stage === 'Initial' && 'Welcome to Zuzalu.City'}
        {stage === 'Nickname' && 'Welcome to Zuzalu City'}
        {stage === 'Double Check-in' &&
          'You have already used this ticket to check in'}
        {stage === 'Updating' && 'Please wait...'}
        {stage === 'Final' && `Welcome, ${username}`}
      </DialogTitle>
      <DialogContent style={{ width: '100%', color: 'white', padding: '10px' }}>
        <Stack
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {stage === 'Initial' && (
            <>
              <Typography fontSize={'18px'}>
                Warning - Zuzalu.city is currently in Beta
              </Typography>
              <ul>
                <li>
                  <Typography fontSize={'18px'}>
                    This version of Zuzalu.city may break or stop working
                    without warning
                  </Typography>
                </li>
                <li>
                  <Typography fontSize={'18px'}>
                    Communities created with this version may be broken by
                    future releases
                  </Typography>
                </li>
                <li>
                  <Typography fontSize={'18px'}>
                    Zuzalu.city currently consumes large amounts of bandwidth
                  </Typography>
                </li>
              </ul>
              <Typography fontSize={'18px'}>
                We are working to fix all these issues ASAP, ahead of
                Zuzalu.city 1.0 release!
              </Typography>
            </>
          )}
          {stage === 'Nickname' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                Let’s get started with your nickname. You can change it later
              </Typography>
            </>
          )}
          {stage === 'Double Check-in' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                Please connect with the wallet you initially chose or reach the
                event organizer to change it
              </Typography>
            </>
          )}
          {stage === 'Updating' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                Please wait while updating on Ceramic
              </Typography>
            </>
          )}
          {stage === 'Final' && (
            <>
              <Typography fontSize={'18px'} sx={{ opacity: '0.7' }}>
                You’re ready! Now explore events and join community spaces.
              </Typography>
            </>
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
        {stage === 'Initial' && (
          <>
            <Box
              flexDirection={'row'}
              display={'flex'}
              width={'100%'}
              gap={'20px'}
              paddingTop={'20px'}
              borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
              alignItems={'center'}
            >
              <Checkbox
                value={haveRead}
                onChange={(e) => setHaveRead(e.target.checked)}
              ></Checkbox>
              <Typography fontSize={'18px'}>
                I have read the above and understand that Zuzalu.city is Beta
                software
              </Typography>
            </Box>
            <ZuButton
              sx={{
                width: '100%',
                marginTop: '20px',
                fontSize: '18px',
              }}
              disabled={!haveRead}
              onClick={async () => {
                try {
                  await authenticate();
                } catch (error) {
                  console.error('Authentication failed:', error);
                }
              }}
            >
              Continue
            </ZuButton>
          </>
        )}
        {stage === 'Nickname' && (
          <Stack width={'100%'} gap={'20px'}>
            <Stack width={'100%'} gap={'5px'} alignItems={'flex-end'}>
              <ZuInput
                placeholder="Type a nick name"
                value={nickname}
                onChange={handleNicknameChange}
                sx={{
                  padding: '12px',
                  width: '100%',
                  marginTop: '20px',
                  fontSize: '18px',
                }}
              ></ZuInput>
              <Typography fontSize={'10px'} sx={{ opacity: '0.7' }}>
                {charactersLeft} Characters Left{' '}
              </Typography>
            </Stack>
            <ZuButton
              disabled={!nickname}
              onClick={handleConinue}
              sx={{
                width: '100%',
                marginTop: '20px',
                fontSize: '18px',
              }}
            >
              Continue
            </ZuButton>
          </Stack>
        )}
        {stage === 'Double Check-in' && (
          <ZuButton
            sx={{
              width: '100%',
              fontSize: '18px',
            }}
            onClick={handleLogout}
          >
            Logout
          </ZuButton>
        )}
        {stage === 'Final' && (
          <ZuButton
            sx={{
              width: '100%',
              fontSize: '18px',
            }}
            onClick={() => {
              onClose();
            }}
          >
            Finish
          </ZuButton>
        )}
      </DialogActions>
    </Dialog>
  );
}
