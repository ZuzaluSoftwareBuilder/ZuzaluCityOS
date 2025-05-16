import { Space } from './space';

/**
 * Calendar model interface
 */
export interface Calendar {
  id: string;
  name: string;
  category: string[];
  gated: boolean;
  spaceId: string;
  roleIds?: string[] | null;
  createdAt: string;
  space?: Space;
}

/**
 * Input type for creating a calendar
 */
export type CreateCalendarInput = Omit<Calendar, 'id' | 'createdAt'>;

/**
 * Input type for updating a calendar
 */
export type UpdateCalendarInput = Partial<
  Omit<Calendar, 'id' | 'createdAt' | 'spaceId'>
>;
