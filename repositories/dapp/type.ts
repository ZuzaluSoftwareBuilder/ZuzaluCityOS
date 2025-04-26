import { Result } from '@/models/base';
import {
  CreateDappInput,
  Dapp,
  InstalledApp,
  UpdateDappInput,
} from '@/models/dapp';
import { BaseRepository } from '../base/repository';

export interface IDappRepository {
  create(_dappInput: CreateDappInput): Promise<Result<Dapp>>;
  update(_id: string, _dappInput: UpdateDappInput): Promise<Result<Dapp>>;
  getDapps(): Promise<Result<Dapp[]>>;
  getDappById(_id: string): Promise<Result<Dapp>>;
  installDapp(
    _spaceId: string,
    _dappId: string,
    _nativeAppName?: string,
  ): Promise<Result<InstalledApp>>;
  getSpaceInstalledApps(_spaceId: string): Promise<Result<InstalledApp[]>>;
  uninstallDapp(_installedAppId: string): Promise<Result<InstalledApp>>;
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
  abstract getDappById(_id: string): Promise<Result<Dapp>>;
  abstract installDapp(
    _spaceId: string,
    _dappId: string,
    _nativeAppName?: string,
  ): Promise<Result<InstalledApp>>;
  abstract getSpaceInstalledApps(
    _spaceId: string,
  ): Promise<Result<InstalledApp[]>>;
  abstract uninstallDapp(
    _installedAppId: string,
  ): Promise<Result<InstalledApp>>;
}
