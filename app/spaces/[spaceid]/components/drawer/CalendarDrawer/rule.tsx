'use client';

import POAPAutocomplete from '@/app/spaces/[spaceid]/setting/access/components/poapAutocomplete';
import { Button, Divider, Select, SelectItem } from '@/components/base';
import { getPOAPs } from '@/services/poap';
import { addToast, CircularProgress, cn, Switch } from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpRight, PencilSimple, Trash } from '@phosphor-icons/react';
import { useQueries } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

// Define POAP type
export interface POAP {
  id: number;
  name: string;
  image_url?: string;
}

interface CredentialRuleProps {
  poaps?: POAP[];
  onChange: (poaps: POAP[]) => void;
  isEdit?: boolean;
  onEdit?: () => void;
  onClose?: () => void;
  isActive?: boolean;
  onToggleActive?: (active: boolean) => void;
  onDelete?: () => void;
  hasPermission?: boolean;
}

export const CredentialRule = ({
  poaps = [],
  onChange,
  isEdit = true,
  onEdit,
  onClose,
  isActive = false,
  onToggleActive,
  onDelete,
  hasPermission = true,
}: CredentialRuleProps) => {
  return (
    <div
      className={cn(
        'rounded-[10px] border border-white/10 bg-white/5 overflow-hidden m-[10px]',
      )}
    >
      {isEdit ? (
        <CredentialRule.Edit
          poaps={poaps}
          onChange={onChange}
          onClose={onClose}
        />
      ) : (
        <CredentialRule.Normal
          poaps={poaps}
          isActive={isActive}
          onToggleActive={onToggleActive}
          onEdit={onEdit}
          onDelete={onDelete}
          hasPermission={hasPermission}
        />
      )}
    </div>
  );
};

// Edit mode schema
const editSchema = yup.object({
  poap: yup
    .array()
    .of(yup.number().required())
    .min(1, 'At least one POAP is required')
    .required('POAP is required'),
});

interface EditProps {
  poaps?: POAP[];
  onChange: (poaps: POAP[]) => void;
  onClose?: () => void;
}

CredentialRule.Edit = memo(function Edit({
  poaps = [],
  onChange,
  onClose,
}: EditProps) {
  const form = useForm<yup.InferType<typeof editSchema>>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      poap: poaps?.map((item) => item.id) || [],
    },
    mode: 'all',
  });

  const { isValid, isDirty } = form.formState;

  // Handle POAP selection changes
  const handlePoapChange = useCallback(
    (poapIds: number[]) => {
      if (poapIds.length === 0) {
        // If no POAPs are selected, clear the poaps array
        onChange([]);
        return;
      }

      // Keep currently selected POAP objects
      const currentPoaps = poaps || [];

      // Filter out POAPs that are still in the selection
      const existingPoaps = currentPoaps.filter((poap) =>
        poapIds.includes(poap.id),
      );

      // Find newly added POAP IDs
      const newPoapIds = poapIds.filter(
        (id) => !currentPoaps.some((poap) => poap.id === id),
      );

      // Create objects for newly added POAP IDs
      const newPoaps = newPoapIds.map((id) => ({
        id,
        name: `POAP #${id}`, // Temporary name, should be fetched from API in real implementation
        image_url: '',
      }));

      // Merge existing and new POAPs
      const updatedPoaps = [...existingPoaps, ...newPoaps];

      onChange(updatedPoaps);
    },
    [poaps, onChange],
  );

  const handleSubmit = useCallback(() => {
    const values = form.getValues();
    handlePoapChange(values.poap);
    onClose?.();
  }, [form, handlePoapChange, onClose]);

  return (
    <FormProvider {...form}>
      <div className="flex items-center gap-2 p-[10px]">
        <Select
          classNames={{ trigger: 'p-[4px_10px] min-h-[35px] h-[35px]' }}
          isDisabled
          selectedKeys={['member']}
          aria-label="role"
        >
          <SelectItem key="member">Become Member</SelectItem>
        </Select>
        <span className="text-[16px] text-white/60">with</span>
        <Select
          classNames={{ trigger: 'p-[4px_10px] min-h-[35px] h-[35px]' }}
          isDisabled
          selectedKeys={['poap']}
          aria-label="rule"
        >
          <SelectItem key="poap">POAP</SelectItem>
        </Select>
      </div>
      <Divider />
      <Controller
        control={form.control}
        name="poap"
        render={({ field }) => (
          <div className="p-[10px]">
            <POAPAutocomplete
              initialValue={field.value}
              onChange={field.onChange}
            />
          </div>
        )}
      />
      <Divider />
      <div className="flex w-full justify-between p-2.5">
        <Button
          endContent={<ArrowUpRight size={18} />}
          className="h-[30px] gap-[5px] bg-transparent p-[2px_10px] mobile:hidden"
          onPress={() => {
            window.open('https://poap.xyz/create', '_blank');
          }}
        >
          Create a POAP
        </Button>
        <div className="flex gap-2">
          <Button
            color="submit"
            className="h-[30px] font-medium"
            isDisabled={!isValid || !isDirty}
            onPress={handleSubmit}
          >
            Create Rule
          </Button>
        </div>
      </div>
    </FormProvider>
  );
});

interface NormalProps {
  poaps?: POAP[];
  isActive: boolean;
  onToggleActive?: (active: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  hasPermission: boolean;
}

CredentialRule.Normal = memo(function Normal({
  poaps = [],
  isActive,
  onToggleActive,
  onEdit,
  onDelete,
  hasPermission,
}: NormalProps) {
  const [isPending, setIsPending] = useState(false);

  // Fetch POAP data
  const poapsData = useQueries({
    queries:
      poaps?.map((poap) => ({
        queryKey: ['ruleNormalPoaps', poap.id],
        queryFn: () => getPOAPs({ queryKey: ['ruleNormalPoaps', poap.id] }),
        enabled: !!poap.id,
        staleTime: Infinity,
      })) || [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data?.items),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  const handleToggleActive = useCallback(
    (v: boolean) => {
      setIsPending(true);
      try {
        onToggleActive?.(v);
      } catch (error: any) {
        addToast({
          title: '切换失败',
          description: error.message,
          severity: 'danger',
        });
      } finally {
        setIsPending(false);
      }
    },
    [onToggleActive],
  );

  return (
    <div
      className={cn(
        isActive &&
          'bg-[rgba(255,255,255,0.05)] bg-gradient-to-l from-transparent to-[rgba(55,179,135,0.1)] to-[110%]',
      )}
    >
      <div className="flex flex-col gap-[10px] p-[10px]">
        <div className="flex items-center justify-between mobile:flex-col mobile:items-start mobile:gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-white/10 p-[4px_10px] text-[14px] font-bold opacity-60">
              Become Member
            </div>
            <span className="text-[16px] text-white/60">with</span>
            <div className="rounded-lg border border-white/10 bg-white/10 p-[4px_10px] text-[14px] font-bold opacity-60">
              POAP
            </div>
          </div>
          {hasPermission && (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                radius="full"
                className="size-10 bg-[rgba(255,255,255,0.05)]"
                variant="flat"
                onPress={onDelete}
              >
                <Trash size={20} weight="fill" color="#ff5e5e" />
              </Button>
              <Button
                isIconOnly
                radius="full"
                className="size-10 bg-[rgba(255,255,255,0.05)]"
                variant="flat"
                onPress={onEdit}
              >
                <PencilSimple size={20} weight="fill" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {poapsData.isLoading ? (
            <>
              <div className="h-[20px] w-[100px] animate-pulse rounded-lg bg-white/10" />
              <div className="h-[20px] w-[100px] animate-pulse rounded-lg bg-white/10" />
            </>
          ) : (
            poapsData.data
              ?.flatMap((item) => item)
              ?.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-[13px]">{item.name}</span>
                  {index !==
                    poapsData.data?.flatMap((item) => item)?.length - 1 && (
                    <span className="text-[14px] font-medium opacity-50">
                      OR
                    </span>
                  )}
                </div>
              ))
          )}
        </div>
      </div>
      <Divider />
      <div className="flex items-center gap-2 bg-white/5 p-[10px]">
        <Switch
          color="success"
          isSelected={isActive}
          onValueChange={handleToggleActive}
          isReadOnly={isPending || !hasPermission}
          thumbIcon={
            isPending && <CircularProgress color="primary" size="sm" />
          }
        />
        <span className="text-[16px] font-bold text-white/60">
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
});
