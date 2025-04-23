export interface Profile {
  /**
   * when use supabase, id equals user_id
   * when use ceramic, id equals profile.id
   */
  id: string;
  username: string;
  avatar?: string;
  address: string;
  /**
   * when use ceramic, id equals profile.author.id
   * useless in supabase context
   */
  did: string;
}

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'address'>>;
