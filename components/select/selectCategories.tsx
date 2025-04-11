import SelectCheckItem from '@/components/select/selectCheckItem';
import { SPACE_CATEGORIES } from '@/constant';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useCallback } from 'react';

const filter = createFilterOptions<FilmOptionType>();

interface IProps {
  options?: FilmOptionType[];
  onChange: (value: string[]) => void;
  initialValues?: FilmOptionType[];
  value?: string[];
  isDisabled?: boolean;
}

export default function SelectCategories({
  onChange,
  value: outerValue,
  initialValues = [],
  options = SPACE_CATEGORIES,
  isDisabled = false,
}: IProps) {
  const [value, setValue] = React.useState<FilmOptionType[]>(initialValues);
  React.useEffect(() => {
    if (outerValue) {
      setValue(
        outerValue.map((item) => ({ value: item, label: item, isAdd: false })),
      );
    }
  }, [outerValue]);

  const handleChange = useCallback(
    (value: FilmOptionType[]) => {
      if (!outerValue) {
        setValue(value);
      }
      onChange(value.map((item) => item.value) || []);
    },
    [onChange],
  );

  return (
    <Autocomplete
      size="small"
      multiple
      value={value}
      onChange={(event, newValue) => handleChange(newValue)}
      disabled={isDisabled}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.label,
        );
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            value: inputValue,
            label: `Add "${inputValue}"`,
            isAdd: true,
          });
        }

        return filtered;
      }}
      disablePortal
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      getOptionLabel={(option) => {
        if ((option as any).isAdd) {
          return option.value;
        }
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props as any;
        return (
          <li key={key} {...optionProps}>
            <SelectCheckItem
              label={option.label}
              isChecked={
                value.findIndex((item) => item.value === option.value) > -1
              }
              showCheck={!(option as any).isAdd}
            />
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <SearchIcon
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  />
                  <React.Fragment>
                    {params.InputProps.startAdornment}
                  </React.Fragment>
                </>
              ),
            }}
          />
        );
      }}
    />
  );
}

interface FilmOptionType {
  value: string;
  label: string;
  isAdd?: boolean;
}
