'use client';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { Image } from '@heroui/react';
import { CaretLineDown, Trash } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import get from 'lodash/get';
import { useParams } from 'next/navigation';
import React, {
  createContext,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base';
import ShowMoreEdit from '@/components/editor/ShowMoreEdit';
import FormHeader from '@/components/form/FormHeader';
import { ArrowUpRightIcon } from '@/components/icons';
import { Dapp } from '@/models/dapp';
import {
  installDApp,
  InstallDAppParams,
  uninstallDApp,
  UninstallDAppParams,
} from '@/services/space/apps';
import { NOOP } from '@/utils/function';

import { NativeDApp } from '../constants';
import { useInstalledAppsData } from './InstalledAppsData';

const DAppDetailDrawerContext = createContext<{
  open: (app?: Dapp | NativeDApp) => void;
  close: () => void;
}>({
  open: NOOP,
  close: NOOP,
});

export const useDAppDetailDrawer = () =>
  React.useContext(DAppDetailDrawerContext);

export const DAppDetailDrawer = ({ children }: PropsWithChildren) => {
  const params = useParams();
  const spaceId = params.spaceid?.toString() ?? '';
  const [appData, setAppData] = useState<Dapp | NativeDApp>();
  const [drawerOpening, setDrawerOpening] = useState(false);

  const open = useCallback((app?: Dapp | NativeDApp) => {
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
      <Drawer
        isOpen={drawerOpening}
        onOpenChange={(open) => setDrawerOpening(open)}
        classNames={{
          base: 'w-[700px] max-w-[700px] mobile:w-[100%] mobile:max-w-[100%]',
        }}
      >
        <DrawerContent>
          {(onClose) => {
            return (
              <>
                <FormHeader
                  title={appData?.appName ?? '-'}
                  handleClose={onClose}
                  extra={
                    <Button
                      size="sm"
                      className="bg-[#222222] text-white opacity-60 hover:bg-[#363636]"
                      endContent={<ArrowUpRightIcon size={4} />}
                      onClick={() => window.open(appData?.appUrl)}
                    >
                      View App Page
                    </Button>
                  }
                />
                <DrawerBody className="p-5">
                  <div className="flex flex-col gap-5">
                    <DAppDetailDrawer.Disclaimer />
                    <DAppDetailDrawer.BasicInfo
                      appLogoUrl={appData?.appLogoUrl}
                      appName={appData?.appName}
                      tagline={appData?.tagline}
                    />
                    <div className="flex flex-col gap-2.5">
                      <DAppDetailDrawer.Categories
                        categories={appData?.categories}
                      />
                      <DAppDetailDrawer.Developer
                        developer={appData?.developerName}
                      />
                    </div>
                    <Divider orientation="horizontal" className="m-0" />
                    <DAppDetailDrawer.InstallArea
                      appId={get(appData, 'id')}
                      nativeAppName={get(appData, 'appIdentifier')}
                      spaceId={spaceId}
                    />
                    <DAppDetailDrawer.Description
                      description={appData?.description}
                    />
                    <Divider orientation="horizontal" className="m-0" />
                    <DAppDetailDrawer.Status
                      devStatus={appData?.devStatus}
                      openSource={appData?.openSource}
                      repositoryUrl={appData?.repositoryUrl}
                    />
                  </div>
                </DrawerBody>
              </>
            );
          }}
        </DrawerContent>
      </Drawer>
      {children}
    </DAppDetailDrawerContext.Provider>
  );
};

interface DisclaimerProps {
  isLegacy?: boolean;
}

DAppDetailDrawer.Disclaimer = memo(function Disclaimer(props: DisclaimerProps) {
  const { isLegacy } = props;
  return (
    <div
      className={clsx([
        'rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]', // style
        'flex flex-col gap-[5px] p-[10px]', // layout
      ])}
    >
      <div className="flex items-center gap-2 opacity-80">
        <ExclamationTriangleIcon width={20} />
        <span className="text-base font-bold leading-[120%]">Disclaimer</span>
      </div>
      <div className="text-sm font-normal leading-[160%] opacity-70">
        {isLegacy
          ? 'This application is legacy. Please recreate.'
          : 'This application has not been audited for space usage. Use at your own risk.'}
      </div>
    </div>
  );
});

DAppDetailDrawer.BasicInfo = memo(function BasicInfo(
  props: { appLogoUrl?: string; appName?: string; tagline?: string } = {},
) {
  const { appLogoUrl, appName, tagline } = props;
  return (
    <div className="flex items-center gap-2.5">
      <div className={clsx(['rounded-[10px]', 'size-[60px]'])}>
        <Image
          alt={appName}
          src={appLogoUrl}
          className={clsx([
            'rounded-[10px]',
            'size-[60px] border border-solid border-[rgba(255,255,255,0.1)]',
          ])}
        />
      </div>
      <div className="flex flex-col gap-[5px]">
        <span className="text-lg font-bold leading-[140%]">
          {appName ?? '-'}
        </span>
        <span className="text-[13px] font-normal leading-[140%] tracking-[0.01em] opacity-80">
          {tagline ?? '-'}
        </span>
      </div>
    </div>
  );
});

DAppDetailDrawer.Categories = memo(function Categories(props: {
  categories?: string;
}) {
  const { categories = '' } = props;
  const categoriesArray = categories.split(',');
  return (
    <div className="flex flex-wrap items-center gap-2.5 text-[13px] font-normal leading-[140%] tracking-[0.01em]">
      <span className="opacity-50">Categories:</span>
      {categoriesArray.map((category) => (
        <div
          key={category}
          className={clsx([
            'rounded bg-[rgba(255,255,255,0.05)] px-2 py-1', // container
          ])}
        >
          {category}
        </div>
      ))}
    </div>
  );
});

DAppDetailDrawer.Developer = memo(function Developer(props: {
  developer?: string;
}) {
  const { developer = '' } = props;
  return (
    <div className="flex items-center gap-2.5 text-[13px] font-normal leading-[140%] tracking-[0.01em]">
      <span className="opacity-50">Developer:</span>
      <span className="opacity-80">{developer}</span>
    </div>
  );
});

DAppDetailDrawer.InstallArea = function InstallArea(props: {
  appId?: string;
  nativeAppName?: string;
  spaceId: string;
}) {
  const { appId, nativeAppName, spaceId } = props;
  const idOrNativeAppName = appId ?? nativeAppName;
  const {
    loading: installedDataFetching,
    isInstalled,
    addInstalledApp,
    removeInstalledApp,
    queryInstalledAppIndexId,
  } = useInstalledAppsData();

  const currentIsInstalled = useMemo(() => {
    return idOrNativeAppName && isInstalled(idOrNativeAppName);
  }, [isInstalled, idOrNativeAppName]);

  const { mutate: installMutation, isPending: isInstalling } = useMutation({
    mutationFn: (params: InstallDAppParams) => installDApp(params),
    onSuccess: (response) => {
      if (response.data.status === 'success' && idOrNativeAppName) {
        addInstalledApp({
          installedAppIndexId: response.data.data.installedAppIndexId,
          installedAppIdOrNativeAppName: idOrNativeAppName,
        });
      }
    },
  });

  const { mutate: uninstallMutation, isPending: isUninstalling } = useMutation({
    mutationFn: (params: UninstallDAppParams) => uninstallDApp(params),
    onSuccess: (response) => {
      if (response.data.status === 'success' && idOrNativeAppName) {
        removeInstalledApp(idOrNativeAppName);
      }
    },
  });

  const handleInstall = useCallback(() => {
    if (!idOrNativeAppName) return;
    installMutation({
      spaceId,
      appId,
      nativeAppName,
    } as InstallDAppParams);
  }, [idOrNativeAppName, spaceId, appId, nativeAppName, installMutation]);

  const handleUninstall = useCallback(() => {
    if (!idOrNativeAppName) return;
    const installedAppIndexId = queryInstalledAppIndexId(idOrNativeAppName);
    if (!installedAppIndexId) return;
    uninstallMutation({ spaceId, installedAppIndexId });
  }, [idOrNativeAppName, queryInstalledAppIndexId, spaceId, uninstallMutation]);

  const handleInstallOrUninstall = useCallback(() => {
    if (currentIsInstalled) {
      handleUninstall();
    } else {
      handleInstall();
    }
  }, [currentIsInstalled, handleInstall, handleUninstall]);

  const isLoading = useMemo(() => {
    return isInstalling || isUninstalling || installedDataFetching;
  }, [isInstalling, isUninstalling, installedDataFetching]);

  return (
    <div
      className={clsx([
        'rounded-[10px] border border-solid border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]', // style
        'flex flex-col gap-5 p-5', // layout
      ])}
    >
      <span className="text-[20px] font-bold leading-[120%] opacity-70">
        Install on Space
      </span>
      <Button
        color="functional"
        isLoading={isLoading}
        startContent={
          !isLoading ? currentIsInstalled ? <Trash /> : <CaretLineDown /> : null
        }
        onClick={handleInstallOrUninstall}
      >
        {currentIsInstalled ? 'Uninstall' : 'Install to Space'}
      </Button>
    </div>
  );
};

DAppDetailDrawer.Description = memo(function Description(props: {
  description?: string;
}) {
  const { description = '' } = props;
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-normal leading-[140%] tracking-[0.01em] opacity-50">
        App Description
      </span>
      <div className="opacity-80">
        <ShowMoreEdit value={description} />
      </div>
    </div>
  );
});

DAppDetailDrawer.Status = memo(function Status(
  props: Partial<Pick<Dapp, 'devStatus' | 'openSource' | 'repositoryUrl'>>,
) {
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
          className="block break-all text-[13px] leading-[140%] underline opacity-80"
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
    <div className="flex w-full flex-col gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex justify-between gap-4 text-[13px] font-normal leading-[140%] tracking-[0.01em]"
        >
          <span className="whitespace-nowrap opacity-50">{item.label}:</span>
          <span
            className="inline-block flex-1 opacity-80"
            style={{ textAlign: 'right' }}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
});

export default DAppDetailDrawer;
