import { Select as HSelect, SelectItem, SelectProps } from '@heroui/react';
import React from 'react';

export interface ISelectOption {
  key: string;
  label: string;
}

export interface ISelectProps
  extends Omit<SelectProps, 'children' | 'onSelectionChange'> {
  options: ISelectOption[];
  defaultSelectedKey?: string;
  placeholder?: string;
  startContent?: React.ReactNode;
  onSelectionChange?: (key: string) => void;
}

const CalendarSelect: React.FC<ISelectProps> = ({
  options,
  defaultSelectedKey,
  placeholder,
  startContent,
  onSelectionChange,
  ...props
}) => {
  const handleSelectionChange = (keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;
    onSelectionChange?.(selectedKey);
  };

  return (
    <HSelect
      variant="bordered"
      className="max-w-xs"
      defaultSelectedKeys={
        defaultSelectedKey ? [defaultSelectedKey] : undefined
      }
      placeholder={placeholder}
      startContent={startContent}
      classNames={{
        ...props.classNames,
        trigger: `border-b-w-10 ${props.classNames?.trigger || ''}`,
      }}
      onSelectionChange={handleSelectionChange}
      {...props}
    >
      {options.map((option) => (
        <SelectItem key={option.key}>{option.label}</SelectItem>
      ))}
    </HSelect>
  );
};

export default CalendarSelect;
