import { Box, Stack, Typography } from '@mui/material';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import React from 'react';
export type EditorMeterProps = {
  max: number;
  value: number;
  customStyle?: string;
};

/**
 * An EditorMeter component displays a visual indicator that provides instant feedback as
 * the user types. The EditorMeter generally shows the user the character count and how much
 * percentage they have left before they reach the maximum word count allowed.
 * @param max - a number representing the maximum
 * @param value - a number representing the current count
 * @example
 * ```tsx
 *  <EditorMeter value={50} max={100} />
 * ```
 **/
const EditorMeter: React.FC<EditorMeterProps> = (props) => {
  const { value, max } = props;
  const remainingChars = max - value;
  let displayCounter: null | number = null;

  if (remainingChars < 0) {
    displayCounter = Math.max(remainingChars, -99);
  }

  if (remainingChars === 1 || remainingChars === 0) {
    displayCounter = remainingChars;
  }

  const MIN = 0;
  const MAX = max;
  const normalise = (value: number) => ((value - MIN) * 100) / (MAX - MIN);
  const normalisedValue = normalise(value);

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      color="white"
      spacing={1}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={100}
          thickness={2}
          size={'35px'}
          sx={(theme) => ({
            color: theme.palette.grey[200],
            ...theme.applyStyles('dark', {
              color: theme.palette.grey[800],
            }),
          })}
        />
        <CircularProgress
          variant="determinate"
          value={normalisedValue}
          disableShrink
          thickness={2}
          size={'35px'}
          sx={(theme) => ({
            color: '#1a90ff',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
            ...theme.applyStyles('dark', {
              color: '#308fe8',
            }),
          })}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: 'text.secondary' }}
          >{`${Math.round(normalisedValue)}%`}</Typography>
        </Box>
      </Box>
      {displayCounter !== null && (
        <Typography variant="body2">{displayCounter}</Typography>
      )}
    </Stack>
  );
};

export default EditorMeter;
