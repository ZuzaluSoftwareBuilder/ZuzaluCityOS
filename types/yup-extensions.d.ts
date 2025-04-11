import dayjs from 'dayjs';
import { ITimezoneOption } from 'react-timezone-select';
import * as Yup from 'yup';

declare module 'yup' {
  interface MixedSchema<TType = any, TContext = any, TOut = any> {
    dayjs(): Yup.DateSchema<dayjs.Dayjs | null | undefined, TContext>;
    timezone(): Yup.ObjectSchema<ITimezoneOption | null | undefined, TContext>;
  }

  interface StringSchema<
    TType extends string | null | undefined = string | undefined,
    TContext = any,
    TOut extends TType = TType,
  > extends Yup.BaseSchema<TType, TContext, TOut> {
    notEmptyJson(message?: string): StringSchema<string, TContext, string>;
  }
}
