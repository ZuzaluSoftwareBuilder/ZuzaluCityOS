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
          path: `/spaces/${spaceId}/setting`,
        },
        {
          id: 'Roles',
          label: 'Roles',
          path: `/spaces/${spaceId}/setting/roles`,
          locked: false,
        },
        {
          id: 'Access',
          label: 'Access',
          path: `/spaces/${spaceId}/setting/access`,
          locked: false,
        },
        {
          id: 'Event',
          label: 'Event',
          path: `/spaces/${spaceId}/setting/event`,
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
          path: `/spaces/${spaceId}/setting/apps`,
        },
        {
          id: 'ManageApps',
          label: 'Manage Apps',
          path: `/spaces/${spaceId}/setting/manage-apps`,
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
          path: `/spaces/${spaceId}/setting/member-list`,
          locked: true,
        },
        {
          id: 'Invitations',
          label: 'Invitations',
          path: `/spaces/${spaceId}/setting/invitations`,
          locked: true,
        },
      ],
    },
  ];
};
