import { Result } from '@/models/base';
import { CreateDappInput, Dapp, UpdateDappInput } from '@/models/dapp';
import { BaseRepository } from '../base/repository';

export interface IDappRepository {
  create(_dappInput: CreateDappInput): Promise<Result<Dapp>>;
  update(_id: string, _dappInput: UpdateDappInput): Promise<Result<Dapp>>;
  getDapps(): Promise<Result<Dapp[]>>;
}

export abstract class BaseDappRepository
  extends BaseRepository
  implements IDappRepository
{
  abstract create(_dappInput: CreateDappInput): Promise<Result<Dapp>>;
  abstract update(
    _id: string,
    _dappInput: UpdateDappInput,
  ): Promise<Result<Dapp>>;
  abstract getDapps(): Promise<Result<Dapp[]>>;
}
