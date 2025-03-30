import { LocalStorage } from '@/utils/BOM/localstorage';
import { dayjs } from '@/utils/dayjs';

export interface LastViewTime {
  spaceId: string;
  lastViewTimeStamp: number;
}

/**
 * Get the last view time for a space
 * @param spaceId - The ID of the space
 * @returns The last view time for the space
 */
export const getSpaceLastViewTime = (spaceId: string): number | undefined => {
  const lastViewTime = LocalStorage.get<LastViewTime[]>('lastAnnouncement');
  return (
    lastViewTime?.find((item) => item.spaceId === spaceId)?.lastViewTimeStamp ??
    dayjs('1990-01-01').valueOf()
  );
};

/**
 * Set the last view time for a space
 * @param spaceId - The ID of the space
 */
export const setSpaceLastViewTime = (spaceId: string): void => {
  LocalStorage.update<LastViewTime[]>('lastAnnouncement', (prev) => {
    if (!prev) {
      prev = [];
    }
    const currentSpaceOldIdx = prev?.findIndex(
      (item) => item.spaceId === spaceId,
    );
    if (currentSpaceOldIdx !== -1) {
      prev[currentSpaceOldIdx] = {
        spaceId: spaceId as string,
        lastViewTimeStamp: +dayjs(),
      };
    } else {
      prev.push({
        spaceId: spaceId as string,
        lastViewTimeStamp: +dayjs(),
      });
    }
    return prev;
  });
};

export const subscribeSpaceLastViewTime = (
  spaceId: string,
  callback: (lastViewTime: number) => void,
): (() => void) => {
  return LocalStorage.subscribe<LastViewTime[]>(
    'lastAnnouncement',
    (newValue) => {
      const lastViewTime = newValue?.find(
        (item) => item.spaceId === spaceId,
      )?.lastViewTimeStamp;
      callback(lastViewTime ?? 0);
    },
  );
};
