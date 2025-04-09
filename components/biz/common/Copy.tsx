import { addToast } from '@heroui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { ReactNode, useCallback } from 'react';
import { ShareFat } from '@phosphor-icons/react';
import { Button } from '@/components/base/button';

export interface CopyProps {
  text: string;
  children?: ReactNode | string;
  startContent?: ReactNode;
  onCopy?: () => void;
  message?: string;
}

const Copy = ({
  text,
  children,
  onCopy,
  startContent,
  message = '',
}: CopyProps) => {
  const handleCopy = useCallback(() => {
    addToast({
      title: message || 'Copy share link to clipboard',
      color: 'success',
    });
    onCopy?.();
  }, [message, onCopy]);

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Button
        startContent={
          startContent || <ShareFat weight="fill" format="Stroke" size={20} />
        }
        isIconOnly={!children}
      >
        {children}
      </Button>
    </CopyToClipboard>
  );
};

export default Copy;
