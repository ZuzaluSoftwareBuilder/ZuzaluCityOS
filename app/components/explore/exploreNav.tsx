import { CubeIcon, GlobalIcon } from '@/components/icons';
import { Stack, Box, Button, styled, Chip, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const NavButton = styled(Button)(
  ({ isDisabled }: { isDisabled?: boolean }) => ({
    color: '#fff',
    padding: '14px',
    minWidth: 'auto',
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.4,
    opacity: 0.34,
    whiteSpace: 'nowrap',
    ...(isDisabled && {
      cursor: 'not-allowed',
    }),
    '&.active': {
      opacity: 1,
    },
  }),
);

const Indicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  height: '1px',
  backgroundColor: '#DFDFDF',
  transition: 'all 0.3s ease',
  marginLeft: '0 !important',
}));

export interface INavItem {
  label: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
}

export interface IExploreNavProps {
  navItems: INavItem[];
  onNavChange?: (item: INavItem, index: number) => void;
}

export default function ExploreNav({
  navItems,
  onNavChange,
}: IExploreNavProps) {
  const [activeTab, setActiveTab] = useState(navItems[0].label);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: '0px',
    width: '0px',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeButton = document.querySelector('.active');
      if (activeButton) {
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect =
          activeButton.parentElement?.getBoundingClientRect();

        if (containerRect) {
          setIndicatorStyle({
            left: `${buttonRect.left - containerRect.left}px`,
            width: `${buttonRect.width}px`,
          });
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleTabClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: INavItem,
    index: number,
  ) => {
    if (item.isComingSoon) return;

    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const containerRect = button.parentElement?.getBoundingClientRect();

    if (containerRect) {
      setIndicatorStyle({
        left: `${buttonRect.left - containerRect.left}px`,
        width: `${buttonRect.width}px`,
      });
    }

    setActiveTab(item.label);
    onNavChange?.(item, index);
  };

  return (
    <Stack
      direction="row"
      position="sticky"
      top="50px"
      zIndex="1000"
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        p: '0 10px',
        bgcolor: 'rgba(34, 34, 34)',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Stack
        direction="row"
        position="relative"
        sx={{
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
        }}
      >
        {navItems.map((item, index) => (
          <NavButton
            key={item.label}
            className={activeTab === item.label ? 'active' : ''}
            startIcon={item.icon}
            onClick={(e) => handleTabClick(e, item, index)}
            disableRipple
            isDisabled={!!item.isComingSoon}
          >
            {item.label}
            {item.isComingSoon && (
              <Typography
                fontSize={13}
                fontWeight={400}
                ml="10px"
                sx={{ whiteSpace: 'nowrap' }}
              >
                (Coming Soon)
              </Typography>
            )}
          </NavButton>
        ))}
        <Indicator sx={indicatorStyle} />
      </Stack>
    </Stack>
  );
}
