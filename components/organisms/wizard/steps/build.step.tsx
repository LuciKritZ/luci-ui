"use client";

import { motion } from "framer-motion";
import { CheckCircle2Icon, Loader2Icon, SparklesIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useProject } from "@/contexts/project.context";

const STEPS = [
  "Analyzing your idea...",
  "Applying design tokens...",
  "Generating component architecture...",
  "Assembling your Next.js PWA...",
  "Finalizing build...",
];

export function BuildStep() {
  const { setWizardStep } = useProject();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < STEPS.length - 1) return prev + 1;
        clearInterval(interval);
        setTimeout(() => setWizardStep("iterate"), 1500);
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [setWizardStep]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[500px] w-full max-w-lg mx-auto py-20 px-4'>
      <div className='relative mb-16'>
        <div className='absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150' />
        <motion.div
          animate={{ rotate: 360 }}
          className='relative w-32 h-32 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center'
          transition={{ duration: 8, ease: "linear", repeat: Infinity }}
        >
          <div className='w-24 h-24 rounded-full border-t-2 border-white animate-spin-slow' />
        </motion.div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <SparklesIcon className='w-8 h-8 text-white' />
        </div>
      </div>

      <div className='w-full space-y-6'>
        {STEPS.map((step, i) => {
          const isActive = i === currentStepIndex;
          const isDone = i < currentStepIndex;
          return (
            <motion.div
              animate={{ opacity: isActive || isDone ? 1 : 0.3, x: 0 }}
              className='flex items-center gap-4'
              initial={{ opacity: 0, x: -20 }}
              key={step}
              transition={{ delay: i * 0.1 }}
            >
              <div className='shrink-0'>
                {isDone ? (
                  <CheckCircle2Icon className='w-5 h-5 text-emerald-500' />
                ) : isActive ? (
                  <Loader2Icon className='w-5 h-5 text-white animate-spin' />
                ) : (
                  <div className='w-5 h-5 rounded-full border border-zinc-800' />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${isActive ? "text-white" : "text-zinc-500"}`}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
