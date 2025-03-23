'use client';
import { getInstalledDApps } from '@/services/space/apps';
import { NOOP } from '@/utils/function';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const InstalledAppsDataContext = createContext<{
  installedAppIds: string[];
  loading: boolean;
  addInstalledApp: (appId: string) => void;
  removeInstalledApp: (appId: string) => void;
  isInstalled: (appId: string) => boolean;
}>({
  installedAppIds: [],
  loading: false,
  addInstalledApp: NOOP,
  removeInstalledApp: NOOP,
  isInstalled: () => false,
});

export const useInstalledAppsData = () => useContext(InstalledAppsDataContext);

const InstalledAppsData = ({ children }: PropsWithChildren) => {
  const params = useParams();
  const spaceId = params.spaceid as string;
  const [installedAppIds, setInstalledAppIds] = useState<string[]>([]);

  // Fetch installed apps
  const { data: installedAppsData, isLoading } = useQuery({
    queryKey: ['installedApps', spaceId],
    queryFn: () => getInstalledDApps(spaceId),
    enabled: !!spaceId,
  });

  useEffect(() => {
    if (!installedAppsData?.data?.installedApps) return;
    setInstalledAppIds(
      installedAppsData.data.installedApps.map(
        (app: any) => app.node.installedAppId ?? app.node.nativeAppName,
      ),
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
  const addInstalledApp = (appId: string) => {
    setInstalledAppIds([...installedAppIds, appId]);
  };
  const removeInstalledApp = (appId: string) => {
    setInstalledAppIds(installedAppIds.filter((id) => id !== appId));
  };
  const isInstalled = (appId: string) => installedAppIds.includes(appId);

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
      }}
    >
      {children}
    </InstalledAppsDataContext.Provider>
  );
};

export default InstalledAppsData;
