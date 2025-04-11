import Dialog from '@/app/spaces/components/Modal/Dialog';
import { useCallback } from 'react';
import { useDialog } from './DialogContext';

export function GlobalDialog() {
  const { dialogConfig, isOpen, hideDialog } = useDialog();

  const handleClose = useCallback(() => {
    dialogConfig?.onClose?.();
    hideDialog();
  }, [dialogConfig, hideDialog]);

  if (!dialogConfig) return null;

  return (
    <Dialog
      title={dialogConfig.title}
      message={dialogConfig.message}
      showModal={isOpen}
      showActions={dialogConfig.showActions ?? true}
      confirmText={dialogConfig.confirmText}
      actions={dialogConfig.actions}
      isLoading={dialogConfig.isLoading}
      onClose={handleClose}
      onConfirm={dialogConfig?.onConfirm}
    />
  );
}
