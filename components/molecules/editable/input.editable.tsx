'use client';

import { PencilIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/atoms/index.atoms';
import { cn } from '@/utils/index.utils';

interface EditableInputProps {
  className?: string;
  inputClassName?: string;
  onSave: (value: string) => void;
  prefix?: React.ReactNode;
  type?: 'number' | 'text';
  value: number | string;
}

export function EditableInput({
  className,
  inputClassName,
  onSave,
  prefix,
  type = 'text',
  value,
}: EditableInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value?.toString() || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value?.toString() || '');
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (currentValue !== value?.toString()) {
      onSave(currentValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value?.toString() || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (isEditing) {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {prefix}
        <Input
          className={cn(
            'h-6 px-2 py-0 text-xs w-auto focus-visible:ring-1',
            inputClassName
          )}
          onBlur={handleSave}
          onChange={e => setCurrentValue(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type={type}
          value={currentValue}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('group flex items-center gap-2 cursor-pointer', className)}
      onClick={() => setIsEditing(true)}
    >
      {prefix}
      <span className={cn('truncate', type === 'number' && 'font-mono')}>
        {value}
      </span>
      <PencilIcon className='w-3 h-3 text-content-tertiary opacity-0 group-hover:opacity-100 transition-opacity' />
    </div>
  );
}
