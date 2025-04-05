import { Button, Divider, Select, SelectItem } from '@/components/base';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpRight, PencilSimple, Trash } from '@phosphor-icons/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { memo, useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { POAP } from './rule';
import { ZuPass } from './rule';
import {
  addToast,
  CircularProgress,
  cn,
  Skeleton,
  Switch,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { executeQuery } from '@/utils/ceramic';
import {
  CREATE_SPACE_GATING_RULE,
  UPDATE_SPACE_GATING_RULE,
} from '@/services/graphql/spaceGating';
import { useParams } from 'next/navigation';
import { SpaceGating } from '@/types';
import { useSpaceData } from '../../../components/context/spaceData';
import { getPOAPs } from '@/services/poap';

interface AccessRuleProps {
  data: SpaceGating;
  onEdit: () => void;
}

const RuleItem = ({ data, onEdit }: AccessRuleProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleEdit = useCallback(() => {
    setIsEdit((v) => !v);
  }, []);

  return (
    <div
      className={cn(
        'w-full rounded-[10px] border border-white/10 bg-white/5 overflow-hidden',
      )}
    >
      {isEdit ? (
        <RuleItem.Edit />
      ) : (
        <RuleItem.Normal data={data} onEdit={handleEdit} />
      )}
    </div>
  );
};

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

RuleItem.Edit = memo(function Edit() {
  const form = useForm<yup.InferType<typeof editSchema>>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      rule: 'poap',
      poap: [],
      zupass: {
        registration: '',
        eventId: '',
        eventName: '',
      },
    },
    mode: 'all',
    shouldUnregister: false,
  });

  const spaceId = useParams().spaceid;

  const createRuleMutation = useMutation({
    mutationFn: (data: yup.InferType<typeof editSchema>) => {
      return executeQuery(CREATE_SPACE_GATING_RULE, {
        input: {
          content: {
            spaceId: spaceId as string,
            ...(data.rule === 'poap' && {
              PoapsId: data.poap?.map((id) => ({ poapId: id.toString() })),
            }),
            ...(data.rule === 'zupass' && {
              zuPassInfo: [
                {
                  registration: data.zupass.registration,
                  eventId: data.zupass.eventId,
                  eventName: data.zupass.eventName,
                },
              ],
            }),
          },
        },
      });
    },
  });

  const { isValid } = form.formState;

  const rule = form.watch('rule');

  const handleSubmit = useCallback(
    (data: yup.InferType<typeof editSchema>) => {
      createRuleMutation.mutate(data);
    },
    [createRuleMutation],
  );

  return (
    <FormProvider {...form}>
      <div className="flex items-center gap-2 p-5">
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
          rule === 'poap' && 'justify-between',
        )}
      >
        {rule === 'poap' && (
          <Button
            endContent={<ArrowUpRight size={18} />}
            className="h-[30px] gap-[5px] bg-transparent p-[2px_10px]"
            onPress={() => {
              window.open('https://poap.gallery', '_blank');
            }}
          >
            Create a POAP
          </Button>
        )}
        <div className="flex gap-2">
          <Button color="functional" className="h-[30px] font-medium">
            Discard
          </Button>
          <Button
            color="submit"
            className="h-[30px] font-medium"
            isDisabled={!isValid}
            isLoading={createRuleMutation.isPending}
            onPress={(_e) => form.handleSubmit(handleSubmit)()}
          >
            Create Rule
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
  const { gatingStatus, zuPassInfo, PoapsId } = data;
  const [isActive, setIsActive] = useState(gatingStatus === '1');
  const [isLoading, setIsLoading] = useState(false);
  const [poapData, setPoapData] = useState<string[]>([]);

  const { refreshSpaceData } = useSpaceData();
  const toggleActiveMutation = useMutation({
    mutationFn: (v: boolean) => {
      return executeQuery(UPDATE_SPACE_GATING_RULE, {
        input: {
          id: data.id,
          content: {
            gatingStatus: v ? '1' : '0',
          },
        },
      });
    },
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

  const handleToggleActive = useCallback(
    (v: boolean) => {
      setIsActive(v);
      toggleActiveMutation.mutate(v);
    },
    [toggleActiveMutation],
  );

  const hasZuPass = zuPassInfo?.length > 0;

  useEffect(() => {
    if (PoapsId?.length) {
      const getData = async () => {
        setIsLoading(true);
        const data = await Promise.all(
          PoapsId.map((item) => getPOAPs({ queryKey: ['poaps', item.poapId] })),
        );
        setPoapData(
          data.flatMap((item) => item.items.map((item: any) => item.name)),
        );
        setIsLoading(false);
      };
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        isActive &&
          'bg-[rgba(255,255,255,0.05)] bg-gradient-to-l from-transparent to-[rgba(55,179,135,0.1)] to-[110%]',
      )}
    >
      <div className="flex flex-col gap-[10px] p-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-white/10 bg-white/10 p-[4px_10px] text-[14px] font-bold opacity-60">
              Become Member
            </div>
            <span className="text-[16px] text-white/60">with</span>
            <div className="rounded-lg border border-white/10 bg-white/10 p-[4px_10px] text-[14px] font-bold opacity-60">
              {hasZuPass ? 'ZuPass' : 'POAP'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              radius="full"
              className="size-10 bg-[rgba(255,255,255,0.05)]"
              variant="flat"
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
        </div>
        {!hasZuPass ? (
          <div className="flex flex-wrap gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-[20px] w-[100px] rounded-lg" />
                <Skeleton className="h-[20px] w-[100px] rounded-lg" />
              </>
            ) : (
              poapData.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-[13px]">{item}</span>
                  {index !== poapData.length - 1 && (
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
              <span className="text-[13px] font-medium opacity-50">
                Public Key:
              </span>
              <span className="text-[13px]">{zuPassInfo[0].registration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium opacity-50">
                Event ID:
              </span>
              <span className="text-[13px]">{zuPassInfo[0].eventId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium opacity-50">
                Event Name:
              </span>
              <span className="text-[13px]">{zuPassInfo[0].eventName}</span>
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
          isReadOnly={toggleActiveMutation.isPending}
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
