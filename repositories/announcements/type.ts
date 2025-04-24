import { Announcement } from '@/models/announcement';
import { Result } from '@/models/base';
import { BaseRepository } from '../base/repository';

export interface CreateAnnouncementInput {
  title: string;
  description: string;
  tags: string[];
  author: string;
  spaceId: string;
}

export interface UpdateAnnouncementInput {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface IAnnouncementRepository {
  create(_input: CreateAnnouncementInput): Promise<Result<Announcement>>;
  update(
    _id: string,
    _input: UpdateAnnouncementInput,
  ): Promise<Result<Announcement>>;
  getAnnouncementsBySpace(_spaceId: string): Promise<Result<Announcement[]>>;
  getAnnouncement(_id: string): Promise<Result<Announcement>>;
  deleteAnnouncement(_id: string): Promise<Result<boolean>>;
}

export abstract class BaseAnnouncementRepository
  extends BaseRepository
  implements IAnnouncementRepository
{
  abstract create(
    _input: CreateAnnouncementInput,
  ): Promise<Result<Announcement>>;
  abstract update(
    _id: string,
    _input: UpdateAnnouncementInput,
  ): Promise<Result<Announcement>>;
  abstract getAnnouncementsBySpace(
    _spaceId: string,
  ): Promise<Result<Announcement[]>>;
  abstract getAnnouncement(_id: string): Promise<Result<Announcement>>;
  abstract deleteAnnouncement(_id: string): Promise<Result<boolean>>;
}
