export const isUserAssociated = (
  entity: {
    members?: { id: string }[];
    admins?: { id: string }[];
    superAdmin?: { id: string }[];
  },
  userDID?: string,
): boolean => {
  if (!userDID) return false;

  const normalizedUserDID = userDID.toLowerCase();

  const superadmins =
    entity?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) || [];

  return superadmins.includes(normalizedUserDID);
};
