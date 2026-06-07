import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/atoms/index.atoms';

export interface ConfirmationDialogProps {
  cancelText?: string;
  confirmText?: string;
  description: React.ReactNode;
  isDestructive?: boolean;
  onConfirm: (e?: React.MouseEvent) => void;
  title: string;
  trigger: React.ReactNode;
}

export function ConfirmationDialog({
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  description,
  isDestructive = true,
  onConfirm,
  title,
  trigger,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className='rounded-none border-border bg-surface'>
        <AlertDialogHeader>
          <AlertDialogTitle className='font-display uppercase tracking-widest text-content-primary'>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className='font-mono text-content-secondary'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-none border-border font-display uppercase tracking-wider'>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            className={`rounded-none font-display uppercase tracking-wider ${
              isDestructive
                ? 'bg-status-red text-white hover:bg-status-red/90'
                : ''
            }`}
            onClick={(e: React.MouseEvent) => {
              // Stop propagation if this is inside a clickable row/card
              e.stopPropagation();
              onConfirm(e);
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
