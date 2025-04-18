import {
  CreateSpaceInput,
  Space,
  SpaceFilters,
  UpdateSpaceInput,
} from '@/models/space';

export interface ISpaceRepository {
  create(data: CreateSpaceInput): Promise<Space | null>;
  update(id: string, data: UpdateSpaceInput): Promise<Space | null>;
  getById(id: string): Promise<Space | null>;
  getAll(filters?: SpaceFilters): Promise<Space[]>;
}
