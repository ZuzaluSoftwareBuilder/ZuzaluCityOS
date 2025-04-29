import { Result } from '@/models/base';
import {
  CreateSpaceGatingInput,
  SpaceGating,
  UpdateSpaceGatingInput,
} from '@/models/spaceGating';
import { supabase } from '@/utils/supabase/client';
import { BaseSpaceGatingRepository } from './type';

export class SupaSpaceGatingRepository extends BaseSpaceGatingRepository {
  async getBySpaceId(spaceId: string): Promise<Result<SpaceGating | null>> {
    const { data, error } = await supabase
      .from('space_gating')
      .select('*')
      .eq('space_id', spaceId)
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    if (!data) {
      return this.createResponse(null);
    }

    return this.createResponse(this.transformSpaceGating(data));
  }

  async create(
    spaceGating: CreateSpaceGatingInput,
  ): Promise<Result<SpaceGating>> {
    const { data, error } = await supabase
      .from('space_gating')
      .insert({
        space_id: spaceGating.spaceId,
        role_id: spaceGating.roleId,
        gating_status: this.getValue(spaceGating.gatingStatus),
        gating_condition: this.getValue(spaceGating.gatingCondition),
        erc721_contract_address: this.getValue(
          spaceGating.erc721ContractAddress,
        ),
        erc20_contract_address: this.getValue(spaceGating.erc20ContractAddress),
        erc1155_contract_address: this.getValue(
          spaceGating.erc1155ContractAddress,
        ),
        poaps_id: this.getValue(spaceGating.poapsId),
        zu_pass_info: this.getValue(spaceGating.zuPassInfo),
      })
      .select()
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(this.transformSpaceGating(data));
  }

  async update(
    id: string,
    spaceGating: UpdateSpaceGatingInput,
  ): Promise<Result<SpaceGating>> {
    const { data, error } = await supabase
      .from('space_gating')
      .update({
        role_id: spaceGating.roleId,
        gating_status: this.getValue(spaceGating.gatingStatus),
        gating_condition: this.getValue(spaceGating.gatingCondition),
        erc721_contract_address: this.getValue(
          spaceGating.erc721ContractAddress,
        ),
        erc20_contract_address: this.getValue(spaceGating.erc20ContractAddress),
        erc1155_contract_address: this.getValue(
          spaceGating.erc1155ContractAddress,
        ),
        poaps_id: this.getValue(spaceGating.poapsId),
        zu_pass_info: this.getValue(spaceGating.zuPassInfo),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(this.transformSpaceGating(data));
  }

  async delete(id: string): Promise<Result<boolean>> {
    const { error } = await supabase.from('space_gating').delete().eq('id', id);

    if (error) {
      return this.createResponse(null, error);
    }

    return this.createResponse(true);
  }

  public transformSpaceGating(data: any): SpaceGating {
    return {
      id: data.id,
      spaceId: data.space_id,
      roleId: data.role_id,
      gatingStatus: data.gating_status,
      gatingCondition: data.gating_condition,
      erc721ContractAddress: data.erc721_contract_address,
      erc20ContractAddress: data.erc20_contract_address,
      erc1155ContractAddress: data.erc1155_contract_address,
      poapsId: data.poaps_id,
      zuPassInfo: data.zu_pass_info,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
