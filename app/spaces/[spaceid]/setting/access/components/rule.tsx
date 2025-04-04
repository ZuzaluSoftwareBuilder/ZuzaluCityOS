import POAPAutocomplete from './poapAutocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/base';

interface POAPProps {
  initialValue?: number[];
  onChange: (value: number[]) => void;
}

const POAP = ({ initialValue, onChange }: POAPProps) => {
  return (
    <div className="p-5">
      <POAPAutocomplete initialValue={initialValue} onChange={onChange} />
    </div>
  );
};

const ZuPass = () => {
  const { control } = useFormContext();
  return (
    <div className="p-5">
      <Controller
        control={control}
        name="publicKey"
        render={({ field }) => <Input {...field} placeholder="Public Key" />}
      />
      <Controller
        control={control}
        name="eventId"
        render={({ field }) => <Input {...field} placeholder="Event ID" />}
      />
      <Controller
        control={control}
        name="eventName"
        render={({ field }) => <Input {...field} placeholder="Event Name" />}
      />
    </div>
  );
};

export { POAP, ZuPass };
