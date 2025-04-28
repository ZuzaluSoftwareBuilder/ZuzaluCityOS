'use client';
import { InstalledApp } from '@/models/dapp';
import { NOOP } from '@/utils/function';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSpaceData } from '../../../components/context/spaceData';

type InstalledAppItem = {
  installedAppIndexId: string;
  installedAppIdOrNativeAppName: string;
};

const InstalledAppsDataContext = createContext<{
  loading: boolean;
  addInstalledApp: (item: InstalledAppItem) => void;
  removeInstalledApp: (
    item: InstalledAppItem['installedAppIdOrNativeAppName'],
  ) => void;
  isInstalled: (
    item: InstalledAppItem['installedAppIdOrNativeAppName'],
  ) => boolean;
  queryInstalledAppIndexId: (
    item: InstalledAppItem['installedAppIdOrNativeAppName'],
  ) => string | undefined;
}>({
  loading: false,
  addInstalledApp: NOOP,
  removeInstalledApp: NOOP,
  isInstalled: () => false,
  queryInstalledAppIndexId: () => undefined,
});

export const useInstalledAppsData = () => useContext(InstalledAppsDataContext);

const InstalledAppsData = ({ children }: PropsWithChildren) => {
  const [installedAppIds, setInstalledAppIds] = useState<
    {
      installedAppIndexId: string;
      installedAppIdOrNativeAppName: string;
    }[]
  >([]);

  const { spaceData, isSpaceDataLoading, refreshSpaceData } = useSpaceData();

  const installedAppsData = useMemo(() => {
    return spaceData?.installedApps as InstalledApp[];
  }, [spaceData]);

  useEffect(() => {
    if (!installedAppsData) return;
    setInstalledAppIds(
      installedAppsData.map((app) => ({
        installedAppIndexId: app.id ?? '',
        installedAppIdOrNativeAppName:
          app.installedAppId ?? app.nativeAppName ?? '',
      })),
    );
  }, [installedAppsData]);

  // ------------------ Methods ------------------
  const addInstalledApp = useCallback(
    (item: InstalledAppItem) => {
      refreshSpaceData();
      setInstalledAppIds((prev) => [...prev, item]);
    },
    [refreshSpaceData],
  );

  const removeInstalledApp = useCallback(
    (
      installedAppIdOrNativeAppName: InstalledAppItem['installedAppIdOrNativeAppName'],
    ) => {
      refreshSpaceData();
      setInstalledAppIds((prev) =>
        prev.filter(
          (id) =>
            id.installedAppIdOrNativeAppName !== installedAppIdOrNativeAppName,
        ),
      );
    },
    [refreshSpaceData],
  );

  const isInstalled = useCallback(
    (
      installedAppIdOrNativeAppName: InstalledAppItem['installedAppIdOrNativeAppName'],
    ) =>
      installedAppIds.some(
        (id) =>
          id.installedAppIdOrNativeAppName === installedAppIdOrNativeAppName,
      ),
    [installedAppIds],
  );

  const queryInstalledAppIndexId = useCallback(
    (
      installedAppIdOrNativeAppName: InstalledAppItem['installedAppIdOrNativeAppName'],
    ) =>
      installedAppIds.find(
        (id) =>
          id.installedAppIdOrNativeAppName === installedAppIdOrNativeAppName,
      )?.installedAppIndexId,
    [installedAppIds],
  );

  return (
    <InstalledAppsDataContext.Provider
      value={{
        loading: isSpaceDataLoading,
        addInstalledApp,
        removeInstalledApp,
        isInstalled,
        queryInstalledAppIndexId,
      }}
    >
      {children}
    </InstalledAppsDataContext.Provider>
  );
};

export default InstalledAppsData;
