import { Result } from '@/models/base';
import {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
} from '@/models/calendar';
import { BaseRepository } from '../base/repository';

/**
 * Calendar repository interface
 */
export interface ICalendarRepository {
  create(_data: CreateCalendarInput): Promise<Result<Calendar>>;
  update(_id: string, _data: UpdateCalendarInput): Promise<Result<Calendar>>;
  getById(_id: string): Promise<Result<Calendar>>;
  getBySpaceId(_spaceId: string): Promise<Result<Calendar[]>>;
  delete(_id: string): Promise<Result<boolean>>;
}

/**
 * Base calendar repository abstract class
 */
export abstract class BaseCalendarRepository
  extends BaseRepository
  implements ICalendarRepository
{
  abstract create(_data: CreateCalendarInput): Promise<Result<Calendar>>;
  abstract update(
    _id: string,
    _data: UpdateCalendarInput,
  ): Promise<Result<Calendar>>;
  abstract getById(_id: string): Promise<Result<Calendar>>;
  abstract getBySpaceId(_spaceId: string): Promise<Result<Calendar[]>>;
  abstract delete(_id: string): Promise<Result<boolean>>;

  /**
   * Transform data source format to unified Calendar model
   */
  protected abstract transformToCalendar(_sourceData: any): Calendar | null;
}
