'use client';
import React, {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import clsx from 'clsx';
import { Image } from '@heroui/react';
import { useParams } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

import Drawer from '@/components/drawer';
import FormHeader from '@/components/form/FormHeader';
import { Button, Divider } from '@/components/base';
import { ArrowUpRightIcon, InstallIcon } from '@/components/icons';

import { Dapp } from '@/types';
import { NOOP } from '@/utils/function';
import ShowMoreEdit from '@/components/editor/ShowMoreEdit';
import { installDApp } from '@/services/space/apps';

import { useInstalledAppsData } from './InstalledAppsData';

const DAppDetailDrawerContext = createContext<{
  open: (app?: Dapp) => void;
  close: () => void;
}>({
  open: NOOP,
  close: NOOP,
});

export const useDAppDetailDrawer = () =>
  React.useContext(DAppDetailDrawerContext);

export const DAppDetailDrawer = ({ children }: PropsWithChildren) => {
  const params = useParams();
  const spaceId = params.spaceid.toString();
  const [appData, setAppData] = useState<Dapp>();
  const [drawerOpening, setDrawerOpening] = useState(false);

  const open = useCallback((app?: Dapp) => {
    setDrawerOpening(true);
    setAppData(app);
  }, []);
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
              color="dark"
              className="opacity-60"
              endContent={<ArrowUpRightIcon size={4} />}
              onClick={() => window.open(appData?.appUrl)}
            >
              View App Page
            </Button>
          }
        />
        <div className="flex flex-col gap-5 p-5">
          <DAppDetailDrawer.Disclaimer />
          <DAppDetailDrawer.BasicInfo
            bannerUrl={appData?.bannerUrl}
            appName={appData?.appName}
            tagline={appData?.tagline}
          />
          <div className="flex flex-col gap-2.5">
            <DAppDetailDrawer.Categories categories={appData?.categories} />
            <DAppDetailDrawer.Developer developer={appData?.developerName} />
          </div>
          <Divider orientation="horizontal" className="m-0" />
          <DAppDetailDrawer.InstallArea appId={appData?.id} spaceId={spaceId} />
          <DAppDetailDrawer.Description description={appData?.description} />
          <Divider orientation="horizontal" className="m-0" />
          <DAppDetailDrawer.Status
            devStatus={appData?.devStatus}
            openSource={appData?.openSource}
            repositoryUrl={appData?.repositoryUrl}
          />
        </div>
      </Drawer>
      {children}
    </DAppDetailDrawerContext.Provider>
  );
};

DAppDetailDrawer.Disclaimer = memo(() => {
  return (
    <div
      className={clsx([
        'bg-[rgba(255,255,255,0.02)] border border-solid border-[rgba(255,255,255,0.1)] rounded-[10px]', // style
        'flex flex-col gap-[5px] p-[10px]', // layout
      ])}
    >
      <div className="flex items-center gap-2 opacity-80">
        <ExclamationTriangleIcon width={20} />
        <span className="text-base font-bold leading-[120%]">Disclaimer</span>
      </div>
      <div className="text-sm font-normal leading-[160%] opacity-70">
        This application has not been audited for space usage. Use at your own
        risk.
      </div>
    </div>
  );
});

DAppDetailDrawer.BasicInfo = memo(
  (props: { bannerUrl?: string; appName?: string; tagline?: string } = {}) => {
    const { bannerUrl, appName, tagline } = props;
    return (
      <div className="flex gap-2.5 items-center">
        <div className={clsx(['rounded-[10px]', 'w-[60px] h-[60px]'])}>
          <Image
            alt={appName}
            src={bannerUrl}
            className={clsx(['rounded-[10px]', 'w-[60px] h-[60px]'])}
          />
        </div>
        <div className="flex flex-col gap-[5px] font-inter">
          <span className="text-lg font-bold leading-[140%]">
            {appName ?? '-'}
          </span>
          <span className="text-[13px] font-normal leading-[140%] opacity-80 tracking-[0.01em]">
            {tagline ?? '-'}
          </span>
        </div>
      </div>
    );
  },
);

DAppDetailDrawer.Categories = memo((props: { categories?: string }) => {
  const { categories = '' } = props;
  const categoriesArray = categories.split(',');
  return (
    <div className="flex gap-2.5 flex-wrap items-center font-inter text-[13px] leading-[140%] font-normal tracking-[0.01em]">
      <span className="opacity-50">Categories:</span>
      {categoriesArray.map((category) => (
        <div
          key={category}
          className={clsx([
            'rounded px-2 py-1 bg-[rgba(255,255,255,0.05)]', // container
          ])}
        >
          {category}
        </div>
      ))}
    </div>
  );
});

DAppDetailDrawer.Developer = memo((props: { developer?: string }) => {
  const { developer = '' } = props;
  return (
    <div className="flex gap-2.5 items-center font-inter text-[13px] leading-[140%] font-normal tracking-[0.01em]">
      <span className="opacity-50">Developer:</span>
      <span className="opacity-80">{developer}</span>
    </div>
  );
});

DAppDetailDrawer.InstallArea = (props: { appId?: string; spaceId: string }) => {
  const { appId, spaceId } = props;
  const [loading, setLoading] = useState(false);
  const {
    loading: installedDataFetching,
    isInstalled,
    addInstalledApp,
  } = useInstalledAppsData();

  const handleInstall = () => {
    if (!appId) return;
    setLoading(true);
    installDApp({
      spaceId,
      appId,
    })
      .then((res) => {
        if (res.data.status === 'success') {
          addInstalledApp(appId);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      className={clsx([
        'bg-[rgba(255,255,255,0.02)] border border-solid border-[rgba(255,255,255,0.1)] rounded-[10px]', // style
        'flex flex-col gap-5 p-5', // layout
      ])}
    >
      <span className="font-bold text-lg leading-[120%]">Install on Space</span>
      <Button
        color="functional"
        isLoading={loading || installedDataFetching}
        disabled={!appId || !spaceId || isInstalled(appId)}
        startContent={<InstallIcon />}
        onClick={handleInstall}
      >
        {appId && !isInstalled(appId) ? 'Install to Space' : 'Installed'}
      </Button>
    </div>
  );
};

DAppDetailDrawer.Description = memo((props: { description?: string }) => {
  const { description = '' } = props;
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-normal text-[13px] leading-[140%] tracking-[0.01em] opacity-50">
        App Description
      </span>
      <div className="opacity-80">
        <ShowMoreEdit value={description} />
      </div>
    </div>
  );
});

DAppDetailDrawer.Status = memo(
  (
    props: Partial<Pick<Dapp, 'devStatus' | 'openSource' | 'repositoryUrl'>>,
  ) => {
    const items = [
      { label: 'Status', value: props.devStatus },
      {
        label: 'Open Source Status',
        value: props.openSource ? 'Open Source' : 'Closed Source',
      },
      {
        label: 'Repository Link',
        value: props.repositoryUrl ? (
          <a
            href={props.repositoryUrl}
            target="_blank"
            className="text-[13px] leading-[140%] opacity-80 underline block break-all"
            style={{ textAlign: 'right' }}
          >
            {props.repositoryUrl}
          </a>
        ) : (
          '-'
        ),
      },
    ];
    return (
      <div className="flex flex-col w-full gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between gap-4 font-inter text-[13px] leading-[140%] font-normal tracking-[0.01em]"
          >
            <span className="opacity-50 whitespace-nowrap">{item.label}:</span>
            <span
              className="opacity-80 inline-block flex-1"
              style={{ textAlign: 'right' }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  },
);

export default DAppDetailDrawer;
