export const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';

//  OLD CONTRACT WORKING ON ZUZALU -
//  TODO: REMOVE FROM HERE ALL THIS CODE.
//  DEVELOPMENT PURPOUSE

// export const EAS_CONTRACT_SCROLL = '0xC47300428b6AD2c7D03BB76D05A176058b47E6B0';
// export const RESOLVER_CONTRACT_SCROLL_TRUSTFUL =
//   '0xeD4544F10D347e326140dBB869b6f4120DAf2c7B';
// export enum ROLES {
//   ROOT = '0x79e553c6f53701daa99614646285e66adb98ff0fcc1ef165dd2718e5c873bee6',
//   MANAGER = '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08',
//   VILLAGER = '0xd0a9af7d104b9b3afa727f6e92a7e308d10a3408478e161aba393651814986e8',
// }
// export interface Schemas {
//   uid: `0x${string}`;
//   data: string;
//   revocable: boolean;
//   allowedRole: string[];
// }
// export const TRUSTFUL_SCHEMAS: { [key: string]: Schemas } = {
//   ATTEST_MANAGER: {
//     uid: '0x3f7ab1b49d993220e928f71da02745eeeabe5bce53308ba9f47416fe0a0abfc4',
//     data: 'string role',
//     revocable: true,
//     allowedRole: [ROLES.ROOT],
//   },
//   ATTEST_VILLAGER: {
//     uid: '0x622181707fd9d196c9212d09db8788e3b46945304a4b9e7cbc55b4e179602a62',
//     data: 'string status',
//     revocable: false,
//     allowedRole: [ROLES.MANAGER],
//   },
//   ATTEST_EVENT: {
//     uid: '0xeb6ab1d8bc235579023101a04b1a9e240d4f756e6137b8389e5c54b049ad6972',
//     data: 'string title,string comment',
//     revocable: false,
//     allowedRole: [ROLES.VILLAGER],
//   },
//   ATTEST_RESPONSE: {
//     uid: '0x57cb29f73b0ff46e40261932c9a1f5aef91c9098ede3d449f4de7ee43089b988',
//     data: 'bool status',
//     revocable: true,
//     allowedRole: [ROLES.VILLAGER],
//   },
// };

/** ID of the space enabled for Trustful to appear so far. */
export const CypherHouseSpaceId =
  'kjzl6kcym7w8y5ye1nxcz2o08c8pk9nd57bwqqax6wlfaimn5qsf6s3306jgj34';

/** ID of the space to test the application. Should be removed soon when the CypherHouseSpaceId development code is in production */
export const TestApplicationSpaceId =
  'kjzl6kcym7w8y7drgmopt1aufcut7p9cbwyoaa0ht9vl8sgs5q39blhgsbeyb83';

export enum Role {
  ROOT = 'ROOT_ROLE',
  MANAGER = 'MANAGER_ROLE',
  VILLAGER = 'VILLAGER_ROLE',
  NO_ROLE = 'NO_ROLE',
}

export interface BadgeTitle {
  title: string;
  uid: `0x${string}`;
  allowComment: boolean;
  revocable: boolean;
  data: string;
  allowedRole: string[];
}

/// NEW CONTRACTS -ZUCITY
export const EAS_CONTRACT_SCROLL_MAINET =
  '0xC47300428b6AD2c7D03BB76D05A176058b47E6B0';
export const EAS_CONTRACT_SCROLL_SEPOLIA =
  '0xaEF4103A04090071165F78D45D83A0C0782c2B2a';

export const EAS_CONTRACT_SCROLL = isDev
  ? EAS_CONTRACT_SCROLL_SEPOLIA
  : EAS_CONTRACT_SCROLL_MAINET;

const RESOLVER_CONTRACT_SCROLL = '0x0A16dD89b4F06F111977D0F3bBab6165F08A5362';

const RESOLVER_CONTRACT_SCROLL_SEPOLIA =
  '0x882977D73d7B2E67F088853B9065d4FD887e6bA0';

export const RESOLVER_CONTRACT_SCROLL_TRUSTFUL = isDev
  ? RESOLVER_CONTRACT_SCROLL_SEPOLIA
  : RESOLVER_CONTRACT_SCROLL;

export const SCHEMA_UIDS = {
  ATTEST_MANAGER: isDev
    ? '0xf2f1d17213d5d5bed91abafecfc9862e857573d821ce0eeb36d8fe9cfebfc562'
    : '0x6dc178b7782b9bd47ceab9e98aef9e9656a5b27722d384e74a3c654131657951',
  ATTEST_VILLAGER: isDev
    ? '0xfd6e98168eff2ca555ccf9cae1cf43198202f5495134b752b7a4cc0bc480c99d'
    : '0x2b781f38ef65bdba6f7c70df32f90e53e4f9fc9f497e0324419de097cece3f3d',
  ATTEST_EVENT: isDev
    ? '0x9b55966a9b4a7676a329f026bff451265f83fdc46eef72dc8b252a1121fc7ecc'
    : '0x50a3ad32ee748ad7758f7429d8b30543dd6a60542e519ee0c85d7897144b0be3',
  ATTEST_RESPONSE: isDev
    ? '0x4a84dcaa2a5fffeb8dd99bfb2d12ef6fa0e233e9cfb11f2c8e08ad9714938ac8'
    : '0x3a12210b37dd53be53954015c7e163b9be5445f7f7d397b5d7cb14f77a5c5510',
};

export enum ROLES {
  ROOT = '0x79e553c6f53701daa99614646285e66adb98ff0fcc1ef165dd2718e5c873bee6',
  MANAGER = '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08',
  VILLAGER = '0x7e8ac59880745312f8754f56b69cccc1c6b2112d567ccf50e4e6dc2e39a7c67a',
}

export interface Schemas {
  uid: `0x${string}`;
  data: string;
  revocable: boolean;
  allowedRole: string[];
}

export const TRUSTFUL_SCHEMAS: { [key: string]: Schemas } = {
  ATTEST_MANAGER: {
    uid: SCHEMA_UIDS.ATTEST_MANAGER as `0x${string}`,
    data: 'string role',
    revocable: true,
    allowedRole: [ROLES.ROOT],
  },
  ATTEST_VILLAGER: {
    uid: SCHEMA_UIDS.ATTEST_VILLAGER as `0x${string}`,
    data: 'string status',
    revocable: false,
    allowedRole: [ROLES.MANAGER],
  },
  ATTEST_EVENT: {
    uid: SCHEMA_UIDS.ATTEST_EVENT as `0x${string}`,
    data: 'string title,string comment',
    revocable: false,
    allowedRole: [ROLES.VILLAGER],
  },
  ATTEST_RESPONSE: {
    uid: SCHEMA_UIDS.ATTEST_MANAGER as `0x${string}`,
    data: 'bool status',
    revocable: true,
    allowedRole: [ROLES.VILLAGER],
  },
};

export const ZUVILLAGE_BADGE_TITLES: BadgeTitle[] = [
  {
    title: 'Manager',
    uid: TRUSTFUL_SCHEMAS.ATTEST_MANAGER.uid,
    allowComment: false,
    revocable: true,
    data: TRUSTFUL_SCHEMAS.ATTEST_MANAGER.data,
    allowedRole: TRUSTFUL_SCHEMAS.ATTEST_MANAGER.allowedRole,
  },
  {
    title: 'Check-in',
    uid: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.uid,
    allowComment: false,
    revocable: false,
    data: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.data,
    allowedRole: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.allowedRole,
  },
  {
    title: 'Check-out',
    uid: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.uid,
    allowComment: true,
    revocable: false,
    data: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.data,
    allowedRole: TRUSTFUL_SCHEMAS.ATTEST_VILLAGER.allowedRole,
  },
];

export const ALCHEMY_PUBLIC_RPC =
  'https://scroll-mainnet.g.alchemy.com/v2/jPLttZWzT9-vo0yJD945MbH7QzS8gSd9';
