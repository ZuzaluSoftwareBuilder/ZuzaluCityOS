export abstract class BaseRepository {
  protected getValue(value: any): any {
    return !value || value === '' ? null : value;
  }
}
