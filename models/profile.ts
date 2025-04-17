export interface Profile {
  id: string;
  username: string;
  avatar: string;
}

export type UpdateProfileInput = Partial<Profile>;
