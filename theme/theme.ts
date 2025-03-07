'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
// Base styles
import { Colors } from './base/colors';
import { Typography } from './base/typography';

let theme = createTheme({
  palette: { ...Colors },
  breakpoints: {
    values: {
      xs: 390,
      sm: 540,
      md: 810,
      lg: 1200,
      xl: 1440,
    },
  },
  typography: { ...Typography },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#373737',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: 'inherit',
            opacity: 0.26,
          },
        },
        contained: {
          ...Typography.buttonX,
          backgroundColor: '#373737',
          padding: '6px 10px',
          '&:hover': {
            backgroundColor: '#414141',
          },
          '@media(min-width: 600px)': {
            ...Typography.buttonS,
          },
          '@media(min-width: 900px)': {
            ...Typography.buttonMSB,
          },
          '@media(min-width: 1200px)': {
            ...Typography.buttonLSB,
            padding: '8px 14px',
          },
          '@media(min-width: 1536px)': {
            ...Typography.buttonLSB,
            padding: '10px 14px',
          },
        },
        outlined: {
          ...Typography.buttonX,
          padding: '6px 10px',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          backgroundColor: '#000000',
          '&:hover': {
            backgroundColor: '#414141',
          },
          '@media(min-width: 600px)': {
            ...Typography.buttonS,
          },
          '@media(min-width: 900px)': {
            ...Typography.buttonMSB,
          },
          '@media(min-width: 1200px)': {
            ...Typography.buttonLSB,
            padding: '8px 14px',
          },
          '@media(min-width: 1536px)': {
            ...Typography.buttonLSB,
            padding: '10px 14px',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        root: {
          borderRadius: '10px',
          backgroundColor: '#313131',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: '#222222',
        },
        popupIndicator: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        clearIndicator: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        inputRoot: {
          borderRadius: '10px',
          backgroundColor: '#313131',
        },
      },
      defaultProps: {
        size: 'small',
      },
    },
    MuiTimePicker: {
      defaultProps: {
        sx: {
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#313131',
            borderRadius: '10px',
          },
        },
        slotProps: {
          popper: {
            sx: {
              ...{
                '& .MuiPickersDay-root': { color: 'black' },
                '& .MuiPickersDay-root.Mui-selected': {
                  backgroundColor: '#D7FFC4',
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: 'black',
                },
                '& .MuiMultiSectionDigitalClock-root': {
                  color: 'black',
                },
              },
            },
          },
        },
      },
    },
    MuiDesktopDatePicker: {
      defaultProps: {
        sx: {
          '& .MuiSvgIcon-root': {
            color: 'white',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#313131',
            borderRadius: '10px',
          },
        },
        slotProps: {
          popper: {
            sx: {
              '& .MuiPickersDay-root': { color: 'black' },
              '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: '#D7FFC4',
              },
              '& .MuiPickersCalendarHeader-root': {
                color: 'black',
              },
              '& .MuiMultiSectionDigitalClock-root': {
                color: 'black',
              },
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#222222',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#7DFFD1',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& > div > input': {
            padding: '8.5px 12px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#7DFFD1',
          textDecorationColor: '#7DFFD1',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
