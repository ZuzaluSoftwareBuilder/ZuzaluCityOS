'use client';
import Dialog from '@/app/spaces/components/Modal/Dialog';
import {
  decodeOutputData,
  encodeOutputData,
} from '@/components/editor/useEditorStore';
import { FormatCheckbox } from '@/components/form/FormatCheckbox';
import FormFooter from '@/components/form/FormFooter';
import FormHeader from '@/components/form/FormHeader';
import FormUploader from '@/components/form/FormUploader';
import { TimezoneSelector } from '@/components/select/TimezoneSelector';
import {
  FormLabel,
  FormLabelDesc,
  FormTitle,
} from '@/components/typography/formTypography';
import Yup from '@/utils/yupExtensions';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { DesktopDatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ZuInput, ZuSwitch } from 'components/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  allTimezones,
  ITimezoneOption,
  useTimezoneSelect,
} from 'react-timezone-select';

import dynamic from 'next/dynamic';
const SuperEditor = dynamic(() => import('@/components/editor/SuperEditor'), {
  ssr: false,
});

import SelectCheckItem from '@/components/select/selectCheckItem';
import { useAbstractAuthContext } from '@/context/AbstractAuthContext';
import { CalEvent } from '@/types';
import { supabase } from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { RRule } from 'rrule';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const schema = Yup.object().shape({
  name: Yup.string().required('Event name is required'),
  categories: Yup.array()
    .of(Yup.string())
    .required('Categories are required')
    .min(1, 'At least one category is required'),
  description: Yup.mixed(),
  isAllDay: Yup.boolean(),
  startDate: Yup.mixed()
    .dayjs()
    .when('recurring', {
      is: 'none',
      then: (schema) => schema.required('Start date is required'),
      otherwise: (schema) => schema,
    }),
  endDate: Yup.mixed()
    .dayjs()
    .when('recurring', {
      is: 'none',
      then: (schema) => schema.required('End date is required'),
      otherwise: (schema) => schema,
    })
    .test(
      'is-after-start',
      'End date must be after start date',
      function (endDate) {
        const startDate = this.parent.startDate;
        if (!startDate || !endDate) return true;

        const startDayjs = dayjs(startDate);
        const endDayjs = dayjs(endDate);

        return endDayjs.isSameOrAfter(startDayjs, 'day');
      },
    ),
  startTime: Yup.mixed()
    .dayjs()
    .when('isAllDay', {
      is: false,
      then: (schema) => schema.required('Start time is required'),
    }),
  endTime: Yup.mixed()
    .dayjs()
    .when(['isAllDay', 'startTime', 'startDate', 'endDate'], {
      is: (isAllDay: boolean, startTime: any, startDate: any, endDate: any) => {
        return !isAllDay && startTime && startDate && endDate;
      },
      then: (schema) =>
        schema
          .required('End time is required')
          .test(
            'is-after-start-time',
            'End time must be after start time',
            function (endTime) {
              const { startTime, startDate, endDate } = this.parent;
              if (!startTime || !endTime) return true;

              const start = dayjs(startDate)
                .hour(dayjs(startTime).hour())
                .minute(dayjs(startTime).minute());
              const end = dayjs(endDate)
                .hour(dayjs(endTime).hour())
                .minute(dayjs(endTime).minute());

              return end.isAfter(start);
            },
          ),
    }),
  timezone: Yup.object().shape({
    value: Yup.string(),
  }),
  recurring: Yup.string(),
  imageUrl: Yup.string(),
  format: Yup.string(),
  locationName: Yup.string()
    .when('format', {
      is: (format: string) => format === 'in-person' || format === 'hybrid',
      then: (schema) => schema.required('Location name is required'),
    })
    .nullable(),
  locationUrl: Yup.string()
    .url('Please enter a valid URL')
    .when('format', {
      is: (format: string) => format === 'online' || format === 'hybrid',
      then: (schema) => schema.required('Location URL is required'),
    })
    .nullable(),
  weekdays: Yup.array()
    .of(Yup.string())
    .when('recurring', {
      is: 'weekly',
      then: (schema) =>
        schema
          .required('Please select at least one weekday')
          .min(1, 'Please select at least one weekday'),
      otherwise: (schema) => schema,
    }),
  monthdays: Yup.array()
    .of(Yup.number().required())
    .when('recurring', {
      is: 'monthly',
      then: (schema) =>
        schema
          .required('Please select at least one day')
          .min(1, 'Please select at least one day'),
      otherwise: (schema) => schema,
    }),
});

type FormData = Yup.InferType<typeof schema>;

interface EventFormProps {
  spaceId: string;
  editType: string;
  event?: CalEvent;
  categories: string[];
  handleClose: () => void;
  refetch: () => void;
}

const CreateEventForm: React.FC<EventFormProps> = ({
  spaceId,
  event,
  categories,
  handleClose,
  refetch,
}) => {
  const { options } = useTimezoneSelect({ timezones: allTimezones });

  const { control, handleSubmit, setValue, watch, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      format: 'in-person',
      categories: [],
      startDate: dayjs(),
      endDate: dayjs(),
      startTime: dayjs(),
      endTime: dayjs().add(1, 'hour'),
      isAllDay: false,
      recurring: 'none',
      weekdays: [],
      monthdays: [],
    },
    shouldFocusError: true,
  });

  const isAllDay = watch('isAllDay');
  const recurring = watch('recurring');
  const format = watch('format');
  const description = watch('description');
  const currentCategories = watch('categories');
  const currentWeekdays = watch('weekdays');

  const [blockClickModal, setBlockClickModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // TODO wait supabase update, confirm profile of event
  const { profile } = useAbstractAuthContext();

  const eventMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const {
        name,
        description,
        categories,
        imageUrl,
        format,
        isAllDay,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        locationName,
        locationUrl,
        weekdays,
        monthdays,
        recurring,
      } = data;

      const selectedTimezone = timezone.value || dayjs.tz.guess();

      const startDateTime = isAllDay
        ? dayjs(startDate).tz(selectedTimezone).startOf('day')
        : dayjs(startDate)
            .tz(selectedTimezone)
            .hour(startTime!.hour())
            .minute(startTime!.minute());

      const endDateTime = isAllDay
        ? dayjs(endDate).tz(selectedTimezone).endOf('day')
        : dayjs(endDate)
            .tz(selectedTimezone)
            .hour(endTime!.hour())
            .minute(endTime!.minute());

      let rruleString = '';
      if (recurring === 'weekly' && weekdays?.length) {
        const byweekday = weekdays.map((day) => {
          const dayIndex = WEEKDAYS.findIndex((d) => d.value === day);
          return dayIndex;
        });

        const rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: byweekday,
          dtstart: dayjs().utc().startOf('day').toDate(),
        });

        rruleString = rule.toString();
      } else if (recurring === 'monthly' && monthdays?.length) {
        const rule = new RRule({
          freq: RRule.MONTHLY,
          bymonthday: monthdays,
          dtstart: dayjs().utc().startOf('day').toDate(),
        });

        rruleString = rule.toString();
      }

      const eventData = {
        name,
        description: encodeOutputData(description),
        category: categories.join(','),
        image_url: imageUrl,
        is_all_day: isAllDay,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        timezone: selectedTimezone,
        format,
        location_name: locationName,
        location_url: locationUrl,
        space_id: spaceId,
        creator: JSON.stringify(profile),
        recurring: rruleString || null,
      };

      if (event) {
        return supabase.from('sideEvents').update(eventData).eq('id', event.id);
      } else {
        return supabase.from('sideEvents').insert(eventData);
      }
    },
    onSuccess: () => {
      refetch();
      reset();
      handleClose();
    },
  });

  const handleDescriptionChange = useCallback(
    (val: any) => {
      setValue('description', val);
    },
    [setValue],
  );

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      eventMutation.mutate(data);
    },
    [eventMutation],
  );

  const handleDialogClose = useCallback(() => {
    reset();
    setShowModal(false);
    setBlockClickModal(false);
    handleClose();
  }, [handleClose, reset]);

  useEffect(() => {
    if (event) {
      setValue('name', event.name);
      setValue('categories', event.category.split(','));
      event.description && setValue('description', event.description);
      event.image_url && setValue('imageUrl', event.image_url);
      setValue('isAllDay', event.is_all_day);
      setValue('startDate', dayjs(event.start_date).tz(event.timezone));
      setValue('endDate', dayjs(event.end_date).tz(event.timezone));
      setValue('startTime', dayjs(event.start_date).tz(event.timezone));
      setValue('endTime', dayjs(event.end_date).tz(event.timezone));
      setValue(
        'timezone',
        options.find(
          (item) => item.value === event.timezone,
        ) as ITimezoneOption,
      );
      setValue('format', event.format);
      setValue('locationName', event.location_name);
      setValue('locationUrl', event.location_url);
      event.weekdays && setValue('weekdays', event.weekdays.split(','));
      event.monthdays &&
        setValue('monthdays', event.monthdays.split(',').map(Number));
      if (event.recurring) {
        const rule = RRule.fromString(event.recurring);
        if (rule.options.freq === RRule.WEEKLY) {
          const weekdayValues = rule.options.byweekday?.map(
            (dayIndex) => WEEKDAYS[dayIndex as number].value,
          );
          setValue('recurring', 'weekly');
          setValue('weekdays', weekdayValues);
        } else if (rule.options.freq === RRule.MONTHLY) {
          setValue('recurring', 'monthly');
          setValue('monthdays', rule.options.bymonthday);
        }
      }
    }
  }, []);

  const WEEKDAYS = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        title={event ? 'Event Updated' : 'Event Created'}
        message="Please view it."
        showModal={showModal}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
      />
      <Dialog
        showModal={blockClickModal}
        showActions={false}
        title={event ? 'Updating Event' : 'Creating Event'}
        message="Please wait while the event is being updated..."
      />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1200 }}>
          <FormHeader
            isBack={!!event}
            title={event ? 'Edit Event' : 'Create Event'}
            handleClose={handleDialogClose}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          <Stack gap="20px" p="20px" pb="80px">
            <Box display="flex" flexDirection="column" gap="20px">
              <Box bgcolor="#262626" borderRadius="10px">
                <Stack padding="20px 20px 0" gap="10px">
                  <FormTitle>Event Details</FormTitle>
                  <Typography
                    fontSize={14}
                    lineHeight={1.6}
                    sx={{ opacity: 0.6 }}
                  >
                    Set event title and description
                  </Typography>
                </Stack>
                <Box
                  padding="0 20px 20px"
                  mt="30px"
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                >
                  <Stack spacing="10px">
                    <FormLabel>Event Name*</FormLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <ZuInput
                            {...field}
                            placeholder="a name for this calendar event"
                            error={!!error}
                          />
                          {error && (
                            <FormHelperText error>
                              {error.message}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Stack>
                  <Stack spacing="10px">
                    <FormLabel>Calendar Categories*</FormLabel>
                    <FormLabelDesc>
                      Choose a type for your event to relay its nature to
                      guests.
                    </FormLabelDesc>
                    <Controller
                      name="categories"
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <Select
                            size="small"
                            multiple
                            renderValue={(selected) => selected.join(', ')}
                            {...field}
                            error={!!error}
                          >
                            {categories.map((item) => (
                              <MenuItem key={item} value={item}>
                                <SelectCheckItem
                                  label={item}
                                  isChecked={
                                    currentCategories.findIndex(
                                      (v) => v === item,
                                    ) > -1
                                  }
                                />
                              </MenuItem>
                            ))}
                          </Select>
                          {error && (
                            <FormHelperText error>
                              {error.message}
                            </FormHelperText>
                          )}
                        </>
                      )}
                    />
                  </Stack>
                  <Stack spacing="10px">
                    <FormLabel>Event Description</FormLabel>
                    <FormLabelDesc>
                      This is a description greeting for new members. You can
                      also update descriptions.
                    </FormLabelDesc>
                    <SuperEditor
                      value={decodeOutputData(description ?? '')}
                      onChange={handleDescriptionChange}
                    />
                  </Stack>
                  <Stack spacing="10px">
                    <FormLabel>Event Image</FormLabel>
                    <FormLabelDesc>
                      Recommend min of 620x338px (16:9 Ratio)
                    </FormLabelDesc>
                    <Controller
                      name="imageUrl"
                      control={control}
                      render={({ field }) => (
                        <FormUploader
                          {...field}
                          previewStyle={{
                            width: 310,
                            height: 169,
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="20px">
              <Box bgcolor="#262626" borderRadius="10px">
                <Stack padding="20px 20px 0" gap="10px">
                  <FormTitle>Date & Time</FormTitle>
                  <Typography
                    fontSize={14}
                    lineHeight={1.6}
                    sx={{ opacity: 0.6 }}
                  >
                    Set event date, times and frequency
                  </Typography>
                </Stack>
                <Box
                  padding="0 20px 20px"
                  mt="30px"
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                >
                  <Stack spacing={'10px'}>
                    <FormLabel>Session Frequency</FormLabel>
                    <Controller
                      name="recurring"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} size="small">
                          <MenuItem value="none">Only Once</MenuItem>
                          <MenuItem value="weekly">Every Week</MenuItem>
                          <MenuItem value="monthly">Every Month</MenuItem>
                        </Select>
                      )}
                    />
                  </Stack>
                  {recurring === 'weekly' && (
                    <Stack spacing="10px">
                      <FormLabel>Repeat on*</FormLabel>
                      <FormLabelDesc>
                        Select which days of the week this event should repeat
                        on
                      </FormLabelDesc>
                      <Controller
                        name="weekdays"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Select
                              size="small"
                              multiple
                              renderValue={(selected) => selected.join(', ')}
                              {...field}
                              error={!!error}
                            >
                              {WEEKDAYS.map((item) => (
                                <MenuItem key={item.label} value={item.value}>
                                  <SelectCheckItem
                                    label={item.label}
                                    isChecked={
                                      (currentWeekdays ?? []).findIndex(
                                        (v) => v?.toString() === item.value,
                                      ) > -1
                                    }
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                            {error && (
                              <FormHelperText error>
                                {error.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Stack>
                  )}
                  {recurring === 'monthly' && (
                    <Stack spacing="10px">
                      <FormLabel>Repeat on*</FormLabel>
                      <FormLabelDesc>
                        Select which days of the month this event should repeat
                        on
                      </FormLabelDesc>
                      <Controller
                        name="monthdays"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <Box
                              sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: 1,
                                maxWidth: '300px',
                              }}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(
                                (day) => (
                                  <Box
                                    key={day}
                                    onClick={() => {
                                      const currentValue = field.value || [];
                                      const newValue = currentValue.includes(
                                        day,
                                      )
                                        ? currentValue.filter(
                                            (d) => d !== undefined && d !== day,
                                          )
                                        : [...currentValue, day];
                                      field.onChange(newValue);
                                    }}
                                    sx={{
                                      width: '30px',
                                      height: '30px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      borderRadius: '50%',
                                      backgroundColor: (
                                        field.value || []
                                      ).includes(day)
                                        ? 'primary.main'
                                        : 'transparent',
                                      '&:hover': {
                                        backgroundColor: (
                                          field.value || []
                                        ).includes(day)
                                          ? 'primary.dark'
                                          : 'rgba(255, 255, 255, 0.08)',
                                      },
                                      fontSize: '14px',
                                    }}
                                  >
                                    {day}
                                  </Box>
                                ),
                              )}
                            </Box>
                            {error && (
                              <FormHelperText error>
                                {error.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Stack>
                  )}
                  <Box display="flex" alignItems="center" gap="20px">
                    <Controller
                      name="isAllDay"
                      control={control}
                      render={({ field }) => {
                        return <ZuSwitch {...field} checked={field.value} />;
                      }}
                    />
                    <Typography fontSize={16} lineHeight={1.2} fontWeight={600}>
                      All Day
                    </Typography>
                  </Box>
                  {recurring === 'none' && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      gap="20px"
                    >
                      <Stack flex={1} spacing="10px">
                        <FormLabel>Start Date*</FormLabel>
                        <Controller
                          name="startDate"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <DesktopDatePicker {...field} />
                              {error && (
                                <FormHelperText error>
                                  {error.message}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </Stack>
                      <Stack flex={1} spacing="10px">
                        <FormLabel>End Date*</FormLabel>
                        <Controller
                          name="endDate"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <DesktopDatePicker {...field} />
                              {error && (
                                <FormHelperText error>
                                  {error.message}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </Stack>
                    </Box>
                  )}
                  {!isAllDay && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      gap="20px"
                    >
                      <Stack flex={1} spacing="10px">
                        <FormLabel>Start Time*</FormLabel>
                        <Controller
                          name="startTime"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <TimePicker {...field} />
                              {error && (
                                <FormHelperText error>
                                  {error.message}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </Stack>
                      <Stack flex={1} spacing="10px">
                        <FormLabel>End Time*</FormLabel>
                        <Controller
                          name="endTime"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <TimePicker {...field} />
                              {error && (
                                <FormHelperText error>
                                  {error.message}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        />
                      </Stack>
                    </Box>
                  )}
                  <Stack spacing={'10px'}>
                    <FormLabel>Timezone</FormLabel>
                    <Controller
                      name="timezone"
                      control={control}
                      render={({ field }) => (
                        <TimezoneSelector
                          value={field.value as ITimezoneOption}
                          setSelectedTimezone={(v) =>
                            setValue('timezone', v as ITimezoneOption)
                          }
                          sx={{
                            width: '100%',
                          }}
                        />
                      )}
                    />
                  </Stack>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="20px">
              <Box bgcolor="#262626" borderRadius="10px">
                <Stack padding="20px 20px 0" gap="10px">
                  <FormTitle>Format & Location</FormTitle>
                  <Typography
                    fontSize={14}
                    lineHeight={1.6}
                    sx={{ opacity: 0.6 }}
                  >
                    Set event format and location with links
                  </Typography>
                </Stack>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  padding="20px"
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    gap="20px"
                    width={'100%'}
                  >
                    {[
                      {
                        title: 'In-Person',
                        desc: 'This is a physical event',
                        value: 'in-person',
                      },
                      {
                        title: 'Online',
                        desc: 'This is a virtual event',
                        value: 'online',
                      },
                      {
                        title: 'Hybrid',
                        desc: 'Both In-Person & Online',
                        value: 'hybrid',
                      },
                    ].map((item, index) => (
                      <FormatCheckbox
                        key={`FormatCheckbox-${index}`}
                        checked={format === item.value}
                        handleChange={() => {
                          setValue('format', item.value);
                          setValue('locationName', '');
                          setValue('locationUrl', '');
                        }}
                        title={item.title}
                        desc={item.desc}
                      />
                    ))}
                  </Box>
                  {format !== 'online' && (
                    <Stack spacing="10px">
                      <FormLabel>Location Name*</FormLabel>
                      <Controller
                        name="locationName"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <ZuInput
                              {...field}
                              placeholder="a name for this calendar event"
                              error={!!error}
                            />
                            {error && (
                              <FormHelperText error>
                                {error.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Stack>
                  )}
                  {format !== 'in-person' && (
                    <Stack spacing="10px">
                      <FormLabel>Location URL*</FormLabel>
                      <Controller
                        name="locationUrl"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <>
                            <ZuInput
                              {...field}
                              placeholder="https://"
                              error={!!error}
                            />
                            {error && (
                              <FormHelperText error>
                                {error.message}
                              </FormHelperText>
                            )}
                          </>
                        )}
                      />
                    </Stack>
                  )}
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
          }}
        >
          <Box p="20px" bgcolor="#222">
            <FormFooter
              confirmText={event ? 'Update Event' : 'Create Event'}
              disabled={eventMutation.isPending}
              isLoading={eventMutation.isPending}
              handleClose={handleClose}
              handleConfirm={handleSubmit(onFormSubmit)}
            />
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateEventForm;
