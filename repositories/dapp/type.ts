import { BaseRepository } from '../base/repository';

export interface IDappRepository {
  create(_dappInput: any): Promise<string | null>;
  update(_id: string, _dappInput: any): Promise<string | null>;
}

export abstract class BaseDappRepository
  extends BaseRepository
  implements IDappRepository
{
  abstract create(_dappInput: any): Promise<string | null>;
  abstract update(_id: string, _dappInput: any): Promise<string | null>;
}
