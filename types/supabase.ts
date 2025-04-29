export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          author: string;
          created_at: string;
          description: string | null;
          id: string;
          space_id: string | null;
          tags: Json | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          space_id?: string | null;
          tags?: Json | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          space_id?: string | null;
          tags?: Json | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'announcements_author_fkey';
            columns: ['author'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'announcements_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      betaDapps: {
        Row: {
          appName: string | null;
          appType: string | null;
          appUrl: string | null;
          audited: string | null;
          author: string;
          bannerUrl: string | null;
          categories: string | null;
          createdAtTime: string | null;
          description: string | null;
          developerName: string | null;
          devStatus: string | null;
          docsUrl: string | null;
          id: string;
          openSource: string | null;
          profile: string | null;
          profileId: string | null;
          repositoryUrl: string | null;
          tagline: string | null;
          websiteUrl: string | null;
        };
        Insert: {
          appName?: string | null;
          appType?: string | null;
          appUrl?: string | null;
          audited?: string | null;
          author: string;
          bannerUrl?: string | null;
          categories?: string | null;
          createdAtTime?: string | null;
          description?: string | null;
          developerName?: string | null;
          devStatus?: string | null;
          docsUrl?: string | null;
          id: string;
          openSource?: string | null;
          profile?: string | null;
          profileId?: string | null;
          repositoryUrl?: string | null;
          tagline?: string | null;
          websiteUrl?: string | null;
        };
        Update: {
          appName?: string | null;
          appType?: string | null;
          appUrl?: string | null;
          audited?: string | null;
          author?: string;
          bannerUrl?: string | null;
          categories?: string | null;
          createdAtTime?: string | null;
          description?: string | null;
          developerName?: string | null;
          devStatus?: string | null;
          docsUrl?: string | null;
          id?: string;
          openSource?: string | null;
          profile?: string | null;
          profileId?: string | null;
          repositoryUrl?: string | null;
          tagline?: string | null;
          websiteUrl?: string | null;
        };
        Relationships: [];
      };
      betaSpaces: {
        Row: {
          author_id: string | null;
          avatar: string | null;
          banner: string | null;
          category: string | null;
          created_at: string | null;
          customAttributes: string | null;
          customLinks: string | null;
          description: string | null;
          discord: string | null;
          ens: string | null;
          events: string[] | null;
          gated: string | null;
          github: string | null;
          id: string;
          lens: string | null;
          name: string | null;
          owner: string | null;
          tagline: string | null;
          telegram: string | null;
          twitter: string | null;
          website: string | null;
        };
        Insert: {
          author_id?: string | null;
          avatar?: string | null;
          banner?: string | null;
          category?: string | null;
          created_at?: string | null;
          customAttributes?: string | null;
          customLinks?: string | null;
          description?: string | null;
          discord?: string | null;
          ens?: string | null;
          events?: string[] | null;
          gated?: string | null;
          github?: string | null;
          id: string;
          lens?: string | null;
          name?: string | null;
          owner?: string | null;
          tagline?: string | null;
          telegram?: string | null;
          twitter?: string | null;
          website?: string | null;
        };
        Update: {
          author_id?: string | null;
          avatar?: string | null;
          banner?: string | null;
          category?: string | null;
          created_at?: string | null;
          customAttributes?: string | null;
          customLinks?: string | null;
          description?: string | null;
          discord?: string | null;
          ens?: string | null;
          events?: string[] | null;
          gated?: string | null;
          github?: string | null;
          id?: string;
          lens?: string | null;
          name?: string | null;
          owner?: string | null;
          tagline?: string | null;
          telegram?: string | null;
          twitter?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      calendars: {
        Row: {
          category: string[];
          created_at: string;
          gated: boolean;
          id: string;
          name: string;
          role_ids: string[] | null;
          space_id: string;
        };
        Insert: {
          category: string[];
          created_at?: string;
          gated: boolean;
          id?: string;
          name: string;
          role_ids?: string[] | null;
          space_id: string;
        };
        Update: {
          category?: string[];
          created_at?: string;
          gated?: boolean;
          id?: string;
          name?: string;
          role_ids?: string[] | null;
          space_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'calendars_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      dapp_infos: {
        Row: {
          app_logo_url: string;
          app_name: string;
          app_type: string;
          app_url: string | null;
          audit_log_url: string | null;
          audit_status: string | null;
          audited: string | null;
          author: string;
          banner_url: string;
          categories: string;
          created_at: string;
          description: string;
          dev_status: string;
          developer_name: string;
          docs_url: string | null;
          id: string;
          install_env: string | null;
          integrate_type: string | null;
          is_installable: string;
          is_sc_app: string | null;
          open_source: string;
          repository_url: string | null;
          sc_addresses: Json | null;
          tagline: string;
          updated_at: string;
          website_url: string | null;
        };
        Insert: {
          app_logo_url: string;
          app_name: string;
          app_type: string;
          app_url?: string | null;
          audit_log_url?: string | null;
          audit_status?: string | null;
          audited?: string | null;
          author: string;
          banner_url: string;
          categories: string;
          created_at?: string;
          description: string;
          dev_status: string;
          developer_name: string;
          docs_url?: string | null;
          id?: string;
          install_env?: string | null;
          integrate_type?: string | null;
          is_installable: string;
          is_sc_app?: string | null;
          open_source: string;
          repository_url?: string | null;
          sc_addresses?: Json | null;
          tagline: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Update: {
          app_logo_url?: string;
          app_name?: string;
          app_type?: string;
          app_url?: string | null;
          audit_log_url?: string | null;
          audit_status?: string | null;
          audited?: string | null;
          author?: string;
          banner_url?: string;
          categories?: string;
          created_at?: string;
          description?: string;
          dev_status?: string;
          developer_name?: string;
          docs_url?: string | null;
          id?: string;
          install_env?: string | null;
          integrate_type?: string | null;
          is_installable?: string;
          is_sc_app?: string | null;
          open_source?: string;
          repository_url?: string | null;
          sc_addresses?: Json | null;
          tagline?: string;
          updated_at?: string;
          website_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_dapp_infos_author';
            columns: ['author'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      eventEmailTemplate: {
        Row: {
          created_at: string;
          eventId: string | null;
          id: number;
          sender_Email: string | null;
          subject: string | null;
          template: string | null;
        };
        Insert: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          sender_Email?: string | null;
          subject?: string | null;
          template?: string | null;
        };
        Update: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          sender_Email?: string | null;
          subject?: string | null;
          template?: string | null;
        };
        Relationships: [];
      };
      eventPost: {
        Row: {
          created_at: string;
          creator: string | null;
          description: string | null;
          eventId: string | null;
          id: number;
          tags: string | null;
          title: string | null;
        };
        Insert: {
          created_at?: string;
          creator?: string | null;
          description?: string | null;
          eventId?: string | null;
          id?: number;
          tags?: string | null;
          title?: string | null;
        };
        Update: {
          created_at?: string;
          creator?: string | null;
          description?: string | null;
          eventId?: string | null;
          id?: number;
          tags?: string | null;
          title?: string | null;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string;
          eventId: string | null;
          id: number;
          privateKey: string | null;
        };
        Insert: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          privateKey?: string | null;
        };
        Update: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          privateKey?: string | null;
        };
        Relationships: [];
      };
      installed_apps: {
        Row: {
          created_at: string;
          id: string;
          installed_app_id: string | null;
          native_app_name: string | null;
          space_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          installed_app_id?: string | null;
          native_app_name?: string | null;
          space_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          installed_app_id?: string | null;
          native_app_name?: string | null;
          space_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'installed_apps_installed_app_id_fkey';
            columns: ['installed_app_id'];
            isOneToOne: false;
            referencedRelation: 'dapp_infos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'installed_apps_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      legacyEvents: {
        Row: {
          created_at: string;
          creator_id: string | null;
          description: string | null;
          end_date: string | null;
          event_space_type: string | null;
          event_type: string[] | null;
          experience_level: string[] | null;
          extra_links: string | null;
          format: string | null;
          id: string;
          image_url: string | null;
          main_location_id: string | null;
          name: string | null;
          social_links: string | null;
          start_date: string | null;
          status: string | null;
          tagline: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          creator_id?: string | null;
          description?: string | null;
          end_date?: string | null;
          event_space_type?: string | null;
          event_type?: string[] | null;
          experience_level?: string[] | null;
          extra_links?: string | null;
          format?: string | null;
          id?: string;
          image_url?: string | null;
          main_location_id?: string | null;
          name?: string | null;
          social_links?: string | null;
          start_date?: string | null;
          status?: string | null;
          tagline?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          creator_id?: string | null;
          description?: string | null;
          end_date?: string | null;
          event_space_type?: string | null;
          event_type?: string[] | null;
          experience_level?: string[] | null;
          extra_links?: string | null;
          format?: string | null;
          id?: string;
          image_url?: string | null;
          main_location_id?: string | null;
          name?: string | null;
          social_links?: string | null;
          start_date?: string | null;
          status?: string | null;
          tagline?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          created_at: string;
          eventId: string | null;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          eventId?: string | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      login_nonces: {
        Row: {
          address: string;
          expires_at: string;
          nonce: string;
        };
        Insert: {
          address: string;
          expires_at: string;
          nonce: string;
        };
        Update: {
          address?: string;
          expires_at?: string;
          nonce?: string;
        };
        Relationships: [];
      };
      permission: {
        Row: {
          created_at: string;
          id: string;
          name: string | null;
          resource: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name?: string | null;
          resource?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string | null;
          resource?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          address: string;
          avatar: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          username: string | null;
        };
        Insert: {
          address: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          username?: string | null;
        };
        Update: {
          address?: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      role: {
        Row: {
          color: string | null;
          created_at: string;
          id: string;
          is_vanity: boolean | null;
          level: string | null;
          name: string | null;
          resource_id: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          id?: string;
          is_vanity?: boolean | null;
          level?: string | null;
          name?: string | null;
          resource_id?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          id?: string;
          is_vanity?: boolean | null;
          level?: string | null;
          name?: string | null;
          resource_id?: string | null;
        };
        Relationships: [];
      };
      role_permission: {
        Row: {
          created_at: string;
          id: string;
          permission_ids: string[] | null;
          resource: string | null;
          resource_id: string | null;
          role_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_ids?: string[] | null;
          resource?: string | null;
          resource_id?: string | null;
          role_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_ids?: string[] | null;
          resource?: string | null;
          resource_id?: string | null;
          role_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'role_permission_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['id'];
          },
        ];
      };
      rsvp: {
        Row: {
          created_at: string;
          id: number;
          sessionID: number | null;
          userDID: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          sessionID?: number | null;
          userDID?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          sessionID?: number | null;
          userDID?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'rsvp_sessionID_fkey';
            columns: ['sessionID'];
            isOneToOne: false;
            referencedRelation: 'sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      rsvp_sideEvents: {
        Row: {
          created_at: string;
          id: number;
          sideEventID: string | null;
          userDID: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          sideEventID?: string | null;
          userDID?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          sideEventID?: string | null;
          userDID?: string | null;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          author: string | null;
          created_at: string;
          createdAt: string | null;
          creatorDID: string | null;
          description: string | null;
          endTime: string | null;
          eventId: string | null;
          experience_level: string | null;
          format: string | null;
          gated: string | null;
          id: number;
          isPublic: boolean | null;
          liveStreamLink: string | null;
          location: string | null;
          meeting_url: string | null;
          organizers: string | null;
          profileId: string | null;
          recording_link: string | null;
          rsvpNb: number | null;
          speakers: string | null;
          startTime: string | null;
          status: string | null;
          tags: string | null;
          test: string | null;
          timezone: string | null;
          title: string | null;
          track: string | null;
          type: string | null;
          uuid: string;
          video_url: string | null;
        };
        Insert: {
          author?: string | null;
          created_at?: string;
          createdAt?: string | null;
          creatorDID?: string | null;
          description?: string | null;
          endTime?: string | null;
          eventId?: string | null;
          experience_level?: string | null;
          format?: string | null;
          gated?: string | null;
          id?: number;
          isPublic?: boolean | null;
          liveStreamLink?: string | null;
          location?: string | null;
          meeting_url?: string | null;
          organizers?: string | null;
          profileId?: string | null;
          recording_link?: string | null;
          rsvpNb?: number | null;
          speakers?: string | null;
          startTime?: string | null;
          status?: string | null;
          tags?: string | null;
          test?: string | null;
          timezone?: string | null;
          title?: string | null;
          track?: string | null;
          type?: string | null;
          uuid?: string;
          video_url?: string | null;
        };
        Update: {
          author?: string | null;
          created_at?: string;
          createdAt?: string | null;
          creatorDID?: string | null;
          description?: string | null;
          endTime?: string | null;
          eventId?: string | null;
          experience_level?: string | null;
          format?: string | null;
          gated?: string | null;
          id?: number;
          isPublic?: boolean | null;
          liveStreamLink?: string | null;
          location?: string | null;
          meeting_url?: string | null;
          organizers?: string | null;
          profileId?: string | null;
          recording_link?: string | null;
          rsvpNb?: number | null;
          speakers?: string | null;
          startTime?: string | null;
          status?: string | null;
          tags?: string | null;
          test?: string | null;
          timezone?: string | null;
          title?: string | null;
          track?: string | null;
          type?: string | null;
          uuid?: string;
          video_url?: string | null;
        };
        Relationships: [];
      };
      sideEvents: {
        Row: {
          access_rule: string | null;
          category: string | null;
          created_at: string;
          creator: string | null;
          description: string | null;
          end_date: string | null;
          format: string | null;
          id: number;
          image_url: string | null;
          is_all_day: boolean | null;
          location_name: string | null;
          location_url: string | null;
          name: string | null;
          recurring: string | null;
          space_id: string | null;
          start_date: string | null;
          timezone: string | null;
          uuid: string;
        };
        Insert: {
          access_rule?: string | null;
          category?: string | null;
          created_at?: string;
          creator?: string | null;
          description?: string | null;
          end_date?: string | null;
          format?: string | null;
          id?: number;
          image_url?: string | null;
          is_all_day?: boolean | null;
          location_name?: string | null;
          location_url?: string | null;
          name?: string | null;
          recurring?: string | null;
          space_id?: string | null;
          start_date?: string | null;
          timezone?: string | null;
          uuid?: string;
        };
        Update: {
          access_rule?: string | null;
          category?: string | null;
          created_at?: string;
          creator?: string | null;
          description?: string | null;
          end_date?: string | null;
          format?: string | null;
          id?: number;
          image_url?: string | null;
          is_all_day?: boolean | null;
          location_name?: string | null;
          location_url?: string | null;
          name?: string | null;
          recurring?: string | null;
          space_id?: string | null;
          start_date?: string | null;
          timezone?: string | null;
          uuid?: string;
        };
        Relationships: [];
      };
      space_gating: {
        Row: {
          created_at: string;
          erc1155_contract_address: string | null;
          erc20_contract_address: string | null;
          erc721_contract_address: string | null;
          gating_condition: string | null;
          gating_status: string | null;
          id: string;
          poaps_id: Json | null;
          role_id: string | null;
          space_id: string;
          updated_at: string;
          zu_pass_info: Json | null;
        };
        Insert: {
          created_at?: string;
          erc1155_contract_address?: string | null;
          erc20_contract_address?: string | null;
          erc721_contract_address?: string | null;
          gating_condition?: string | null;
          gating_status?: string | null;
          id?: string;
          poaps_id?: Json | null;
          role_id?: string | null;
          space_id: string;
          updated_at?: string;
          zu_pass_info?: Json | null;
        };
        Update: {
          created_at?: string;
          erc1155_contract_address?: string | null;
          erc20_contract_address?: string | null;
          erc721_contract_address?: string | null;
          gating_condition?: string | null;
          gating_status?: string | null;
          id?: string;
          poaps_id?: Json | null;
          role_id?: string | null;
          space_id?: string;
          updated_at?: string;
          zu_pass_info?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: 'space_gating_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'space_gating_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      spaceAgent: {
        Row: {
          agentDID: string | null;
          agentKey: string | null;
          created_at: string;
          id: number;
          spaceId: string;
        };
        Insert: {
          agentDID?: string | null;
          agentKey?: string | null;
          created_at?: string;
          id?: number;
          spaceId: string;
        };
        Update: {
          agentDID?: string | null;
          agentKey?: string | null;
          created_at?: string;
          id?: number;
          spaceId?: string;
        };
        Relationships: [];
      };
      spaces: {
        Row: {
          author: string;
          avatar: string | null;
          banner: string | null;
          category: string | null;
          color: string | null;
          created_at: string;
          custom_links: Json | null;
          description: string;
          gated: string | null;
          id: string;
          name: string;
          owner: string;
          social_links: Json | null;
          tagline: string | null;
          tags: Json | null;
          updated_at: string;
        };
        Insert: {
          author: string;
          avatar?: string | null;
          banner?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          custom_links?: Json | null;
          description: string;
          gated?: string | null;
          id?: string;
          name: string;
          owner: string;
          social_links?: Json | null;
          tagline?: string | null;
          tags?: Json | null;
          updated_at?: string;
        };
        Update: {
          author?: string;
          avatar?: string | null;
          banner?: string | null;
          category?: string | null;
          color?: string | null;
          created_at?: string;
          custom_links?: Json | null;
          description?: string;
          gated?: string | null;
          id?: string;
          name?: string;
          owner?: string;
          social_links?: Json | null;
          tagline?: string | null;
          tags?: Json | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fk_spaces_author';
            columns: ['author'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'fk_spaces_owner';
            columns: ['owner'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      url: {
        Row: {
          ceramicId: string | null;
          created_at: string;
          hash: string | null;
          id: number;
          name: string | null;
          type: string | null;
        };
        Insert: {
          ceramicId?: string | null;
          created_at?: string;
          hash?: string | null;
          id?: number;
          name?: string | null;
          type?: string | null;
        };
        Update: {
          ceramicId?: string | null;
          created_at?: string;
          hash?: string | null;
          id?: number;
          name?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role_id: string;
          source: string;
          space_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role_id: string;
          source: string;
          space_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role_id?: string;
          source?: string;
          space_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_roles_author_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'user_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'role';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_roles_space_id_fkey';
            columns: ['space_id'];
            isOneToOne: false;
            referencedRelation: 'spaces';
            referencedColumns: ['id'];
          },
        ];
      };
      venues: {
        Row: {
          avatar: string | null;
          bookings: string | null;
          capacity: number | null;
          created_at: string;
          eventId: string | null;
          id: number;
          name: string | null;
          recording_link: string | null;
          tags: string | null;
          timezone: string | null;
        };
        Insert: {
          avatar?: string | null;
          bookings?: string | null;
          capacity?: number | null;
          created_at?: string;
          eventId?: string | null;
          id?: number;
          name?: string | null;
          recording_link?: string | null;
          tags?: string | null;
          timezone?: string | null;
        };
        Update: {
          avatar?: string | null;
          bookings?: string | null;
          capacity?: number | null;
          created_at?: string;
          eventId?: string | null;
          id?: number;
          name?: string | null;
          recording_link?: string | null;
          tags?: string | null;
          timezone?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
