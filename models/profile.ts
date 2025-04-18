export interface Profile {
  /**
   * when use ceramic, id equals did
   */
  id: string;
  username: string;
  avatar: string;
  address: string;
}

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'address'>>;
