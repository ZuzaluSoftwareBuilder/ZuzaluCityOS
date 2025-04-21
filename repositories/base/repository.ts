export abstract class BaseRepository {
  protected getBooleanValue(value: any) {
    return value ? '1' : '0';
  }
  protected getValue(value: any) {
    return !value || value === '' ? null : value;
  }
}
