import { Button, Divider, Select, SelectItem } from '@/components/base';
import {
  addToast,
  CircularProgress,
  cn,
  Skeleton,
  Switch,
} from '@heroui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpRight, PencilSimple, Trash } from '@phosphor-icons/react';
import { useMutation, useQueries } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { POAP, ZuPass } from './rule';

import { formatAddressString } from '@/components/layout/Header/UserProfileSection';
import { useModal } from '@/context/ModalContext';
import { SpaceGating } from '@/models/spaceGating';
import { getPOAPs } from '@/services/poap';
import { createRule, deleteRule, updateRule } from '@/services/space/rule';
import { PermissionName } from '@/types';
import { useParams } from 'next/navigation';
import { useSpaceData } from '../../../components/context/spaceData';
import { useSpacePermissions } from '../../../components/permission';

interface AccessRuleProps {
  data: SpaceGating;
  handleAddRule: () => void;
}

const RuleItem = ({ data, handleAddRule }: AccessRuleProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const isNew = data.id === 'new';
  const handleEdit = useCallback(() => {
    if (isNew) handleAddRule();
    setIsEdit((v) => !v);
  }, [handleAddRule, isNew]);

  return (
    <div
      className={cn(
        'w-full rounded-[10px] border border-white/10 bg-white/5 overflow-hidden',
      )}
    >
      {isEdit || isNew ? (
        <RuleItem.Edit
          data={data}
          onClose={handleEdit}
          handleAddRule={handleAddRule}
        />
      ) : (
        <RuleItem.Normal data={data} onEdit={handleEdit} />
      )}
    </div>
  );
};

interface EditProps {
  data?: SpaceGating;
  onClose: () => void;
  handleAddRule: () => void;
}

const editSchema = yup.object({
  rule: yup.string().required(),
  poap: yup
    .array()
    .of(yup.number().required())
    .when('rule', {
      is: 'poap',
      then: (schema) =>
        schema
          .min(1, 'At least one POAP is required')
          .required('POAP is required'),
      otherwise: (schema) => schema.strip(),
    }),
  zupass: yup
    .object({
      registration: yup.string().required('Public key is required'),
      eventId: yup.string().required('Event ID is required'),
      eventName: yup.string().required('Event name is required'),
    })
    .when('rule', {
      is: 'zupass',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.strip(),
    }),
});

RuleItem.Edit = memo(function Edit({
  data,
  onClose,
  handleAddRule,
}: EditProps) {
  const { refreshSpaceData } = useSpaceData();
  const isNew = data?.id === 'new';

  const form = useForm<yup.InferType<typeof editSchema>>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      rule: isNew
        ? 'poap'
        : data?.poapsId && data.poapsId.length > 0
          ? 'poap'
          : 'zupass',
      poap: data?.poapsId?.map((item) => Number(item.poapId)) || [],
      zupass: {
        registration: data?.zuPassInfo?.registration || '',
        eventId: data?.zuPassInfo?.eventId || '',
        eventName: data?.zuPassInfo?.eventName || '',
      },
    },
    mode: 'all',
    shouldUnregister: false,
  });

  const spaceId = useParams().spaceid;

  const createRuleMutation = useMutation({
    mutationFn: (value: yup.InferType<typeof editSchema>) => {
      return createRule({
        id: spaceId as string,
        ...(value.rule === 'poap' && {
          poapsId: value.poap?.map((item) => ({ poapId: item })),
        }),
        ...(value.rule === 'zupass' && {
          zuPassInfo: {
            registration: value.zupass.registration,
            eventId: value.zupass.eventId,
            eventName: value.zupass.eventName,
          },
        }),
      });
    },
    onSuccess: async () => {
      await refreshSpaceData();
      onClose();
      handleAddRule();
    },
  });

  const updateRuleMutation = useMutation({
    mutationFn: (value: yup.InferType<typeof editSchema>) => {
      return updateRule({
        id: spaceId as string,
        ruleId: data!.id,
        poapsId: null,
        zuPassInfo: null,
        ...(value.rule === 'poap' && {
          poapsId: value.poap?.map((item) => ({ poapId: item })),
        }),
        ...(value.rule === 'zupass' && {
          zuPassInfo: {
            registration: value.zupass.registration,
            eventId: value.zupass.eventId,
            eventName: value.zupass.eventName,
          },
        }),
      });
    },
    onSuccess: async () => {
      await refreshSpaceData();
      onClose();
    },
  });

  const { isValid, isDirty } = form.formState;

  const rule = form.watch('rule');

  const handleSubmit = useCallback(
    (value: yup.InferType<typeof editSchema>) => {
      if (isNew) {
        createRuleMutation.mutate(value);
      } else {
        updateRuleMutation.mutate(value);
      }
    },
    [createRuleMutation, isNew, updateRuleMutation],
  );

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
        <Controller
          control={form.control}
          name="rule"
          render={({ field }) => (
            <Select
              classNames={{ trigger: 'p-[4px_10px] min-h-[35px] h-[35px]' }}
              selectedKeys={[field.value]}
              aria-label="rule"
              onSelectionChange={(e) => {
                field.onChange(e.currentKey);
              }}
            >
              <SelectItem key="poap">POAP</SelectItem>
              <SelectItem key="zupass">ZuPass</SelectItem>
            </Select>
          )}
        />
      </div>
      <Divider />
      {rule === 'poap' && (
        <Controller
          control={form.control}
          name="poap"
          render={({ field }) => (
            <POAP initialValue={field.value} onChange={field.onChange} />
          )}
        />
      )}
      {rule === 'zupass' && <ZuPass />}
      <Divider />
      <div
        className={cn(
          'flex justify-end p-2.5 w-full',
          rule === 'poap' && 'justify-between mobile:justify-end',
        )}
      >
        {rule === 'poap' && (
          <Button
            endContent={<ArrowUpRight size={18} />}
            className="h-[30px] gap-[5px] bg-transparent p-[2px_10px] mobile:hidden"
            onPress={() => {
              window.open('https://poap.gallery', '_blank');
            }}
          >
            Create a POAP
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            color="functional"
            className="h-[30px] font-medium"
            onPress={onClose}
          >
            Discard
          </Button>
          <Button
            color="submit"
            className="h-[30px] font-medium"
            isDisabled={!isValid || !isDirty}
            isLoading={
              !isNew
                ? updateRuleMutation.isPending
                : createRuleMutation.isPending
            }
            onPress={(_e) => form.handleSubmit(handleSubmit)()}
          >
            {isNew ? 'Create Rule' : 'Update Rule'}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
});

interface NormalProps {
  data: SpaceGating;
  onEdit: () => void;
}

RuleItem.Normal = memo(function Normal({ data, onEdit }: NormalProps) {
  const { gatingStatus, zuPassInfo, poapsId, spaceId } = data;
  const [isActive, setIsActive] = useState(gatingStatus === '1');

  const { showModal } = useModal();
  const { refreshSpaceData } = useSpaceData();
  const { checkPermission } = useSpacePermissions();

  const toggleActiveMutation = useMutation({
    mutationFn: (v: boolean) =>
      updateRule({
        ...data,
        id: spaceId,
        ruleId: data.id,
        gatingStatus: v ? '1' : '0',
      }),
    onError: (error) => {
      addToast({
        title: 'Failed to toggle',
        description: error.message,
        severity: 'danger',
      });
      setIsActive((v) => !v);
    },
    onSuccess: () => {
      refreshSpaceData();
    },
  });

  const poapsData = useQueries({
    queries:
      poapsId?.map((id) => ({
        queryKey: ['ruleNormalPoaps', id.poapId],
        queryFn: () => getPOAPs({ queryKey: ['ruleNormalPoaps', id.poapId] }),
        enabled: !!id.poapId,
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
      setIsActive(v);
      toggleActiveMutation.mutate(v);
    },
    [toggleActiveMutation],
  );

  const handleDelete = useCallback(() => {
    showModal({
      title: 'Delete Rule',
      contentText: 'Are you sure you want to delete this rule?',
      confirmAction: async () => {
        await deleteRule({
          id: spaceId,
          ruleId: data.id,
        });
        refreshSpaceData();
      },
    });
  }, [showModal, spaceId, data.id, refreshSpaceData]);

  const hasZuPass = (poapsId ?? [])?.length === 0;
  const hasPermission = checkPermission(PermissionName.MANAGE_ACCESS);

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
              {hasZuPass ? 'ZuPass' : 'POAP'}
            </div>
          </div>
          {hasPermission && (
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                radius="full"
                className="size-10 bg-[rgba(255,255,255,0.05)]"
                variant="flat"
                onPress={handleDelete}
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
        {!hasZuPass ? (
          <div className="flex flex-wrap gap-2">
            {poapsData.isLoading ? (
              <>
                <Skeleton className="h-[20px] w-[100px] rounded-lg" />
                <Skeleton className="h-[20px] w-[100px] rounded-lg" />
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
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-[13px] font-medium opacity-50">
                Public Key:
              </span>
              <span className="text-[13px]">
                {formatAddressString(zuPassInfo?.registration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium opacity-50">
                Event ID:
              </span>
              <span className="text-[13px]">{zuPassInfo?.eventId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium opacity-50">
                Event Name:
              </span>
              <span className="text-[13px]">{zuPassInfo?.eventName}</span>
            </div>
          </div>
        )}
      </div>
      <Divider />
      <div className="flex items-center gap-2 bg-white/5 p-[10px]">
        <Switch
          color="success"
          isSelected={isActive}
          onValueChange={handleToggleActive}
          isReadOnly={toggleActiveMutation.isPending || !hasPermission}
          thumbIcon={
            toggleActiveMutation.isPending && (
              <CircularProgress color="primary" size="sm" />
            )
          }
        />
        <span className="text-[16px] font-bold text-white/60">
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
});

export default RuleItem;
