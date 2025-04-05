import { Button, Divider, Select, SelectItem } from '@/components/base';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { memo, useCallback } from 'react';
import * as yup from 'yup';
import { POAP } from './rule';
import { ZuPass } from './rule';
import { cn } from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { executeQuery } from '@/utils/ceramic';
import { CREATE_SPACE_GATING_RULE } from '@/services/graphql/spaceGating';
import { useParams } from 'next/navigation';

interface AccessRuleProps {
  title: string;
  tags: string[];
  isActive: boolean;
  onEdit: () => void;
}

const RuleItem = ({ title, tags, isActive, onEdit }: AccessRuleProps) => {
  return (
    <div className="w-full rounded-[10px] border border-white/10 bg-white/5">
      <RuleItem.Edit />
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

RuleItem.Normal = memo(function Normal() {
  return (
    <>
      <div className="flex items-center gap-2 p-5">
        <Select
          classNames={{ trigger: 'p-[4px_10px] min-h-[35px] h-[35px]' }}
          isDisabled
          selectedKeys={['member']}
        >
          <SelectItem key="member">Become Member</SelectItem>
        </Select>
        <span className="text-[16px] text-white/60">with</span>
        <Select classNames={{ trigger: 'p-[4px_10px] min-h-[35px] h-[35px]' }}>
          <SelectItem key="poap">POAP</SelectItem>
          <SelectItem key="zupass">ZuPass</SelectItem>
        </Select>
      </div>
      <Divider />
    </>
  );
});

export default RuleItem;
