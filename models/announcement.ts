import { Tag } from './base';
import { Profile } from './profile';
export interface Announcement {
  id: string;
  title: string;
  tags: Tag[];
  description: string;
  createdAt: string;
  updatedAt: string;
  author: Profile;
  spaceId: string;
}
