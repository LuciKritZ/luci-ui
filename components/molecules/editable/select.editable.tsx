'use client';

import { PencilIcon } from 'lucide-react';
import React, { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/index.atoms';
import { cn } from '@/utils/index.utils';

interface EditableSelectProps {
  className?: string;
  onSave: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}

export function EditableSelect({
  className,
  onSave,
  options,
  value,
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  const handleSave = (newVal: string) => {
    if (newVal !== value) {
      onSave(newVal);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={className}>
        <Select
          defaultOpen
          onOpenChange={open => !open && setIsEditing(false)}
          onValueChange={handleSave}
          value={value}
        >
          <SelectTrigger className='h-6 text-xs px-2 py-0'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div
      className={cn('group flex items-center gap-2 cursor-pointer', className)}
      onClick={() => setIsEditing(true)}
    >
      <span className='truncate'>{selectedOption?.label || value}</span>
      <PencilIcon className='w-3 h-3 text-content-tertiary opacity-0 group-hover:opacity-100 transition-opacity' />
    </div>
  );
}
