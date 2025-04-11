import { Input, Textarea } from '@/components/base';
import { Controller, useFormContext } from 'react-hook-form';
import POAPAutocomplete from './poapAutocomplete';

interface POAPProps {
  initialValue?: number[];
  onChange: (_value: number[]) => void;
}

const POAP = ({ initialValue, onChange }: POAPProps) => {
  return (
    <div className="p-[10px]">
      <POAPAutocomplete initialValue={initialValue} onChange={onChange} />
    </div>
  );
};

const ZuPass = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-5 p-[10px]">
      <div className="flex flex-col gap-2.5">
        <p className="text-[16px] font-medium leading-[1.2]">Public Key</p>
        <Controller
          control={control}
          name="zupass.registration"
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="e.g. 1ebfb9...e75003,10ec38...b7d204"
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[16px] font-medium leading-[1.2]">Event ID</p>
        <Controller
          control={control}
          name="zupass.eventId"
          render={({ field }) => (
            <Input
              {...field}
              placeholder="e.g. 6f5f194b-xxxx-xxxx-xxxx-0998f3eacc75"
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="text-[16px] font-medium leading-[1.2]">Event Name</p>
        <Controller
          control={control}
          name="zupass.eventName"
          render={({ field }) => (
            <Input {...field} placeholder="e.g. Example Event Name" />
          )}
        />
      </div>
    </div>
  );
};

export { POAP, ZuPass };
