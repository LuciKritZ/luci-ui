import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/atoms/badge.atom';
import { Button } from '@/components/atoms/index.atoms';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/index.atoms';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/index.atoms';
import { cn } from '@/utils/cn.utils';

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  className?: string;
  emptyText?: string;
  onChange: (selected: string[]) => void;
  options: Option[];
  placeholder?: string;
  selected: string[];
}

export function MultiSelect({
  className,
  emptyText = 'No results found.',
  onChange,
  options,
  placeholder = 'Select items...',
  selected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter(i => i !== item));
  };

  const handleSelect = (currentValue: string) => {
    if (selected.includes(currentValue)) {
      onChange(selected.filter(item => item !== currentValue));
    } else {
      onChange([...selected, currentValue]);
    }
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto min-h-[38px] px-3 py-2',
            className
          )}
          role='combobox'
          variant='outline'
        >
          <div className='flex flex-wrap gap-1 items-center'>
            {selected.length === 0 && (
              <span className='text-muted-foreground font-normal'>
                {placeholder}
              </span>
            )}
            {selected.map(itemValue => {
              const option = options.find(o => o.value === itemValue);
              if (!option) return null;
              return (
                <Badge
                  className='mr-1 hover:bg-secondary/80 font-normal rounded-sm px-1.5 py-0.5 text-xs'
                  key={itemValue}
                  variant='secondary'
                >
                  {option.label}
                  <div
                    className='ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer inline-flex items-center'
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(itemValue);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleUnselect(itemValue);
                      }
                    }}
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <XIcon className='h-3 w-3 text-muted-foreground hover:text-foreground transition-colors' />
                  </div>
                </Badge>
              );
            })}
          </div>
          <ChevronsUpDownIcon className='h-4 w-4 shrink-0 opacity-50 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-[--radix-popover-trigger-width] p-0'
      >
        <Command>
          <CommandInput placeholder='Search...' />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                  value={option.value}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      selected.includes(option.value)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
