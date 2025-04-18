export interface Profile {
  id: string;
  username: string;
  avatar: string;
  address: string;
}

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'address'>>;
