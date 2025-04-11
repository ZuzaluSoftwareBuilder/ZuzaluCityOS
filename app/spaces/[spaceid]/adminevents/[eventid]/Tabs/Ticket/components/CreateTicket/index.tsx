import { ZuInput, ZuSwitch } from '@/components/core';
import FormUploader from '@/components/form/FormUploader';
import {
  CheckCircleIcon,
  CheckIcon,
  CircleCloseIcon,
  CopyIcon,
  GoToExplorerIcon,
  RightArrowIcon,
  ScrollIcon,
  USDCIcon,
  USDTIcon,
  UncheckCircleIcon,
} from '@/components/icons';
import { SCROLL_EXPLORER, STARTING_STATUS } from '@/constant';
import { shortenAddress } from '@/utils/format';
import { SelectedFile } from '@lxdao/uploader3';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Dayjs } from 'dayjs';
import Image from 'next/image';
import React from 'react';
import { ButtonGroup } from '../Common';

interface IProps {
  setIsConfirm?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setGoToSummary?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setPurchasingTicket?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsNext?: React.Dispatch<React.SetStateAction<boolean>> | any;
  toggleDrawer?: any;
  handleChange?: any;
  isTicketFree?: boolean;
  setIsTicketFree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isShowQtyRemaining?: boolean;
  setIsShowQtyRemaining?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideUntilSetDate?: boolean;
  setIsHideUntilSetDate?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isWhiteList?: boolean;
  setIsWhiteList?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideAfterSetDate?: boolean;
  setIsHideAfterSetDate?: React.Dispatch<React.SetStateAction<boolean>> | any;
  isHideWhenSoldOut?: boolean;
  setIsHideWhenSoldOut?: React.Dispatch<React.SetStateAction<boolean>> | any;
  selectedToken?: string;
  setSelectedToken?: React.Dispatch<React.SetStateAction<boolean>> | any;
  selectedWhiteListTicket?: boolean;
  setSelectedWhiteListTicket?:
    | React.Dispatch<React.SetStateAction<string>>
    | any;
  ticketInfo?: any;
  handleSubmit?: any;
  selectedFile?: string | null;
  setSelectedFile?: React.Dispatch<React.SetStateAction<string | null>> | any;
  previewImage?: string | null;
  setPreviewImage?: React.Dispatch<React.SetStateAction<string | null>> | any;
  handleFileChange?: any;
  ticketMintDeadline?: any;
  setTicketMintDeadline?: any;
  isSubmitLoading?: boolean;
  txnHash?: string;
  isMintCloseTime?: boolean;
  setIsMintCloseTime?: React.Dispatch<React.SetStateAction<boolean>> | any;
  endDate?: Dayjs;
  setEndDate?: React.Dispatch<React.SetStateAction<Dayjs>> | any;
  endTime?: Dayjs;
  setEndTime?: React.Dispatch<React.SetStateAction<Dayjs>> | any;
  setIsTicket?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setSelectedType?: React.Dispatch<React.SetStateAction<string>> | any;
  selectedType?: string;
  ticketImage?: SelectedFile;
  setTicketImage?: React.Dispatch<React.SetStateAction<SelectedFile>> | any;
  ticketImageURL?: string;
  setTicketImageURL?: React.Dispatch<React.SetStateAction<string>> | any;
  handleClose?: () => void;
  handleNext?: () => void;
  handleBack?: () => void;
}

export const InitialSetup = ({ setIsNext }: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
      padding="20px 30px"
      spacing="30px"
    >
      <Stack spacing="20px">
        <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
          Ticket Setup
        </Typography>
        <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
          Ticketing Method cannnot be changed for this event once created.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing="10px"
        alignItems={'center'}
        padding={'20px'}
        sx={{
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.10)',
          background:
            'linear-gradient(90deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.00) 100%), rgba(255, 255, 255, 0.05))',
        }}
      >
        <Stack justifyContent="space-between" height="140px">
          <Typography variant="subtitleSB" sx={{ opacity: '0.7' }}>
            Create Tickets Individually
          </Typography>

          <Typography variant="bodyM" sx={{ opacity: '0.6' }}>
            <strong>One ticket equals one contract.</strong>A parent contract is
            deployed and subsequent tickets created are individual child
            contracts. This allows for more control of each ticket type created.
          </Typography>
          <Stack
            padding="4px 10px"
            borderRadius="6px"
            direction="row"
            spacing="10px"
            bgcolor="#3e3e3e"
            alignItems="center"
          >
            <Typography variant="caption">TICKETING PROTOCOL:</Typography>
            <ScrollIcon />
          </Stack>
        </Stack>

        <Image
          alt={'25.webp'}
          src={'/25.webp'}
          width={160}
          height={140}
          objectFit="cover"
          style={{
            paddingTop: isMobile ? '30px' : undefined,
            width: isMobile ? '100%' : undefined,
            height: isMobile ? '100%' : undefined,
          }}
        />
      </Stack>

      <Typography textAlign={'center'} variant="bodyB" sx={{ opacity: '0.8' }}>
        You are <strong>Creating Tickets Individually</strong>
      </Typography>

      <Box>
        <Button
          onClick={() => setIsNext(true)}
          // onClick={() => alert("OKKAAAYYYY")}
          sx={{
            backgroundColor: '#2f474e',
            color: '#67DAFF',
            width: '100%',
            borderRadius: '10px',
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter',
            textTransform: 'capitalize',
          }}
          startIcon={<RightArrowIcon color="#67DAFF" />}
        >
          Next
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const TicketSetup = ({
  selectedToken,
  setSelectedToken,
  handleClose,
  handleNext,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Stack spacing="30px" padding="20px 30px">
        <Stack spacing="20px">
          <Typography
            fontSize={20}
            lineHeight={1.2}
            fontWeight={700}
            sx={{ opacity: '0.7' }}
          >
            Ticket Setup
          </Typography>
          <Typography fontSize={16} lineHeight={1.6} sx={{ opacity: '0.6' }}>
            Set the receiving token and address for ticket purchases via crypto
            payments. These settings cannot be changed once the contract is
            deployed.
          </Typography>
        </Stack>

        <Stack
          padding={'20px'}
          bgcolor="rgba(255, 255, 255, 0.02)"
          borderRadius="10px"
          spacing="30px"
        >
          <Typography
            fontSize={20}
            lineHeight={1.2}
            fontWeight={700}
            sx={{ opacity: '0.7' }}
          >
            Select Token
          </Typography>

          <Stack spacing="20px">
            <Stack spacing="10px">
              <Typography fontSize={16} lineHeight={1.2} fontWeight={700}>
                Receiving Token
              </Typography>
              <Typography
                fontSize={13}
                lineHeight={1.4}
                sx={{ opacity: '0.6' }}
              >
                Select a token to be received as payment for ticket purchases
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing="10px">
            <Typography fontSize={10} lineHeight={1.2} sx={{ opacity: '0.6' }}>
              TOKEN (ONLY ONE CAN BE SELECTED)
            </Typography>
            <Stack direction={'row'} alignItems="center" spacing={'10px'}>
              {[
                { token: 'USDT', icon: <USDTIcon /> },
                { token: 'USDC', icon: <USDCIcon /> },
              ].map(({ token, icon }) => (
                <Stack
                  key={token}
                  width={'100%'}
                  direction="row"
                  alignItems="center"
                  justifyContent={'space-between'}
                  padding="10px 20px"
                  spacing={1}
                  borderRadius={3}
                  sx={{
                    cursor: 'pointer',
                    border: `${selectedToken === token ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                    backgroundColor: `${selectedToken === token ? 'rgba(125, 255, 209, 0.10)' : 'rgba(255, 255, 255, 0.05)'}`,
                  }}
                  onClick={() => setSelectedToken(token)}
                >
                  <Stack direction="row" alignItems="center" gap="10px">
                    {icon}
                    <Typography
                      fontSize="14px"
                      fontWeight={600}
                      lineHeight={1.6}
                    >
                      {token}
                    </Typography>
                  </Stack>
                  <Stack>
                    {selectedToken === token ? (
                      <CheckCircleIcon color="#65C0A0" size={4} />
                    ) : (
                      <UncheckCircleIcon size={4} />
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
        <ButtonGroup
          isBackButton={false}
          isConfirmButton={false}
          handleNext={handleNext!}
          handleBack={handleClose!}
        />
        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </Stack>
  );
};

export const TicketType = ({
  selectedType,
  setSelectedType,
  handleNext,
  handleBack,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');

  return (
    <Stack
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Stack spacing="30px" padding="20px 30px">
        <Stack spacing="20px">
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Ticket Setup
          </Typography>
          <Typography variant="bodyB" sx={{ opacity: '0.6' }}>
            Set the receiving token and address for ticket purchases via crypto
            payments. These settings cannot be changed once the contract is
            deployed.
          </Typography>
        </Stack>
        <Stack
          padding="20px"
          spacing="30px"
          bgcolor="#2d2d2d"
          borderRadius="10px"
        >
          <Typography variant="subtitleMB">Select Type</Typography>
          <Stack spacing="10px">
            <Stack
              onClick={() => setSelectedType('Attendee')}
              direction="row"
              justifyContent="space-between"
              padding="10px 20px"
              alignItems="center"
              bgcolor={
                selectedType === 'Attendee'
                  ? 'rgba(125, 255, 209, 0.10)'
                  : 'rgba(255, 255, 255, 0.05)'
              }
              borderRadius="10px"
            >
              <Stack spacing="10px">
                <Typography variant="bodyMB">Attendee Ticket</Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                  These are tickets for those who will attend this event
                </Typography>
              </Stack>
              {selectedType === 'Attendee' ? (
                <CheckCircleIcon />
              ) : (
                <UncheckCircleIcon />
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              padding="10px 20px"
              alignItems="center"
              bgcolor="rgba(255, 255, 255, 0.05)"
              borderRadius="10px"
              sx={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <Stack spacing="10px">
                <Typography variant="bodyMB">
                  Sponsor Package (Coming Soon)
                </Typography>
                <Typography variant="bodyS" sx={{ opacity: 0.8 }}>
                  These are packages for those who will sponsor this event
                </Typography>
              </Stack>
              <UncheckCircleIcon />
            </Stack>
          </Stack>
        </Stack>
        <ButtonGroup
          isBackButton
          isConfirmButton={false}
          handleNext={handleNext!}
          handleBack={handleBack!}
        />
        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </Stack>
  );
};

export const CreateTicket = ({
  handleChange,
  isTicketFree,
  setIsTicketFree,
  isWhiteList,
  setIsWhiteList,
  selectedToken,
  isMintCloseTime,
  setIsMintCloseTime,
  setEndDate,
  setEndTime,
  ticketImageURL,
  setTicketImageURL,
  handleBack,
  handleNext,
}: IProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack padding="20px 30px" spacing="30px">
        <Stack
          gap="30px"
          padding="20px"
          bgcolor="rgba(255, 255, 255, 0.02)"
          borderRadius="10px"
        >
          <Typography variant="subtitleSB" sx={{ opacity: '0.7' }}>
            Ticket Basics
          </Typography>
          <Stack spacing="10px">
            <Typography variant="bodyBB">Name*</Typography>
            <ZuInput
              required
              name="ticketName"
              onChange={handleChange}
              placeholder="Enter a name for your event"
            />
          </Stack>
          {!isTicketFree && (
            <Stack spacing="10px">
              <Typography variant="bodyBB">Price*</Typography>
              <Box position="relative">
                <ZuInput
                  required
                  name="ticketPrice"
                  onChange={handleChange}
                  placeholder="0.0"
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '28px',
                    padding: '14px',
                    color: 'white',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    position: 'absolute',
                    right: '12px',
                    top: '7px',
                  }}
                >
                  {selectedToken === 'USDT' ? <USDTIcon /> : <USDCIcon />}
                  <Typography marginLeft={'10px'}>
                    {selectedToken === 'USDT' ? 'USDT' : 'USDC'}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          )}

          <Box display="flex">
            <ZuSwitch
              checked={isTicketFree}
              onChange={() => setIsTicketFree((prev: boolean) => !prev)}
            />
            <Box>
              <Typography
                color="white"
                fontSize="16px"
                fontWeight={700}
                fontFamily="Inter"
                marginLeft="10px"
              >
                Free
              </Typography>
              <Typography
                color="white"
                fontSize="13px"
                lineHeight={'140%'}
                letterSpacing={'0.13px'}
                fontFamily="Inter"
                marginLeft="10px"
                sx={{ opacity: '0.7' }}
              >
                Make this ticket free to mint
              </Typography>
            </Box>
          </Box>

          <Stack spacing="10px">
            <Typography variant="bodyBB">Description*</Typography>
            <TextField
              required
              name="description"
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-inputMultiline': {
                  fontFamily: 'Inter',
                  color: 'white',
                },
              }}
              placeholder="Provide a captivating description of your event"
            />
          </Stack>

          <Stack spacing="10px">
            <Typography variant="bodyBB">Add an Agreement Message</Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.8 }}>
              Write an agreement for users to understand and agree before they
              proceed to purchase this ticket. This message will be displayed in
              the minting process.
            </Typography>
            <TextField
              required
              name="message"
              onChange={handleChange}
              multiline
              rows={4}
              sx={{
                backgroundColor: '#2d2d2d',
                borderRadius: '8px',
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-inputMultiline': {
                  fontFamily: 'Inter',
                  color: 'white',
                },
              }}
              placeholder="Write an agreement here"
            />
          </Stack>
          <Stack spacing="10px">
            <Typography variant="bodyBB">Image</Typography>
            <Typography variant="bodyS" sx={{ opacity: '0.6' }}>
              Recommend min of 200 * 200px (1:1 Ratio)
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FormUploader
                value={ticketImageURL}
                onChange={setTicketImageURL}
              />
            </Box>
          </Stack>
        </Stack>

        <Stack
          padding="20px"
          spacing="30px"
          sx={{
            background: '#2d2d2d',
            borderRadius: '10px',
          }}
        >
          <Typography variant="bodyBB" sx={{ opacity: '0.7' }}>
            Minting Access
          </Typography>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isWhiteList}
              onChange={() => setIsWhiteList((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Add Whitelist For This Ticket
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                This ticket will require whitelisted addresses to mint
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isMintCloseTime}
              onChange={() => setIsMintCloseTime((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Set Minting Closing Period
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Set the end date and time for when minting for this ticket ends.
                By default, minting will be open until the event ends.
              </Typography>
            </Stack>
          </Stack>
          {isMintCloseTime && (
            <Stack direction="row" spacing="20px">
              <Stack spacing="10px">
                <Typography variant="bodyBB">End Date*</Typography>
                <DatePicker
                  onChange={(newValue) => setEndDate(newValue)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  slotProps={{
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
                        },
                      },
                    },
                  }}
                />
              </Stack>
              <Stack spacing="10px">
                <Typography variant="bodyBB">End Time*</Typography>
                <TimePicker
                  onChange={(newValue) => setEndTime(newValue)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        ...{
                          '& .MuiPickersLayout-contentWrapper': {
                            color: 'black',
                          },
                        },
                      },
                    },
                  }}
                />
              </Stack>
            </Stack>
          )}
        </Stack>

        {/* CONFIGURE SETTINGS */}
        <Stack
          spacing="30px"
          padding="20px"
          sx={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
          }}
        >
          <Typography variant="subtitleMB" sx={{ opacity: '0.7' }}>
            Configure Display Settings
          </Typography>

          <Stack spacing="10px">
            <Typography variant="bodyBB">Starting Status*</Typography>
            <Typography variant="bodyS" sx={{ opacity: '0.8' }}>
              Select a status for this ticket post-creation
            </Typography>
            <Select
              name="startingStatus"
              onChange={handleChange}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                backgroundColor: '#2d2d2d',
              }}
              placeholder="Select"
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: '#222222',
                  },
                },
              }}
            >
              {STARTING_STATUS.map((status, index) => {
                return (
                  <MenuItem value={status.key} key={index}>
                    {status.value}
                  </MenuItem>
                );
              })}
            </Select>
          </Stack>
        </Stack>

        {/* CONFIGURE CONDITIONS
        <Stack
          padding="20px"
          spacing="30px"
          sx={{
            background:
              'linear-gradient(0deg, rgba(255, 112, 112, 0.20) 0%, rgba(255, 112, 112, 0.20) 100%), rgba(255, 255, 255, 0.02)',
            borderRadius: '10px',
          }}
        >
          <Stack spacing="10px">
            <Typography variant="bodyBB" sx={{ opacity: '0.7' }}>
              Configure Conditions
            </Typography>
            <Typography variant="bodyM" sx={{ opacity: 0.6 }}>
              These conditions do not affect the contract
            </Typography>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isHideUntilSetDate}
              onChange={() => setIsHideUntilSetDate((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">
                Hide Until Set Date and Time
              </Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Make this ticket visible and available to purchase until a set
                date/time
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing="10px">
            <ZuSwitch
              checked={isHideAfterSetDate}
              onChange={() => setIsHideAfterSetDate((prev: boolean) => !prev)}
            />
            <Stack spacing="10px">
              <Typography variant="bodyBB">Hide After Set Date/Time</Typography>
              <Typography variant="bodyS" sx={{ opacity: '0.7' }}>
                Make this ticket hidden after a set date/time
              </Typography>
            </Stack>
          </Stack>
        </Stack>*/}
        <ButtonGroup
          handleBack={handleBack!}
          handleNext={() => {
            handleNext?.();
          }}
        />

        <Box
          display="flex"
          justifyContent={'center'}
          gap="10px"
          alignItems="center"
        >
          <Typography variant="caption">TICKETING PROTOCOL:</Typography>
          <ScrollIcon />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export const TicketCreationSummary = ({
  isTicketFree,
  selectedToken,
  ticketInfo,
  handleSubmit,
  ticketImageURL,
  handleBack,
  isSubmitLoading,
}: IProps) => {
  const isMobile = useMediaQuery('(max-width:500px)');
  return (
    <Stack
      spacing="30px"
      padding="20px"
      sx={{
        background: '#222',
        height: isMobile ? '100%' : 'calc(100vh - 6.2rem)',
      }}
    >
      <Box
        padding={'30px'}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
          Summary
        </Typography>

        <Box margin={'30px 0px 20px'}>
          <Box
            sx={{
              display: isMobile ? 'grid' : 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
            }}
          >
            <Typography variant="bodyB" sx={{ opacity: '0.8' }}>
              Method:
            </Typography>
            <Typography variant="bodyBB" sx={{ opacity: '0.8' }}>
              Combine Tickets in Contract Deployed on Scroll
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px 14px',
            }}
            borderTop={'1px solid rgba(255, 255, 255, 0.10)'}
          >
            <Typography variant="bodyB" sx={{ opacity: '0.8' }}>
              Receiving Token:
            </Typography>
            <Box
              padding={'4px 10px'}
              borderRadius="10px"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {selectedToken === 'USDT' ? <USDTIcon /> : <USDCIcon />}
              <Typography variant="bodyM" marginLeft="8px">
                {selectedToken === 'USDT' ? 'USDT' : 'USDC'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Stack marginTop={'16px'} direction={{ xs: 'column', sm: 'row' }}>
          <Image
            alt={ticketImageURL || '/23.webp'}
            src={ticketImageURL || '/23.webp'}
            width={200}
            height={200}
          />
          <Stack
            direction="column"
            spacing={1}
            marginLeft={isMobile ? undefined : '16px'}
            marginTop={isMobile ? '30px' : undefined}
          >
            <Typography variant="h5">{ticketInfo?.ticketName}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="bodyM">Price:</Typography>
              <Typography
                variant="bodyBB"
                marginLeft={'10px'}
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? 'Free' : ticketInfo?.ticketPrice}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  opacity: '0.8',
                }}
              >
                {isTicketFree ? null : selectedToken}
              </Typography>
            </Box>

            <Typography variant="bodyM">Description:</Typography>
            <Typography
              variant="bodyS"
              sx={{
                opacity: '0.8',
              }}
            >
              {ticketInfo.description}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <ButtonGroup
        handleBack={handleBack!}
        handleNext={handleSubmit}
        isConfirmButton
        isLoading={isSubmitLoading}
      />
      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const ProcessingTicket = ({
  setPurchasingTicket,
  toggleDrawer,
  isSubmitLoading,
  txnHash,
}: IProps) => {
  let status = false;

  return (
    <Stack
      sx={{ background: '#222', height: 'calc(100vh - 6.2rem)' }}
      spacing="30px"
      padding="20px 30px"
    >
      <Box
        padding={'30px'}
        margin={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '10px',
        }}
      >
        <Typography fontSize="20px" fontWeight="bold" sx={{ opacity: '0.7' }}>
          {isSubmitLoading ? 'Processing' : 'Complete'}
        </Typography>

        <Box
          padding="10px"
          display={'flex'}
          justifyContent={'center'}
          marginY={'20px'}
          sx={{
            borderRadius: '10px',
            background: `${status ? 'rgba(255, 255, 255, 0.05)' : 'rgba(125, 255, 209, 0.10)'}`,
          }}
        >
          {isSubmitLoading ? (
            <Typography color="white" fontSize={'14px'} lineHeight={'160%'}>
              Your ticket is being created...
            </Typography>
          ) : (
            <Box display={'flex'} alignItems={'center'}>
              <CheckIcon />
              <Typography color="#7DFFD1" fontSize={'14px'} lineHeight={'160%'}>
                Ticket creation successful
              </Typography>
            </Box>
          )}
        </Box>

        <TicketProcessingProgress txnHash={txnHash} />
      </Box>

      {!isSubmitLoading && (
        <Box paddingX={'30px'}>
          <Button
            onClick={() => {
              setPurchasingTicket(false), toggleDrawer('right', false);
            }}
            sx={{
              backgroundColor: 'rgba(103, 219, 255, 0.10)',
              color: '#67DBFF',
              border: '1px solid rgba(103, 219, 255, 0.20)',
              width: '100%',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter',
              textTransform: 'capitalize',
            }}
            startIcon={<CircleCloseIcon />}
          >
            Close
          </Button>
        </Box>
      )}

      <Box
        display="flex"
        justifyContent={'center'}
        gap="10px"
        alignItems="center"
      >
        <Typography variant="caption">TICKETING PROTOCOL:</Typography>
        <ScrollIcon />
      </Box>
    </Stack>
  );
};

export const TicketProcessingProgress = ({ txnHash }: any) => {
  const steps = [
    {
      label: 'Event Contract Deployed',
      description: '0x9999...f08E',
      // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
    },
    {
      label: 'Ticket Contract Deployed',
      description: '0x9999...f08E',
      // description: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
    },
    {
      label: 'Validating Transaction (Hash)',
      description: shortenAddress(txnHash),
    },
    {
      label: 'Last Step',
      description: 'desc',
    },
  ];
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                '.mui-10z7562-MuiSvgIcon-root-MuiStepIcon-root.Mui-active': {
                  color: '#7DFFD1',
                },
              }}
            >
              <Typography
                fontSize={'14px'}
                fontWeight={'600'}
                lineHeight={'160%'}
                color="white"
              >
                {step.label}
              </Typography>
              <Box display={'flex'} alignItems={'center'}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={'400'}
                  lineHeight={'160%'}
                  color="white"
                  sx={{ opacity: '0.8' }}
                >
                  {step.description}
                </Typography>
                {index === 2 ? null : (
                  <Box display={'flex'} alignItems={'center'}>
                    <CopyIcon cursor="pointer" />

                    <Box
                      onClick={() =>
                        window.open(
                          `${SCROLL_EXPLORER}/tx/${txnHash}`,
                          '_blank',
                        )
                      }
                    >
                      <GoToExplorerIcon cursor="pointer" />
                    </Box>
                  </Box>
                )}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};
