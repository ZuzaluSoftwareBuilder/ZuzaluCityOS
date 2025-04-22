import { CreateDappInput, Dapp, UpdateDappInput } from '@/models/dapp';
import { BaseRepository } from '../base/repository';

export interface IDappRepository {
  create(_dappInput: CreateDappInput): Promise<string | null>;
  update(_id: string, _dappInput: UpdateDappInput): Promise<string | null>;
  getDapps(): Promise<Dapp[]>;
}

export abstract class BaseDappRepository
  extends BaseRepository
  implements IDappRepository
{
  abstract create(_dappInput: CreateDappInput): Promise<string | null>;
  abstract update(
    _id: string,
    _dappInput: UpdateDappInput,
  ): Promise<string | null>;
  abstract getDapps(): Promise<Dapp[]>;
}
