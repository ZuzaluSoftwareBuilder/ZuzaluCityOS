'use client';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';

import { NOOP } from '@/utils/function';

import Drawer from '@/components/drawer';
import FormHeader from '@/components/form/FormHeader';
import { Button } from '@/components/base';
import { ArrowUpRightIcon } from '@/components/icons';

const DAppDetailDrawerContext = createContext({
  open: NOOP,
  close: NOOP,
});

export const useDAppDetailDrawer = () =>
  React.useContext(DAppDetailDrawerContext);

export const DAppDetailDrawer: React.FC<PropsWithChildren> = ({ children }) => {
  const [drawerOpening, setDrawerOpening] = useState(false);

  const open = useCallback(() => setDrawerOpening(true), []);
  const close = useCallback(() => setDrawerOpening(false), []);

  return (
    <DAppDetailDrawerContext.Provider
      value={{
        open,
        close,
      }}
    >
      <Drawer open={drawerOpening} onClose={close} onOpen={open}>
        <FormHeader
          title={'appName'}
          handleClose={close}
          extra={
            <Button
              size="sm"
              color="primary"
              variant="light"
              className="text-"
              endContent={<ArrowUpRightIcon size={5} />}
            >
              View App Page
            </Button>
          }
        />
      </Drawer>
      {children}
    </DAppDetailDrawerContext.Provider>
  );
};

export default DAppDetailDrawer;
