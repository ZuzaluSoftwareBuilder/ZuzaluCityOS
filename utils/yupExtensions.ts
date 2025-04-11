import dayjs from 'dayjs';
import { ITimezoneOption } from 'react-timezone-select';
import * as Yup from 'yup';

Yup.addMethod(Yup.mixed, 'dayjs', function dayjsSchema() {
  return this.test(
    'is-dayjs',
    '${path} must be a valid Day.js object',
    function (value) {
      if (value === null || value === undefined) {
        return true;
      }
      return dayjs.isDayjs(value);
    },
  ).transform((value) => {
    return dayjs.isDayjs(value) ? value : dayjs(value);
  });
});

Yup.addMethod(Yup.mixed, 'timezone', function timezoneSchema() {
  return this.test(
    'is-timezone',
    '${path} must be a valid timezone',
    function (value) {
      return value === null || value === undefined || typeof value === 'string';
    },
  ).transform((value) => {
    return value as ITimezoneOption;
  });
});

Yup.addMethod(
  Yup.string,
  'notEmptyJson',
  function (message = 'JSON cannot be empty') {
    return this.test({
      name: 'is-not-empty',
      message,
      test: function (value) {
        if (!value) return false;
        try {
          const parsed = JSON.parse(value);
          return !parsed.isEmpty;
        } catch (e) {
          return false;
        }
      },
    });
  },
);

export default Yup;
