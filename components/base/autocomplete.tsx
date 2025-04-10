import {
  extendVariants,
  Autocomplete as HAutocomplete,
  AutocompleteItem as HAutocompleteItem,
} from '@heroui/react';

const Autocomplete = extendVariants(HAutocomplete, {
  variants: {
    autocomplete: {
      default: {
        base: 'w-full',
        trigger: 'bg-white/[0.05] border border-white/[0.1] rounded-[8px]',
        value: 'text-white text-[14px]',
        listbox: 'bg-white/[0.05] border border-white/[0.1] rounded-[8px]',
        inputWrapper:
          'bg-white/[0.05] border border-white/[0.1] rounded-md p-1',
        input: 'text-white bg-transparent focus:outline-none',
      },
    },
  },
  defaultVariants: {
    // autocomplete: 'default',
  },
});

const AutocompleteItem = extendVariants(HAutocompleteItem, {
  variants: {
    item: {
      default: {
        base: 'flex items-center justify-between p-2 text-white hover:bg-white/[0.05] rounded-md cursor-pointer',
      },
    },
  },
  defaultVariants: {
    // item: 'default',
  },
});

export { Autocomplete, AutocompleteItem };
