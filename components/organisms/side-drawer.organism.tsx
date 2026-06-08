"use client";

import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/atoms/index.atoms";

interface SideDrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function SideDrawer({
  children,
  isOpen,
  onClose,
  title,
}: SideDrawerProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-100 bg-background/80 backdrop-blur-sm'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            animate={{ x: 0 }}
            className='fixed right-0 top-0 bottom-0 z-101 w-full max-w-2xl bg-surface border-l border-border shadow-2xl flex flex-col'
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ damping: 20, stiffness: 300, type: "spring" }}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-border bg-background shrink-0'>
              <h2 className='font-display font-bold text-lg tracking-widest uppercase text-content-primary'>
                {title}
              </h2>
              <Button
                className='rounded-none text-content-secondary hover:text-content-primary transition-all'
                onClick={onClose}
                size='icon'
                variant='ghost'
              >
                <XIcon className='h-5 w-5' />
              </Button>
            </div>

            {/* Content Area */}
            <div className='flex-1 overflow-y-auto p-6 relative'>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
