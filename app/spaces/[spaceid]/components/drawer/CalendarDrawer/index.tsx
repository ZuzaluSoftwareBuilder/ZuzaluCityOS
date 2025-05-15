'use client';

import {
  CommonDrawerHeader,
  Drawer,
  DrawerBody,
  DrawerContent,
} from '@/components/base/drawer';
import { useCeramicContext } from '@/context/CeramicContext';
import { Space } from '@/models/space';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import CalendarForm, { CalendarFormData } from './form';

interface CalendarDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  space: Space;
  onClose: () => void;
  refetch: () => void;
  initialData?: Partial<CalendarFormData>;
}

const CalendarDrawer = ({
  isOpen,
  onOpenChange,
  space,
  onClose,
  refetch,
  initialData,
}: CalendarDrawerProps) => {
  const { composeClient } = useCeramicContext();

  // Calendar configuration mutation
  const configCalendarMutation = useMutation({
    mutationFn: async (data: CalendarFormData) => {
      const result = await composeClient.executeQuery(
        `
        mutation updateZucitySpaceMutation($input: UpdateZucitySpaceInput!) {
          updateZucitySpace(
            input: $input
          ) {
            document {
              id
            }
          }
        }
        `,
        {
          input: {
            id: space.id,
            content: {
              customAttributes: [
                {
                  tbd: JSON.stringify({
                    key: 'calendarConfig',
                    value: {
                      name: data.name,
                      category: data.categories
                        .map((item) => item?.trim())
                        .join(','),
                      accessRule: data.accessRule,
                      accessType: data.accessType,
                      roles: data.roles,
                      poaps: data.poaps,
                    },
                  }),
                },
              ],
            },
          },
        },
      );
      return result;
    },
    onSuccess: () => {
      onClose();
      refetch();
    },
  });

  // Handle form submission
  const handleFormSubmit = useCallback(
    (data: CalendarFormData) => {
      configCalendarMutation.mutate(data);
    },
    [configCalendarMutation],
  );

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
          isDisabled={configCalendarMutation.isPending}
        />
        <DrawerBody className="flex flex-col gap-[20px] p-[20px]">
          <CalendarForm
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            initialData={initialData}
            isSubmitting={configCalendarMutation.isPending}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDrawer;
