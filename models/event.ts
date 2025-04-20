import { Link } from './base';
import { Profile } from './profile';
export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  tagline?: string;
  imageUrl?: string;
  externalUrl?: string;
  meetingUrl?: string;
  profileId?: string;
  spaceId?: string;
  participantCount: number;
  minParticipant: number;
  maxParticipant: number;
  createdAt: string;
  source?: string;
  legacyData?: LegacyEvent;
  space?: {
    id?: string;
    name?: string;
    gated?: string;
    avatar?: string;
    banner?: string;
    description?: string;
  };
  profile?: Profile;
  customLinks?: Link[];
  tracks?: string;
  regAndAccess?: any; // todo
  applicationForms?: any; // todo
  sessionStorage?: string;
  supportChain?: string;
  admins?: {
    id: string;
  }[];
  members?: {
    id: string;
  }[];
  superAdmin?: {
    id: string;
  }[];
  location?: string;
}

export interface LegacyEvent {
  id?: string;
  name?: string;
  eventSpaceType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  format?: string;
  eventType?: string[];
  experienceLevel?: string[];
  creatorId?: string;
  tagline?: string;
  socialLinks?: string;
  extraLinks?: string;
  imageUrl?: string;
  mainLocationId?: string;
}
