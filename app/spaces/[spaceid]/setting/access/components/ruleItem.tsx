import { Button, Divider, Select, SelectItem } from '@/components/base';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowUpRight } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { memo } from 'react';
import * as yup from 'yup';
import { POAP } from './rule';
import { ZuPass } from './rule';
import { cn } from '@heroui/react';

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
});

RuleItem.Edit = memo(function Edit() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<yup.InferType<typeof editSchema>>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      rule: 'poap',
    },
  });

  const rule = watch('rule');

  return (
    <>
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
          control={control}
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
      {rule === 'poap' && <POAP />}
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
          <Button color="submit" className="h-[30px] font-medium">
            Create Rule
          </Button>
        </div>
      </div>
    </>
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
