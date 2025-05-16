'use client';

import { useSpaceData } from '@/app/spaces/[spaceid]/components/context/spaceData';
import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base/drawer';
import { useRepositories } from '@/context/RepositoryContext';
import {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
} from '@/models/calendar';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import CalendarForm, { AccessType, CalendarFormData } from './form';

interface CalendarDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  refetch: () => void;
  id?: string; // Calendar ID for editing
  isEdit?: boolean; // Whether in edit mode
}

const CalendarDrawer = ({
  isOpen,
  onOpenChange,
  onClose,
  refetch,
  id,
  isEdit = false,
}: CalendarDrawerProps) => {
  const { calendarRepository } = useRepositories();
  const { spaceData } = useSpaceData();

  // Fetch calendar data if in edit mode and id is provided
  const { data: calendarData, isLoading } = useQuery<Calendar>({
    queryKey: ['calendar', id],
    queryFn: async () => {
      const result = await calendarRepository.getById(id!);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    enabled: isEdit && !!id,
  });

  // Calendar create mutation
  const createCalendarMutation = useMutation({
    mutationFn: async (data: CreateCalendarInput) => {
      const result = await calendarRepository.create(data);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
  });

  // Calendar update mutation
  const updateCalendarMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCalendarInput;
    }) => {
      const result = await calendarRepository.update(id, data);
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
  });

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (data: CalendarFormData) => {
      try {
        // Prepare data for calendar repository
        let roleIds: string[] | null = null;
        if (
          data.gated &&
          data.accessType === AccessType.ByRole &&
          data.roles &&
          data.roles.length > 0
        ) {
          roleIds = data.roles.filter((roleId) => roleId !== 'member');
        }

        const calendarPayload: CreateCalendarInput = {
          name: data.name,
          category: data.categories.map((item) => item?.trim()),
          gated: data.gated,
          spaceId: spaceData?.id || '',
          roleIds: roleIds,
        };

        // Use calendar repository to create or update calendar
        if (isEdit && id && calendarData) {
          // Update existing calendar
          await updateCalendarMutation.mutateAsync({
            id: id,
            data: calendarPayload,
          });
        } else {
          // Create new calendar
          console.log('calendarData', calendarPayload);
          await createCalendarMutation.mutateAsync(calendarPayload);
        }

        // Close drawer and refresh data
        onClose();
        refetch();
      } catch (error) {
        console.error('Failed to save calendar:', error);
      }
    },
    [
      calendarData,
      id,
      isEdit,
      spaceData?.id,
      updateCalendarMutation,
      createCalendarMutation,
      onClose,
      refetch,
    ],
  );

  // Determine if any mutation is in progress
  const isSubmitting =
    createCalendarMutation.isPending || updateCalendarMutation.isPending;

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: 'w-[700px] max-w-[700px]',
      }}
    >
      <DrawerContent className="bg-[#222222]">
        <CommonDrawerHeader
          title="Calendar Settings"
          onClose={onClose}
          isDisabled={isSubmitting}
        />
        <DrawerBody className="flex flex-col gap-[20px] p-[20px]">
          <CalendarForm
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            initialData={
              // Map Supabase calendar data to form data if available in edit mode
              calendarData
                ? {
                    // Required fields
                    name: calendarData.name,
                    categories: calendarData.category,

                    // Form control fields
                    gated: calendarData.gated,
                    accessType: calendarData.roleIds
                      ? AccessType.ByRole
                      : undefined,

                    // Optional fields
                    id: calendarData.id,
                    spaceId: calendarData.spaceId,
                    createdAt: calendarData.createdAt,
                  }
                : undefined
            }
            isSubmitting={isSubmitting || (isEdit && isLoading)}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDrawer;
