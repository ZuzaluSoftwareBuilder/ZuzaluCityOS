import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useCeramicContext } from '@/context/CeramicContext';
import { useAccount, useEnsName, useDisconnect } from 'wagmi';
import ConnectWalletButton from './ConnectWalletButton';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from '@heroui/react';
import { X } from '@phosphor-icons/react';
import AuthButton from './AuthButton';

export enum IAuthState {
  ConnectWallet = 'CONNECT_WALLET',
  NewUser = 'NEW_USER',
  LoggedIn = 'Logged_In',
}

const NewAuthPrompt: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [inputUsername, setInputUsername] = useState('');
  const {
    authenticate,
    hideAuthPrompt,
    isAuthPromptVisible,
    newUser,
    profile,
    username,
    createProfile,
    connectSource,
  } = useCeramicContext();
  const { disconnect } = useDisconnect();
  const [authState, setAuthState] = useState<IAuthState | undefined>(undefined);
  const authenticateCalled = useRef(false);
  const maxUsernameLength = 20;
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const existingUsername = localStorage.getItem('username');
    const authenticateLoggedUser = async () => {
      if (existingUsername && isAuthPromptVisible) {
        await authenticate();
        setAuthState(IAuthState.LoggedIn);
      } else if (!existingUsername && isAuthPromptVisible && isConnected) {
        disconnect();
        setAuthState(IAuthState.ConnectWallet);
      }
    };
    authenticateLoggedUser();
  }, [isAuthPromptVisible]);

  useEffect(() => {
    const authenticateUser = async (needSetState = true) => {
      try {
        authenticateCalled.current = true;
        setIsAuthenticating(true);
        await authenticate();
        setIsAuthenticating(false);
      } catch (error) {
        console.error('Authentication failed:', error);
        disconnect();
        setIsAuthenticating(false);
        needSetState && setAuthState(IAuthState.ConnectWallet);
      }
    };
    if (
      isConnected &&
      isAuthPromptVisible &&
      !authenticateCalled.current &&
      !localStorage.getItem('username')
    ) {
      authenticateUser();
    }
    if (
      isConnected &&
      localStorage.getItem('username') &&
      !authenticateCalled.current
    ) {
      authenticateUser(false);
    }
  }, [isConnected]);

  useEffect(() => {
    setAuthState(newUser ? IAuthState.NewUser : IAuthState.LoggedIn);
  }, [newUser]);

  useEffect(() => {
    if (isAuthPromptVisible && !isConnected) {
      setAuthState(IAuthState.ConnectWallet);
    }
  }, [isAuthPromptVisible, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setIsAuthenticating(false);
    }
  }, [isConnected]);

  const onInputChange = useCallback(
    (value: string) => {
      setInputUsername(
        value.length <= maxUsernameLength
          ? value
          : value.slice(0, maxUsernameLength),
      );
    },
    [maxUsernameLength],
  );

  const handleSkip = useCallback(async () => {
    if (address) {
      setIsSkipLoading(true);
      try {
        await createProfile((ensName || address.slice(0, 10)) as string);
        setAuthState(IAuthState.LoggedIn);
      } catch (e) {
        console.error('createProfile error:', e);
      } finally {
        setIsSkipLoading(false);
      }
    }
  }, [address, ensName, createProfile]);

  const handleContinue = useCallback(async () => {
    setIsContinueLoading(true);
    try {
      await createProfile(inputUsername);
      setAuthState(IAuthState.LoggedIn);
    } catch (e) {
      console.error('createProfile error:', e);
    } finally {
      setIsContinueLoading(false);
    }
  }, [inputUsername, createProfile]);

  const handleFinish = useCallback(() => {
    hideAuthPrompt();
    setAuthState(undefined);
    authenticateCalled.current = false;
  }, [hideAuthPrompt]);

  const connectWalletContent = useMemo(() => {
    if (connectSource === 'invalidAction') {
      return {
        title: 'Sign in to perform this action',
        description: 'Sign in or register an new account',
      };
    }
    return {
      title: 'Sign in to Zuzalu City',
      description: 'Sign in or register an new account',
    };
  }, [connectSource]);

  const renderCloseButton = useCallback(() => {
    return (
      <Button
        onPress={hideAuthPrompt}
        className="bg-transparent opacity-50 hover:opacity-100 transition-opacity p-0 min-w-0 w-auto h-auto"
        aria-label="Close"
      >
        <X
          size={20}
          weight={'light'}
          format={'Stroke'}
          className="opacity-50"
        />
      </Button>
    );
  }, [hideAuthPrompt]);

  const renderConnectWalletContent = useCallback(() => {
    const { title, description } = connectWalletContent;
    return (
      <>
        <div className="flex items-center justify-between w-full p-[20px]">
          <ModalHeader className="p-0 text-[18px] leading-[1.2] font-bold">
            {title}
          </ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody className="pb-5 gap-[10px]">
          <p className="text-[14px] leading-[1.4] text-white/70">
            {description}
          </p>
          <ConnectWalletButton isLoading={isAuthenticating} />
        </ModalBody>
        <div className="w-full bg-[#363636] py-[10px] px-[20px] rounded-b-[10px]">
          <p className="text-[12px] leading-[1.4] text-white/70">
            Wallet Connection Provided by <strong>Rainbow Kit</strong>
          </p>
        </div>
      </>
    );
  }, [connectWalletContent, renderCloseButton, isAuthenticating]);

  const renderNewUserContent = useCallback(() => {
    return (
      <>
        <div className="flex items-center justify-between w-full p-[20px]">
          <ModalHeader>Welcome to Zuzalu City! (beta)</ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody className="gap-[20px]">
          <p className="text-[14px] leading-[1.4] text-white/70">
            {`Let's create your username. You can skip this or change it later. Default will be your address.`}
          </p>
          <div>
            <p className="text-[16px] leading-[1.2] font-medium text-white mb-[10px]">
              Username
            </p>
            <Input
              placeholder="type your username"
              value={inputUsername}
              onValueChange={onInputChange}
              className="text-white h-[40px] px-[0]"
              classNames={{
                base: ['shadow-none border-none'],
                mainWrapper: ['p-0'],
                innerWrapper: ['p-0'],
                inputWrapper: [
                  'border border-white/10 rounded-[8px]',
                  'bg-[rgba(255,255,255,0.05)]',
                ],
              }}
              isDisabled={isSkipLoading || isContinueLoading}
            />
            <div className="flex justify-end w-full mt-[10px]">
              <p className="text-xs text-white/50">{`${maxUsernameLength - inputUsername.length} characters left`}</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-between gap-[10px] pt-[20px]">
          <AuthButton
            onPress={handleSkip}
            className="flex-1 bg-transparent hover:bg-white/5"
            isDisabled={isSkipLoading}
          >
            {isSkipLoading ? <Spinner size="sm" color="current" /> : 'Skip'}
          </AuthButton>
          <AuthButton
            onPress={handleContinue}
            className="flex-1"
            color="primary"
            isDisabled={isContinueLoading}
          >
            {isContinueLoading ? (
              <Spinner size="sm" color="current" />
            ) : (
              'Continue'
            )}
          </AuthButton>
        </ModalFooter>
      </>
    );
  }, [
    renderCloseButton,
    inputUsername,
    onInputChange,
    isSkipLoading,
    isContinueLoading,
    handleSkip,
    handleContinue,
  ]);

  const renderLoggedInContent = useCallback(() => {
    const isAddressUsername =
      username && address && username === address.slice(0, 10);

    return (
      <>
        <div className="flex items-center justify-between w-full p-[20px]">
          <ModalHeader>{`You're all set.`}</ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody>
          {username && !isAddressUsername && (
            <div className="flex gap-[20px]">
              <h2 className="text-[20px] font-bold leading-[1.2] bg-gradient-to-r from-[#7DFFD1] to-[#FFCA7A] text-transparent bg-clip-text">
                {username}!
              </h2>
            </div>
          )}
          <p className="text-[16px] leading-[1.4] text-white/70">
            You can now discover community events, explore dApps and join
            community spaces.
          </p>
        </ModalBody>
        <ModalFooter>
          <AuthButton onPress={handleFinish} className="w-full" color="primary">
            {`Let's Go!`}
          </AuthButton>
        </ModalFooter>
      </>
    );
  }, [username, address, handleFinish, renderCloseButton]);

  const renderModalContent = useCallback(() => {
    switch (authState) {
      case IAuthState.ConnectWallet:
        return renderConnectWalletContent();

      case IAuthState.NewUser:
        return renderNewUserContent();

      case IAuthState.LoggedIn:
        return renderLoggedInContent();

      default:
        return null;
    }
  }, [
    authState,
    renderConnectWalletContent,
    renderNewUserContent,
    renderLoggedInContent,
  ]);

  return (
    <Modal
      isOpen={isAuthPromptVisible}
      onClose={hideAuthPrompt}
      placement="center"
      size="md"
      isDismissable={false}
      backdrop="opaque"
      classNames={{
        base: 'border-2 border-[rgba(255,255,255,0.1)] bg-[rgba(52,52,52,0.6)] backdrop-blur-[20px] rounded-[10px] shadow-none w-[420px] mobile:w-[calc(90vw)]',
        header: 'p-0 text-[18px] leading-[1.2] font-bold',
        body: 'px-[20px] py-0',
        footer: 'p-[20px]',
        closeButton: 'hidden',
        backdrop: 'bg-[rgba(34,34,34,0.6)]',
        wrapper: 'z-[1100]',
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.15,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent>{renderModalContent()}</ModalContent>
    </Modal>
  );
};

export default NewAuthPrompt;
