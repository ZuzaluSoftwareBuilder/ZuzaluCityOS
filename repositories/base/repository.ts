import { ErrorResult, Result, SuccessResult } from '@/models/base';

export abstract class BaseRepository {
  protected getBooleanValue(value: any): string {
    if (!value || value === '0') return '0';
    return '1';
  }
  protected setBooleanValue(value: string): boolean {
    return value === '1';
  }
  protected getValue(value: any): any {
    return !value || value === '' ? null : value;
  }

  protected handleError<T>(message: string, error: any, defaultValue: T): T {
    console.error(`${message}:`, error);
    return defaultValue;
  }
  /**
   * Create a standardized response
   * @template T Data type
   * @param data Data when successful
   * @param error Error information
   * @returns Standardized response object
   */
  protected createResponse<T>(data: T | null, error: any = null): Result<any> {
    if (error) {
      const err =
        error instanceof Error
          ? error
          : new Error(error.message || String(error));
      const result: ErrorResult = { data: null, error: err };
      return result;
    }

    if (data === null) {
      const result: ErrorResult = {
        data: null,
        error: new Error('No data available'),
      };
      return result;
    }

    const result: SuccessResult<T> = { data, error: null };
    return result;
  }

  /**
   * Handle GraphQL query results
   * @param response GraphQL response containing data and errors
   * @param errorMessage Error message prefix
   * @returns Result containing error if present, otherwise empty Result object
   */
  protected handleGraphQLResponse<T>(
    response: { data?: T; errors?: any[] },
    errorMessage: string = 'GraphQL Error',
  ): Result<T | null> {
    // Handle GraphQL errors
    if (response.errors && response.errors.length > 0) {
      const errorMsg = response.errors
        .map((e: any) => e.message || String(e))
        .join('; ');
      return this.createResponse(
        null,
        new Error(`${errorMessage}: ${errorMsg}`),
      );
    }

    // Check if data exists
    if (!response.data) {
      return this.createResponse(
        null,
        new Error(`${errorMessage}: No data returned`),
      );
    }

    // Return empty Result if no errors
    return { data: null, error: null };
  }
}
