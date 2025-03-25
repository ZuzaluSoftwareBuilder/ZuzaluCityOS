'use client';
import { getInstalledDApps } from '@/services/space/apps';
import { NOOP } from '@/utils/function';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type InstalledAppItem = {
  installedAppIndexId: string;
  installedAppIdOrNativeAppName: string;
};

const InstalledAppsDataContext = createContext<{
  installedAppIds: InstalledAppItem[];
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
  installedAppIds: [],
  loading: false,
  addInstalledApp: NOOP,
  removeInstalledApp: NOOP,
  isInstalled: () => false,
  queryInstalledAppIndexId: () => undefined,
});

export const useInstalledAppsData = () => useContext(InstalledAppsDataContext);

const InstalledAppsData = ({ children }: PropsWithChildren) => {
  const params = useParams();
  const spaceId = params.spaceid as string;
  const [installedAppIds, setInstalledAppIds] = useState<
    {
      installedAppIndexId: string;
      installedAppIdOrNativeAppName: string;
    }[]
  >([]);

  // Fetch installed apps
  const { data: installedAppsData, isLoading } = useQuery({
    queryKey: ['installedApps', spaceId],
    queryFn: () => getInstalledDApps(spaceId),
    enabled: !!spaceId,
  });

  useEffect(() => {
    if (!installedAppsData?.data?.installedApps) return;
    setInstalledAppIds(
      installedAppsData.data.installedApps.map((app: any) => ({
        installedAppIndexId: app.node.id,
        installedAppIdOrNativeAppName:
          app.node.installedAppId ?? app.node.nativeAppName,
      })),
    );
  }, [installedAppsData]);

  // Quickly update installedAppIds when installedAppsData is not available
  const _quicklyInstalledAppIds = useMemo(() => {
    if (!installedAppsData?.data?.installedApps) return [];
    return installedAppsData.data.installedApps.map(
      (app: any) => app.node.installedAppId ?? app.node.nativeAppName,
    );
  }, [installedAppsData]);

  // ------------------ Methods ------------------
  const addInstalledApp = useCallback((item: InstalledAppItem) => {
    setInstalledAppIds((prev) => [...prev, item]);
  }, []);

  const removeInstalledApp = useCallback(
    (
      installedAppIdOrNativeAppName: InstalledAppItem['installedAppIdOrNativeAppName'],
    ) => {
      setInstalledAppIds((prev) =>
        prev.filter(
          (id) =>
            id.installedAppIdOrNativeAppName !== installedAppIdOrNativeAppName,
        ),
      );
    },
    [],
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
    ) => installedAppIds.find(id => id.installedAppIdOrNativeAppName === installedAppIdOrNativeAppName)?.installedAppIndexId,
    [installedAppIds],
  );

  return (
    <InstalledAppsDataContext.Provider
      value={{
        installedAppIds:
          installedAppIds.length === 0 && _quicklyInstalledAppIds.length > 0
            ? _quicklyInstalledAppIds
            : installedAppIds,
        loading: isLoading,
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
