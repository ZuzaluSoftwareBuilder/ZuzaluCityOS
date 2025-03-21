import { RolePermission } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const getRoles = async (resource: string, id: string) => {
  const response = await axiosInstance.get('/api/role', {
    params: {
      resource,
      id,
    },
  });
  return response.data as { data: RolePermission[] };
};

export const CHECK_EXISTING_ROLE_QUERY = `
query GetUserRole($userId: String, $resourceId: String, $resource: String) {
  zucityUserRolesIndex(
    first: 1,        
    filters: { 
      where: { 
        userId: { equalTo: $userId },
        resourceId: { equalTo: $resourceId },
        source: { equalTo: $resource }
      }
    }
  ) {
    edges {
      node {
        roleId
      }
    }
  }
}
`;

export const CREATE_ROLE_QUERY = `
mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {
  createZucityUserRoles(
    input: $input
  ) {
    document {
      userId {
        id
      }
      created_at
      updated_at
      resourceId
      source
      roleId
    }
  }
}
`;

export const DELETE_ROLE_QUERY = `
mutation enableIndexingZucityUserRoles($input: EnableIndexingZucityUserRolesInput!) {
  enableIndexingZucityUserRoles(input: $input) {
    document {
      id
    }
  }
}
`;

export const UPDATE_ROLE_QUERY = `
mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {
  updateZucityUserRoles(
    input: $input
  ) {
    document {
      id
    }
  }
}
`;
