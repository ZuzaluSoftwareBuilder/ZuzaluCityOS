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

  const admins = entity?.admins?.map((admin) => admin.id.toLowerCase()) || [];
  const superadmins =
    entity?.superAdmin?.map((superAdmin) => superAdmin.id.toLowerCase()) || [];
  const members =
    entity?.members?.map((member) => member.id.toLowerCase()) || [];

  return (
    superadmins.includes(normalizedUserDID) ||
    admins.includes(normalizedUserDID) ||
    members.includes(normalizedUserDID)
  );
};
