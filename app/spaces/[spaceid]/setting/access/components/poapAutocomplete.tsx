import { Autocomplete, AutocompleteItem, Button } from '@/components/base';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Key, useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery, useQueries } from '@tanstack/react-query';
import { Image, Skeleton } from '@heroui/react';
import { useInfiniteScroll } from '@heroui/use-infinite-scroll';
import useDebounce from '@/hooks/useDebounce';
import { getPOAPs } from '@/services/poap';

interface POAP {
  id: number;
  name: string;
  image_url: string;
}

interface IPOAPAutocompleteProps {
  initialValue?: number[];
  onChange: (value: number[]) => void;
}

export default function POAPAutocomplete({
  initialValue,
  onChange,
}: IPOAPAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [items, setItems] = useState<POAP[]>([]);
  const [selectedPOAP, setSelectedPOAP] = useState<POAP[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['poaps', debouncedQuery],
      queryFn: getPOAPs,
      enabled: debouncedQuery.length > 0,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        const nextOffset = lastPage.offset + lastPage.limit;
        return nextOffset < lastPage.total ? nextOffset : undefined;
      },
      staleTime: 5 * 60 * 1000,
    });

  const initialPOAPs = useQueries({
    queries:
      initialValue?.map((id) => ({
        queryKey: ['poaps', id],
        queryFn: () => getPOAPs({ queryKey: ['poaps', id] }),
        enabled: !!id,
      })) || [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data?.items),
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: hasNextPage,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: fetchNextPage,
  });

  const handleSelectionChange = useCallback(
    (key: Key | null) => {
      setSearchQuery('');
      setSelectedKey(key);
      const foundItem = items.find((item) => item.id === Number(key));
      if (foundItem && !selectedPOAP.some((item) => item.id === foundItem.id)) {
        setItems([]);
        setSelectedPOAP((v) => [...v, foundItem]);
      }
    },
    [items, selectedPOAP],
  );

  useEffect(() => {
    if (!initialPOAPs.isLoading && initialPOAPs.data) {
      setSelectedPOAP(initialPOAPs.data.flatMap((item) => item));
    }
  }, [initialPOAPs.isLoading, initialPOAPs.data]);

  useEffect(() => {
    if (data) {
      const allItems = data.pages.flatMap((page) => page.items);
      setItems(allItems);
    }
  }, [data]);

  useEffect(() => {
    if (selectedKey) {
      setSelectedKey(null);
    }
  }, [selectedKey]);

  useEffect(() => {
    const ids = selectedPOAP.map((item) => item.id) || [];
    onChange(ids);
  }, [onChange, selectedPOAP]);

  return (
    <div className="flex flex-col gap-[10px]">
      <Autocomplete
        isLoading={isLoading || isFetchingNextPage}
        items={items}
        aria-label="Select a POAP event"
        placeholder="Type to search POAPs..."
        inputProps={{
          classNames: {
            inputWrapper: 'bg-white/5 border border-white/10',
          },
        }}
        scrollRef={scrollerRef}
        popoverProps={{
          placement: 'bottom',
        }}
        menuTrigger="input"
        selectedKey={selectedKey}
        inputValue={searchQuery}
        startContent={<MagnifyingGlass size={20} className="opacity-50" />}
        onInputChange={setSearchQuery}
        onSelectionChange={handleSelectionChange}
        onOpenChange={setIsOpen}
      >
        {(item: any) => {
          return (
            <AutocompleteItem key={item.id} textValue={item.name}>
              <div className="flex items-center gap-2">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    className="size-6 min-w-6 rounded-full"
                  />
                )}
                <span className="line-clamp-1">{item.name}</span>
              </div>
            </AutocompleteItem>
          );
        }}
      </Autocomplete>
      <div className="flex flex-wrap gap-2">
        {initialPOAPs.isLoading ? (
          <>
            <Skeleton className="h-[30px] w-[100px] rounded-lg" />
            <Skeleton className="h-[30px] w-[100px] rounded-lg" />
          </>
        ) : (
          selectedPOAP.map((item) => (
            <Button
              key={item.id}
              size="sm"
              color="functional"
              endContent={<X size={16} />}
              className="h-[30px] p-[4px_8px]"
              onPress={() => {
                setSelectedPOAP((v) => v.filter((i) => i.id !== item.id));
              }}
            >
              {item.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
