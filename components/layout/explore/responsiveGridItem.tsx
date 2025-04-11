import { Grid, GridProps } from '@mui/material';
import React from 'react';

interface ResponsiveGridItemProps extends Omit<GridProps, 'item'> {
  children: React.ReactNode;
  gap?: number;
}

const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  gap = 20,
  ...rest
}) => {
  return (
    <Grid
      item
      xl={3}
      lg={4}
      md={6}
      sm={12}
      xs={12}
      gap={gap}
      sx={{
        '@media (max-width: 809px)': {
          maxWidth: '100% !important',
          flexBasis: '100% !important',
        },
        '@media (min-width: 810px) and (max-width: 1199px)': {
          maxWidth: '50% !important',
          flexBasis: '50% !important',
        },
        '@media (min-width: 1200px) and (max-width: 1399px)': {
          maxWidth: '33.333% !important',
          flexBasis: '33.333% !important',
        },
        '@media (min-width: 1400px)': {
          maxWidth: '25% !important',
          flexBasis: '25% !important',
        },
        ...(rest.sx || {}),
      }}
      {...rest}
    >
      {children}
    </Grid>
  );
};

export default ResponsiveGridItem;
