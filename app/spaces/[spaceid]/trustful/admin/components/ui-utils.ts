import { ROLES } from '../../constants/constants';

enum ROLES_NAME {
  ROOT = 'ROOT',
  MANAGER = 'MANAGER',
  VILLAGER = 'VILLAGER',
}

export enum ActionName {
  NONE = 'NONE', // 0
  ASSIGN_MANAGER = 'ASSIGN_MANAGER', // 1
  ASSIGN_VILLAGER = 'ASSIGN_VILLAGER', // 2
  ATTEST = 'ATTEST', // 3
  REPLY = 'REPLY', // 4
}

export const ROLES_OPTIONS: Record<ROLES_NAME, ROLES> = {
  ROOT: ROLES.ROOT,
  MANAGER: ROLES.MANAGER,
  VILLAGER: ROLES.VILLAGER,
};

export const ACTIONS_OPTIONS: Record<ActionName, number> = {
  [ActionName.NONE]: 0,
  [ActionName.ASSIGN_MANAGER]: 1,
  [ActionName.ASSIGN_VILLAGER]: 2,
  [ActionName.ATTEST]: 3,
  [ActionName.REPLY]: 4,
};

export enum ADMIN_ACTION {
  GRANT_ROLE = 'Grant Role',
  REVOKE_ROLE = 'Revoke Role',
  REVOKE_MANAGER = 'Revoke Manager',
  SET_ATTESTATION_TITLE = 'Create Badge',
  SET_SCHEMA = 'Set Schema Action',
  REMOVE_SESSION = 'Remove session',
  JOIN_SESSION = 'Join session',
  CREATE_SESSION = 'Create session',
  WRAP_SESSION = 'Wrap session',
}

export interface AdminActions {
  action: ADMIN_ACTION;
}

export const VILLAGER_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.JOIN_SESSION,
  },
  {
    action: ADMIN_ACTION.CREATE_SESSION,
  },
  {
    action: ADMIN_ACTION.WRAP_SESSION,
  },
];

export const MANAGER_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.REVOKE_MANAGER,
  },
  {
    action: ADMIN_ACTION.SET_ATTESTATION_TITLE,
  },
  {
    action: ADMIN_ACTION.REVOKE_ROLE,
  },
  ...VILLAGER_OPTIONS,
];

export const ADMIN_OPTIONS: AdminActions[] = [
  {
    action: ADMIN_ACTION.GRANT_ROLE,
  },
  {
    action: ADMIN_ACTION.SET_SCHEMA,
  },
  {
    action: ADMIN_ACTION.REMOVE_SESSION,
  },
  ...MANAGER_OPTIONS,
];

// EVENT ACTIONS
export enum EVENT_ACTION {
  CREATE_EVENT = 'Create event',
}

export interface EventActions {
  action: EVENT_ACTION;
}

export const EVENT_OPTIONS: EventActions[] = [
  {
    action: EVENT_ACTION.CREATE_EVENT,
  },
];

// SESSIONS ACTIONS
export enum SESSION_ACTION {
  REMOVE_SESSION = 'Remove session',
  JOIN_SESSION = 'Join session',
  CREATE_SESSION = 'Create session',
  WRAP_SESSION = 'Wrap session',
}

export interface SessionActions {
  action: SESSION_ACTION;
}

export const SESSION_OPTIONS: SessionActions[] = [
  {
    action: SESSION_ACTION.JOIN_SESSION,
  },
  {
    action: SESSION_ACTION.CREATE_SESSION,
  },
  {
    action: SESSION_ACTION.WRAP_SESSION,
  },
  {
    action: SESSION_ACTION.REMOVE_SESSION,
  },
];

// SESSIONS ACTIONS
export enum SESSION_DETAILS_ACTION {
  REMOVE_SESSION = 'Remove session',
  JOIN_SESSION = 'Join session',
  WRAP_SESSION = 'Wrap session',
}

export interface SessionDetailsActions {
  action: SESSION_DETAILS_ACTION;
}

export const SESSION_DETAILS_OPTIONS: SessionDetailsActions[] = [
  {
    action: SESSION_DETAILS_ACTION.JOIN_SESSION,
  },
  {
    action: SESSION_DETAILS_ACTION.WRAP_SESSION,
  },
  {
    action: SESSION_DETAILS_ACTION.REMOVE_SESSION,
  },
];
