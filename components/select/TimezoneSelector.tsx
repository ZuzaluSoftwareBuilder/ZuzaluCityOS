import { TimezoneSelectorProps } from '@/types';
import { Autocomplete, TextField } from '@mui/material';
import {
  allTimezones,
  ITimezoneOption,
  useTimezoneSelect,
} from 'react-timezone-select';
import { useEffect, useState } from 'react';

export const TimezoneSelector = ({
  setSelectedTimezone,
  sx,
  value,
}: TimezoneSelectorProps) => {
  const { options } = useTimezoneSelect({ timezones: allTimezones });
  const [data, setData] = useState<ITimezoneOption | null>(null);

  const handleChange = (val: ITimezoneOption) => {
    setData(val);
    setSelectedTimezone(val);
  };

  useEffect(() => {
    if (value?.value !== data?.value) {
      setData(value!);
    }
  }, [data?.value, value, value?.value]);

  return (
    <Autocomplete
      size="small"
      value={data}
      disablePortal
      options={options}
      sx={{ ...sx, borderRadius: '10px' }}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.value === value.value;
      }}
      getOptionLabel={(option) => option.label || ''}
      renderInput={(params) => <TextField {...params} />}
      onChange={(e, val) => val && handleChange(val)}
    />
  );
};
