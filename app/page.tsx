'use client';
import * as React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { ZuCalendar } from '@/components/core';
import Carousel from 'components/Carousel';
import { Header, Sidebar } from 'components/layout';
import {
  RightArrowCircleIcon,
  SpaceIcon,
  RightArrowIcon,
  EventIcon,
} from 'components/icons';
import { EventCard } from 'components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { MOCK_DATA } from 'mock';
import { WalletProvider } from '../context/WalletContext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { CeramicProvider } from '../context/CeramicContext';
// import { useCeramicContext } from '../context/CeramicContext';
import AuthPrompt from '@/components/AuthPrompt';
const queryClient = new QueryClient();

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  // const { isAuthPromptVisible } = useCeramicContext();
  // const isDesktop:q = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <QueryClientProvider client={queryClient}>
      <CeramicProvider>
        <WalletProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <Header />
              <AuthPrompt />
              <Box display={"flex"}>
                {!isTablet && <Sidebar selected="Home" />}
                <Box width={isTablet ? '100%' : 'calc(100% - 260px)'}>
                  <Box
                    borderLeft="1px solid #383838"
                    flexGrow={1}
                    padding={isMobile ? '10px' : '30px'}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      borderRadius="10px"
                      padding="40px 40px"
                      sx={{
                        backgroundImage: 'url("4.webp")',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                      }}
                    >
                      <Typography
                        color={theme.palette.text.primary}
                        variant={isMobile ? 'h1' : 'hB'}
                      >
                        Zuzalu City
                      </Typography>
                      <Typography
                        color="white"
                        variant="bodyB"
                        marginBottom="20px"
                      >
                        Welcome to the new Zuzalu City
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#383838',
                          color: 'white',
                          width: isMobile ? '100%' : '200px',
                          borderRadius: '10px',
                        }}
                        startIcon={<RightArrowIcon />}
                      >
                        Learn About v2
                      </Button>
                    </Box>
                  </Box>
                  <Box paddingTop={"30px"} boxSizing={'border-box'} width={'100%'} flexGrow={1} borderLeft="1px solid #383838">
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      paddingLeft={isMobile ? '10px' : "30px"}
                      paddingRight={isMobile ? '10px' : "30px"}
                      boxSizing={'border-box'}
                    >
                      <Box display="flex" alignItems="center" gap="10px">
                        <SpaceIcon />
                        <Typography
                          variant={isMobile ? 'subtitleMB' : 'subtitleLB'}
                          color="white"
                        >
                          Explore Spaces
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap="10px">
                        <Typography color="white" variant="bodyM">
                          View All Spaces
                        </Typography>
                        <RightArrowCircleIcon />
                      </Box>
                    </Box>
                    <Box marginY="20px" paddingLeft={isMobile ? '10px' : "30px"} paddingRight={isMobile ? '10px' : "30px"}>
                      <Typography color="white" variant="bodyM">
                        Most Active Spaces
                      </Typography>
                    </Box>
                    <Box height={'317px'} width={'100%'} boxSizing={'border-box'} overflow={'auto'} position={'relative'} paddingLeft={isMobile ? '10px' : "30px"} paddingRight={isMobile ? '10px' : "30px"}>
                      <Carousel items={MOCK_DATA.spaces} />
                    </Box>
                    {/* {isDesktop && <LotteryCard />} */}
                    <Box display="flex" gap="20px" marginTop="20px" boxSizing={'border-box'} paddingLeft={isMobile ? '10px' : "30px"} paddingRight={isMobile ? '10px' : "30px"}>
                      <Box
                        position='relative'
                        flexGrow={1}
                        display="flex"
                        flexDirection="column"
                        gap="20px"
                        overflow='auto'
                        maxHeight='95vh'
                      >
                        <Box display="flex" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap="10px">
                            <EventIcon />
                            <Typography color="white" variant="subtitleLB">
                              Events
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap="10px">
                            <Typography color="white" variant="bodyB">
                              View All Events
                            </Typography>
                            <RightArrowCircleIcon />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            position: 'sticky',
                            top: 60,
                          }}
                          color="white"
                          border="1px solid #383838"
                          align="center"
                          paddingY="8px"
                          borderRadius="40px"
                          variant="subtitleS"
                          bgcolor='rgba(34, 34, 34, 0.8)'
                        >
                          October 2023
                        </Typography>
                        <Box>
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                          <EventCard />
                        </Box>
                      </Box>
                      {!isTablet && (
                        <Box
                          width="360px"
                          display="flex"
                          flexDirection="column"
                          gap="20px"
                        >
                          <Typography
                            color="white"
                            variant="subtitleS"
                            padding="20px 10px"
                            borderBottom="1px solid #383838"
                          >
                            Sort & Filter Sessions
                          </Typography>
                          <Box
                            display="flex"
                            gap="4px"
                            padding="2px"
                            borderRadius="10px"
                            bgcolor="#2d2d2d"
                          >
                            <Button
                              sx={{
                                flex: 1,
                                backgroundColor: '#424242',
                                borderRadius: '8px',
                                color: 'white',
                                fontFamily: 'Inter',
                              }}
                            >
                              Upcoming
                            </Button>
                            <Button
                              sx={{
                                flex: 1,
                                backgroundColor: '#2d2d2d',
                                borderRadius: '8px',
                                color: 'white',
                                fontFamily: 'Inter',
                              }}
                            >
                              Past
                            </Button>
                          </Box>
                          <Box>

                            <ZuCalendar defaultValue={dayjs('2022-04-17')} />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </LocalizationProvider>
        </WalletProvider>
      </CeramicProvider>
    </QueryClientProvider>
  );
};

export default Home;