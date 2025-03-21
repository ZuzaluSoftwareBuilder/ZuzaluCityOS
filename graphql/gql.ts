/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query GetSpaceMembers($resourceId: String) {\n    zucityUserRolesIndex(\n      first: 1000\n      filters: {\n        where: {\n          source: { equalTo: \"space\" }\n          resourceId: { equalTo: $resourceId }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n          customAttributes {\n            tbd\n          }\n          userId {\n            zucityProfile {\n              avatar\n              username\n              author {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetSpaceMembersDocument,
    "\n  query GetUserRole($userId: String, $resourceId: String, $resource: String) {\n    zucityUserRolesIndex(\n      first: 1\n      filters: {\n        where: {\n          userId: { equalTo: $userId }\n          resourceId: { equalTo: $resourceId }\n          source: { equalTo: $resource }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n        }\n      }\n    }\n  }\n": typeof types.GetUserRoleDocument,
    "\n  mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {\n    createZucityUserRoles(input: $input) {\n      document {\n        userId {\n          id\n        }\n        created_at\n        updated_at\n        resourceId\n        source\n        roleId\n      }\n    }\n  }\n": typeof types.CreateZucityUserRolesDocument,
    "\n  mutation enableIndexingZucityUserRoles(\n    $input: EnableIndexingZucityUserRolesInput!\n  ) {\n    enableIndexingZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n": typeof types.EnableIndexingZucityUserRolesDocument,
    "\n  mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {\n    updateZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n": typeof types.UpdateZucityUserRolesDocument,
};
const documents: Documents = {
    "\n  query GetSpaceMembers($resourceId: String) {\n    zucityUserRolesIndex(\n      first: 1000\n      filters: {\n        where: {\n          source: { equalTo: \"space\" }\n          resourceId: { equalTo: $resourceId }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n          customAttributes {\n            tbd\n          }\n          userId {\n            zucityProfile {\n              avatar\n              username\n              author {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetSpaceMembersDocument,
    "\n  query GetUserRole($userId: String, $resourceId: String, $resource: String) {\n    zucityUserRolesIndex(\n      first: 1\n      filters: {\n        where: {\n          userId: { equalTo: $userId }\n          resourceId: { equalTo: $resourceId }\n          source: { equalTo: $resource }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n        }\n      }\n    }\n  }\n": types.GetUserRoleDocument,
    "\n  mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {\n    createZucityUserRoles(input: $input) {\n      document {\n        userId {\n          id\n        }\n        created_at\n        updated_at\n        resourceId\n        source\n        roleId\n      }\n    }\n  }\n": types.CreateZucityUserRolesDocument,
    "\n  mutation enableIndexingZucityUserRoles(\n    $input: EnableIndexingZucityUserRolesInput!\n  ) {\n    enableIndexingZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n": types.EnableIndexingZucityUserRolesDocument,
    "\n  mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {\n    updateZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n": types.UpdateZucityUserRolesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSpaceMembers($resourceId: String) {\n    zucityUserRolesIndex(\n      first: 1000\n      filters: {\n        where: {\n          source: { equalTo: \"space\" }\n          resourceId: { equalTo: $resourceId }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n          customAttributes {\n            tbd\n          }\n          userId {\n            zucityProfile {\n              avatar\n              username\n              author {\n                id\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetSpaceMembersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUserRole($userId: String, $resourceId: String, $resource: String) {\n    zucityUserRolesIndex(\n      first: 1\n      filters: {\n        where: {\n          userId: { equalTo: $userId }\n          resourceId: { equalTo: $resourceId }\n          source: { equalTo: $resource }\n        }\n      }\n    ) {\n      edges {\n        node {\n          roleId\n        }\n      }\n    }\n  }\n"): typeof import('./graphql').GetUserRoleDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateZucityUserRoles($input: CreateZucityUserRolesInput!) {\n    createZucityUserRoles(input: $input) {\n      document {\n        userId {\n          id\n        }\n        created_at\n        updated_at\n        resourceId\n        source\n        roleId\n      }\n    }\n  }\n"): typeof import('./graphql').CreateZucityUserRolesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation enableIndexingZucityUserRoles(\n    $input: EnableIndexingZucityUserRolesInput!\n  ) {\n    enableIndexingZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').EnableIndexingZucityUserRolesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateZucityUserRoles($input: UpdateZucityUserRolesInput!) {\n    updateZucityUserRoles(input: $input) {\n      document {\n        id\n      }\n    }\n  }\n"): typeof import('./graphql').UpdateZucityUserRolesDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
