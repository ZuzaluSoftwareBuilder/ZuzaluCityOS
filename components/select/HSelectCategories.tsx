import {Select, SelectItem, Chip} from "@/components/base";
import { SPACE_CATEGORIES } from '@/constant';
import { XCircleIcon } from '@heroicons/react/16/solid'

type Category = {
  value: string;
  label: string;
};

interface HSelectCategoriesProps {
  onChange: (value: string[]) => void;
  value?: string[];
}

export default function HSelectCategories({ onChange, value }: HSelectCategoriesProps) {
  const categories = SPACE_CATEGORIES as Category[];
  
  const handleRemoveItem = (itemValue: string) => {
    if (value) {
      const newValue = value.filter(v => v !== itemValue);
      onChange(newValue);
    }
  };
  
  return (
    <Select
      isMultiline
      items={categories}
      placeholder="Select categories"
      selectedKeys={value}
      onSelectionChange={(keys) => onChange(Array.from(keys) as string[])}
      renderValue={(items) => {
        return (
          <div className="flex flex-wrap gap-2 py-2">
            {items.map((item: any) => (
              <div key={item.key} className="flex items-center gap-1">
                <span className="text-small">{item.data.label}</span>
                <XCircleIcon 
                  className="w-4 h-4 opacity-30 cursor-pointer hover:opacity-60" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveItem(item.key as string);
                  }}
                />
              </div>
            ))}
          </div>
        );
      }}
      selectionMode="multiple"
      variant="bordered"
    >
      {(category: any) => {
        const item = category as Category;
        return (
          <SelectItem key={item.value} textValue={item.label}>
             <span className="text-small">{item.label}</span>
          </SelectItem>
        );
      }}
    </Select>
  );
}
