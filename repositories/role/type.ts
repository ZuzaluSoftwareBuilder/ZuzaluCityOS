import { Result } from '@/models/base';
import { UserRole } from '@/models/role';
import { BaseRepository } from '../base/repository';

export interface IRoleRepository {
  getMembers(_resource: string, _id: string): Promise<Result<UserRole[]>>;
  getOwnedRole(_id: string): Promise<Result<UserRole[]>>;
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
}
