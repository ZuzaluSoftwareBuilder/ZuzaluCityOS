import { PipelineEdDSATicketZuAuthConfig } from '@pcd/passport-interface';

export interface ZuPassInfo extends Partial<PipelineEdDSATicketZuAuthConfig> {
  access?: string;
  eventId: string;
  eventName: string;
  registration: string;
}

export interface PoapsId {
  poapId: number;
}

export interface SpaceGating {
  id: string;
  spaceId: string;
  roleId?: string;
  gatingStatus?: string;
  gatingCondition?: string;
  erc721ContractAddress?: string;
  erc20ContractAddress?: string;
  erc1155ContractAddress?: string;
  poapsId?: PoapsId[];
  zuPassInfo?: ZuPassInfo;
  createdAt: string;
  updatedAt: string;
}

export type CreateSpaceGatingInput = Omit<
  SpaceGating,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateSpaceGatingInput = Partial<
  Omit<SpaceGating, 'id' | 'spaceId' | 'createdAt' | 'updatedAt'>
>;
