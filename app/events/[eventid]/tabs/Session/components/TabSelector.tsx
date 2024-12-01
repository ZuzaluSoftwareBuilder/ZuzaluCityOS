import { ChevronDoubleRightIcon } from '@/components/icons';
import { Stack, Button, styled, Typography } from '@mui/material';
import { useState } from 'react';

interface TabButtonProps {
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface TabSelectorProps {
  defaultTab?: 'all' | 'upcoming';
  onChange?: (tab: 'all' | 'upcoming') => void;
}

const TabButton = styled(Stack)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    color: '#fff',
    opacity: selected ? 1 : 0.5,
    backgroundColor: !selected ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 700,
    lineHeight: '1.2',
    cursor: 'pointer',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '5px',
  }),
);

const TabContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  borderRadius: '10px',
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  height: '30px',
}));

export default function TabSelector({
  defaultTab = 'upcoming',
  onChange,
}: TabSelectorProps) {
  const [selected, setSelected] = useState<'all' | 'upcoming'>(defaultTab);

  const handleTabChange = (tab: 'all' | 'upcoming') => {
    setSelected(tab);
    onChange?.(tab);
  };

  return (
    <TabContainer>
      <TabButton
        selected={selected === 'all'}
        onClick={() => handleTabChange('all')}
      >
        <ChevronDoubleRightIcon size={5} />
        All
      </TabButton>
      <TabButton
        selected={selected === 'upcoming'}
        onClick={() => handleTabChange('upcoming')}
      >
        <ChevronDoubleRightIcon size={5} />
        Upcoming
      </TabButton>
    </TabContainer>
  );
}
