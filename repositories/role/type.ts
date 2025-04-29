import { Result } from '@/models/base';
import { CreateUserRole, UpdateUserRole, UserRole } from '@/models/role';
import { BaseRepository } from '../base/repository';

export interface IRoleRepository {
  getMembers(_resource: string, _id: string): Promise<Result<UserRole[]>>;
  getOwnedRole(_id: string): Promise<Result<UserRole[]>>;
  getUserRole(
    _id: string,
    _resource: string,
    _userId: string,
  ): Promise<Result<UserRole[]>>;
  createRole(_role: CreateUserRole): Promise<Result<UserRole>>;
  updateRole(_id: string, _role: UpdateUserRole): Promise<Result<UserRole>>;
  deleteRole(_id: string): Promise<Result<UserRole>>;
}

export abstract class BaseRoleRepository
  extends BaseRepository
  implements IRoleRepository
{
  abstract getMembers(
    _resource: string,
    _id: string,
  ): Promise<Result<UserRole[]>>;
  abstract getOwnedRole(_id: string): Promise<Result<UserRole[]>>;
  abstract getUserRole(
    _id: string,
    _resource: string,
    _userId: string,
  ): Promise<Result<UserRole[]>>;
  abstract createRole(_role: CreateUserRole): Promise<Result<UserRole>>;
  abstract updateRole(
    _id: string,
    _role: UpdateUserRole,
  ): Promise<Result<UserRole>>;
  abstract deleteRole(_id: string): Promise<Result<UserRole>>;
}
