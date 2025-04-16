'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@/components/base/modal';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { CreateProfileErrorPrefix } from '@/context/CeramicContext';
import { addToast, Button, Input, Spinner } from '@heroui/react';
import { X } from '@phosphor-icons/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAccount, useDisconnect, useEnsName } from 'wagmi';
import AuthButton from './AuthButton';
import ConnectWalletButton from './ConnectWalletButton';

type LoadingButtonType = 'skip' | 'continue' | null;

const NewAuthPrompt: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [inputUsername, setInputUsername] = useState('');
  const [loadingButton, setLoadingButton] = useState<LoadingButtonType>(null);
  const connectionIntentRef = useRef(false);
  const {
    authStatus,
    isAuthenticating,
    isFetchingProfile,
    isCreatingProfile,
    authError,
    newUser,
    username,
    logout,
    connectSource,
    authenticate,
    createProfile,
    hideAuthPrompt,
    isAuthPromptVisible,
  } = useAbstractAuthContext();
  const { disconnectAsync } = useDisconnect();

  const maxUsernameLength = 200;

  useEffect(() => {
    if (
      isConnected &&
      authStatus === 'idle' &&
      isAuthPromptVisible &&
      connectionIntentRef.current
    ) {
      connectionIntentRef.current = false;
      authenticate().catch((err) => {
        console.error(
          '[NewAuthPrompt] Authentication triggered by useEffect failed:',
          err,
        );
        addToast({
          title: err.message || 'Authentication failed',
          color: 'danger',
        });
      });
    }

    if ((!isAuthPromptVisible || !isConnected) && connectionIntentRef.current) {
      connectionIntentRef.current = false;
    }
  }, [isConnected, authStatus, isAuthPromptVisible, authenticate]);

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

  const handleProfileAction = useCallback(
    async (options: {
      useInputUsername?: boolean;
      buttonType: LoadingButtonType;
    }) => {
      const { useInputUsername = false, buttonType } = options;

      if (address) {
        setLoadingButton(buttonType);

        try {
          const usernameToUse = useInputUsername
            ? inputUsername
            : ((ensName || address.slice(0, 10)) as string);

          await createProfile(usernameToUse);
        } catch (e: any) {
          addToast({
            title: e.message || 'Fail to create profile',
            color: 'danger',
          });
        } finally {
          setLoadingButton(null);
        }
      }
    },
    [address, ensName, inputUsername, createProfile],
  );

  const handleSkip = useCallback(() => {
    return handleProfileAction({ buttonType: 'skip' });
  }, [handleProfileAction]);

  const handleContinue = useCallback(() => {
    return handleProfileAction({
      useInputUsername: true,
      buttonType: 'continue',
    });
  }, [handleProfileAction]);

  const handleCloseAndReset = useCallback(async () => {
    setInputUsername('');
    await hideAuthPrompt();
    await logout();
    await disconnectAsync();
  }, [hideAuthPrompt, logout, disconnectAsync]);

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

  const renderConnectWalletContent = useCallback(() => {
    const { title, description } = connectWalletContent;
    return (
      <>
        <div className="flex w-full items-center justify-between p-[20px]">
          <ModalHeader className="p-0 text-[18px] font-bold leading-[1.2]">
            {title}
          </ModalHeader>
          <CloseButton onPress={handleCloseAndReset} />
        </div>
        <ModalBody className="gap-[10px] pb-5">
          <p className="text-[14px] leading-[1.4] text-white/70">
            {description}
          </p>
          <ConnectWalletButton
            isLoading={isAuthenticating || isFetchingProfile}
            authenticate={authenticate}
            onInitiateConnect={() => {
              connectionIntentRef.current = true;
            }}
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
    handleCloseAndReset,
    isAuthenticating,
    isFetchingProfile,
    authenticate,
  ]);

  const renderNewUserContent = useCallback(() => {
    const isAnyLoading = loadingButton !== null;

    return (
      <>
        <div className="flex w-full items-center justify-between p-[20px]">
          <ModalHeader>Welcome to Zuzalu City! (beta)</ModalHeader>
          <CloseButton onPress={handleCloseAndReset} />
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
              placeholder="Type your username"
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
              isDisabled={isCreatingProfile}
            />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-between gap-[10px] pt-[20px]">
          <AuthButton
            onPress={handleSkip}
            className="flex-1 bg-transparent hover:bg-white/5"
            isDisabled={isAnyLoading}
            isLoading={loadingButton === 'skip'}
          >
            Skip
          </AuthButton>
          <AuthButton
            onPress={handleContinue}
            className="flex-1"
            color="primary"
            isDisabled={!inputUsername || isAnyLoading}
            isLoading={loadingButton === 'continue'}
          >
            Continue
          </AuthButton>
        </ModalFooter>
      </>
    );
  }, [
    loadingButton,
    handleCloseAndReset,
    inputUsername,
    onInputChange,
    isCreatingProfile,
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
          <CloseButton onPress={hideAuthPrompt} />
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
          <AuthButton
            onPress={hideAuthPrompt}
            className="w-full"
            color="primary"
          >
            {`Let's Go!`}
          </AuthButton>
        </ModalFooter>
      </>
    );
  }, [username, address, hideAuthPrompt]);

  const renderModalContent = useCallback(() => {
    if (!isConnected) {
      return renderConnectWalletContent();
    }

    switch (authStatus) {
      case 'idle':
        return renderConnectWalletContent();

      case 'authenticating':
        return renderConnectWalletContent();

      case 'fetching_profile':
        if (newUser === true) {
          return renderNewUserContent();
        } else {
          return renderConnectWalletContent();
        }

      case 'authenticated':
        if (newUser) {
          return renderNewUserContent();
        } else {
          return renderLoggedInContent();
        }

      case 'creating_profile':
        return renderNewUserContent();

      case 'error':
        if (authError?.includes(CreateProfileErrorPrefix)) {
          return renderNewUserContent();
        }
        return renderConnectWalletContent();

      default:
        return (
          <ModalBody>
            <Spinner label="Loading..." />
          </ModalBody>
        );
    }
  }, [
    isConnected,
    authStatus,
    newUser,
    authError,
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

const CloseButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      className="size-auto min-w-0 bg-transparent p-0 opacity-50 transition-opacity hover:opacity-100"
      aria-label="Close"
    >
      <X size={20} weight={'light'} format={'Stroke'} className="opacity-50" />
    </Button>
  );
};

export default NewAuthPrompt;
