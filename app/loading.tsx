import { Backdrop, CircularProgress } from '@mui/material';
import * as React from 'react';

const Loading: React.FC = () => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
export default Loading;
