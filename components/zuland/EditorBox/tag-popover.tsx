import { Tag } from '@akashaorg/typings/lib/ui';
import { Box, Button, Paper, Popper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import * as React from 'react';

export interface ITagPopover {
  postsLabel?: string;
  values: Tag[];
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
}

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  width: '100%',
  justifyContent: 'flex-start',
  padding: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const TagPopover = React.forwardRef<HTMLDivElement, ITagPopover>(
  (props, ref) => {
    const {
      postsLabel = 'posts',
      values,
      currentIndex,
      setIndex,
      handleSelect,
    } = props;

    return (
      <Popper ref={ref} open={true} style={{ zIndex: 1300 }}>
        <Paper elevation={3}>
          <Box sx={{ p: 1, minWidth: '12rem', maxWidth: '20rem' }}>
            {values.map((value, i) => (
              <StyledButton
                key={i}
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setIndex(i)}
                sx={{
                  backgroundColor:
                    i === currentIndex ? 'action.selected' : 'transparent',
                }}
              >
                <Box>
                  <Typography variant="body1">#{value.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${value.totalPosts} ${postsLabel}`}
                  </Typography>
                </Box>
              </StyledButton>
            ))}
          </Box>
        </Paper>
      </Popper>
    );
  },
);

TagPopover.displayName = 'TagPopover';
