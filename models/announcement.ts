import { SpaceTag } from './base';
import { Profile } from './profile';
export interface Announcement {
  id: string;
  title: string;
  tags: SpaceTag[];
  description: string;
  createdAt: string;
  updatedAt: string;
  sourceId: string;
  author: {
    id: string;
    zucityProfile: Profile;
  };
}
