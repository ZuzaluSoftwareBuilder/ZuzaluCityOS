import {
  Button,
  CommonModalHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from '@/components/base';
import { useDisclosure } from '@heroui/react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface ModalConfig {
  title: string;
  content?: ReactNode;
  contentText?: string;
  confirmText?: string;
  cancelText?: string;
  isDisabled?: boolean;
  confirmAction?: () => Promise<any> | void;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showModal = useCallback(
    (config: ModalConfig) => {
      setModalConfig(config);
      onOpen();
    },
    [onOpen],
  );

  const hideModal = useCallback(() => {
    onClose();
    setTimeout(() => {
      setModalConfig(null);
      setIsLoading(false);
    }, 300);
  }, [onClose]);

  const handleConfirm = useCallback(async () => {
    if (!modalConfig?.confirmAction) {
      hideModal();
      return;
    }

    try {
      setIsLoading(true);
      const result = modalConfig.confirmAction();

      if (result instanceof Promise) {
        await result;
      }
      hideModal();
    } catch (error) {
      console.error('Error in modal confirmation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [modalConfig, hideModal]);

  return (
    <>
      <ModalContext.Provider value={{ showModal, hideModal }}>
        {children}
      </ModalContext.Provider>

      <Modal
        placement="center"
        isOpen={isOpen}
        isDismissable={false}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {modalConfig && (
                <>
                  <CommonModalHeader
                    title={modalConfig.title}
                    onClose={onClose}
                    isDisabled={isLoading || modalConfig.isDisabled}
                  />
                  <ModalBody className="gap-5 p-[0_20px]">
                    {modalConfig.content}
                    {modalConfig.contentText && (
                      <p className="text-[14px] text-white/70">
                        {modalConfig.contentText}
                      </p>
                    )}
                  </ModalBody>
                  <ModalFooter className="p-[20px]">
                    <div className="flex w-full justify-between gap-2.5">
                      <Button
                        className={
                          'h-[38px] flex-1 border border-[rgba(255,255,255,0.1)] bg-transparent font-bold text-white'
                        }
                        radius="md"
                        onPress={onClose}
                        disabled={isLoading || modalConfig.isDisabled}
                      >
                        {modalConfig.cancelText || 'Cancel'}
                      </Button>
                      <Button
                        className={
                          'h-[38px] flex-1 border border-[rgba(255,94,94,0.2)] bg-[rgba(255,94,94,0.1)] font-bold text-[#FF5E5E]'
                        }
                        radius="md"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        disabled={modalConfig.isDisabled}
                      >
                        {modalConfig.confirmText || 'Confirm'}
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};
