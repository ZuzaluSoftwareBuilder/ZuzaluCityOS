import BpCheckbox from '@/components/event/Checkbox';
import { Box, Stack, Typography } from '@mui/material';

interface IProps {
  checked: boolean;
  title: string;
  desc: string;
  handleChange: () => void;
}

export function FormatCheckbox({ checked, title, desc, handleChange }: IProps) {
  return (
    <Box
      borderRadius="10px"
      padding="10px"
      display="flex"
      alignItems="center"
      gap="10px"
      flex={1}
      onClick={handleChange}
      sx={{
        opacity: checked ? 1 : 0.7,
        background: checked
          ? 'linear-gradient(90deg, rgba(125, 255, 209, 0.15) 0.01%, rgba(255, 255, 255, 0.03) 99.99%)'
          : 'rgba(255, 255, 255, 0.05)',
        cursor: 'pointer',
      }}
    >
      <BpCheckbox checked={checked} />
      <Stack spacing="4px">
        <Typography
          color="white"
          fontSize="18px"
          fontWeight={700}
          lineHeight={1.2}
        >
          {title}
        </Typography>
        <Typography color="white" fontSize="10px" lineHeight={1.2}>
          {desc}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function FormatCheckboxGroup({
  checked,
  handleChange,
}: Omit<IProps, 'title' | 'desc'>) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      gap="20px"
      width={'100%'}
    >
      <FormatCheckbox
        checked={checked}
        title="In-Person"
        desc="This is a physical event"
        handleChange={handleChange}
      />
      <FormatCheckbox
        checked={!checked}
        title="Online"
        desc="Specially Online Event"
        handleChange={handleChange}
      />
    </Box>
  );
}
