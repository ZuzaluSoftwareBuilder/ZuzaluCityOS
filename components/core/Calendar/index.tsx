import { styled } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const ZuCalendar = styled(DateCalendar)({
  // backgroundColor: '#424242',
  color: 'white',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)',
  '& .MuiDayCalendar-weekDayLabel': {
    color: 'white',
    fontSize: '18px',
    fontWeight: 500,
    fontFamily: 'Inter',
  },
  '& .MuiPickersDay-dayWithMargin': {
    fontFamily: 'Inter',
    color: '#ccc',
    fontSize: '16px',
    fontWeight: 500,
  },
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .Mui-selected.MuiPickersDay-dayWithMargin': {
    backgroundColor: 'rgba(125, 255, 209, 0.20)',
    border: '1px solid rgba(125, 255, 209, 0.40)',
    color: '#7DFFD1',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  '& .Mui-disabled.MuiPickersDay-dayWithMargin': {
    fontFamily: 'Inter',
    color: '#fff !important',
    opacity: 0.5,
    fontSize: '16px',
    fontWeight: 500,
    textDecoration: 'line-through',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  '& .MuiPickersYear-yearButton': {
    lineHeight: 1.75,
    fontSize: '1.25rem',
  },
  '& .MuiPickersDay-root:not(.Mui-selected)': {
    border: 'none',
  },
});

export default ZuCalendar;
