import { TBD } from './base';
import { Profile } from './profile';
export interface UserRole {
  id: string;
  roleId: string;
  userId: {
    zucityProfile: Profile;
  };
  customAttributes: TBD[];
}
