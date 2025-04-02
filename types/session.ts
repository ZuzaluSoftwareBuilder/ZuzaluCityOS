import { Invitation } from './invitation';

export interface SessionData {
  operatorId?: string;
  invitation?: Invitation;
  [key: string]: any;
} 