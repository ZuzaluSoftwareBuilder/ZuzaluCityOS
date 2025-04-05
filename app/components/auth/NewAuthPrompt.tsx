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
import { Button, Input, Spinner } from '@heroui/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/base/modal';
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
  const maxUsernameLength = Infinity;
  const [isContinueLoading, setIsContinueLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [needsManualReset, setNeedsManualReset] = useState(false);

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

  const handleConnectButtonClick = useCallback(() => {
    if (needsManualReset) {
      console.log('Manual reset triggered on connect button click');
      disconnect();
      authenticateCalled.current = false;
      setIsAuthenticating(false);
      setTimeout(() => {
        setNeedsManualReset(false);
      }, 100);
    }
  }, [needsManualReset, disconnect]);

  useEffect(() => {
    const authenticateUser = async (needSetState = true) => {
      try {
        authenticateCalled.current = true;
        setIsAuthenticating(true);
        await authenticate();
        setIsAuthenticating(false);
      } catch (error) {
        console.error('Authentication failed:', error);

        console.log('Disconnecting wallet due to authentication failure');
        disconnect();
        setIsAuthenticating(false);
        authenticateCalled.current = false;
        setNeedsManualReset(true);
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
  }, [isConnected, isAuthPromptVisible, authenticate, disconnect]);

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
        className="size-auto min-w-0 bg-transparent p-0 opacity-50 transition-opacity hover:opacity-100"
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
        <div className="flex w-full items-center justify-between p-[20px]">
          <ModalHeader className="p-0 text-[18px] font-bold leading-[1.2]">
            {title}
          </ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody className="gap-[10px] pb-5">
          <p className="text-[14px] leading-[1.4] text-white/70">
            {description}
          </p>
          <ConnectWalletButton
            isLoading={isAuthenticating}
            onConnectClick={handleConnectButtonClick}
          />
        </ModalBody>
        <div className="w-full rounded-b-[10px] bg-[#363636] px-[20px] py-[10px]">
          <p className="text-[12px] leading-[1.4] text-white/70">
            Wallet Connection Provided by <strong>Rainbow Kit</strong>
          </p>
        </div>
      </>
    );
  }, [
    connectWalletContent,
    renderCloseButton,
    isAuthenticating,
    handleConnectButtonClick,
  ]);

  const renderNewUserContent = useCallback(() => {
    return (
      <>
        <div className="flex w-full items-center justify-between p-[20px]">
          <ModalHeader>Welcome to Zuzalu City! (beta)</ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody className="gap-[20px]">
          <p className="text-[14px] leading-[1.4] text-white/70">
            {`Let's create your username. You can skip this or change it later. Default will be your address.`}
          </p>
          <div>
            <p className="mb-[10px] text-[16px] font-medium leading-[1.2] text-white">
              Username
            </p>
            <Input
              placeholder="type your username"
              value={inputUsername}
              onValueChange={onInputChange}
              className="h-[40px] px-0 text-white"
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
        <div className="flex w-full items-center justify-between p-[20px]">
          <ModalHeader>{`You're all set.`}</ModalHeader>
          {renderCloseButton()}
        </div>
        <ModalBody>
          {username && !isAddressUsername && (
            <div className="flex gap-[20px]">
              <h2 className="bg-gradient-to-r from-[#7DFFD1] to-[#FFCA7A] bg-clip-text text-[20px] font-bold leading-[1.2] text-transparent">
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
    >
      <ModalContent>{renderModalContent()}</ModalContent>
    </Modal>
  );
};

export default NewAuthPrompt;
