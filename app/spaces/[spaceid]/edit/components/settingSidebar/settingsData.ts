export interface SettingItem {
  id: string;
  label: string;
  active?: boolean;
  locked?: boolean;
  path?: string;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

export const getSettingSections = (spaceId: string): SettingSection[] => {
  return [
    {
      id: 'General',
      title: 'General',
      items: [
        {
          id: 'Overview',
          label: 'Community Overview',
          path: `/spaces/${spaceId}/edit`,
        },
        {
          id: 'Roles',
          label: 'Roles',
          path: `/spaces/${spaceId}/edit/roles`,
          locked: true,
        },
        {
          id: 'AccessManagement',
          label: 'Access Management',
          path: `/spaces/${spaceId}/edit/access`,
          locked: true,
        },
        {
          id: 'Event',
          label: 'Event',
          path: `/spaces/${spaceId}/edit/event`,
          locked: true,
        },
      ],
    },
    {
      id: 'AppManagement',
      title: 'App Management',
      items: [
        {
          id: 'ExploreApps',
          label: 'Explore Apps',
          path: `/spaces/${spaceId}/edit/apps`,
          locked: true,
        },
        {
          id: 'ManageApps',
          label: 'Manage Apps',
          path: `/spaces/${spaceId}/edit/manage-apps`,
          locked: true,
        },
      ],
    },
    {
      id: 'MemberManagement',
      title: 'Member Management',
      items: [
        {
          id: 'MemberList',
          label: 'Member List',
          path: `/spaces/${spaceId}/edit/member-list`,
          locked: true,
        },
        {
          id: 'Invitations',
          label: 'Invitations',
          path: `/spaces/${spaceId}/edit/invitations`,
          locked: true,
        },
      ],
    },
  ];
}; 