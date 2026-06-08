"use client";

import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/atoms/index.atoms";

interface SidebarItemProps {
  active: boolean;
  danger?: boolean;
  expanded: boolean;
  href?: string;
  icon: React.ReactNode;
  id: string;
  label: string;
  onClick?: () => void;
}

export function SidebarItem({
  active,
  danger = false,
  expanded,
  href,
  icon,
  id,
  label,
  onClick,
}: SidebarItemProps) {
  const [hovered, setHovered] = useState(false);

  const getTextColor = () => {
    if (danger) return hovered ? "text-destructive" : "text-content-secondary";
    if (active) return "text-brand";
    if (hovered) return "text-content-primary";
    return "text-content-secondary";
  };

  const content = (
    <>
      {active && (
        <div
          aria-hidden
          className='absolute inset-0 bg-brand/10 pointer-events-none'
        />
      )}
      <span className='shrink-0 relative z-10'>{icon}</span>
      {expanded && (
        <span
          className={`text-[12px] font-display tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis relative z-10 transition-all duration-300
            ${active ? "font-bold" : "font-medium"}`}
        >
          {label}
        </span>
      )}
    </>
  );

  const className = `w-full flex items-center gap-4 px-5 h-14 border-l-4 transition-all duration-300 overflow-hidden relative text-left
    ${active ? "border-brand bg-brand/5" : "border-transparent"}
    ${onClick || href ? "cursor-pointer" : "cursor-default"}
    ${getTextColor()}`;

  if (href) {
    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={className}
        href={href}
        id={id}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={!expanded ? label : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <Button
      aria-current={active ? "page" : undefined}
      className={className}
      disabled={!onClick}
      id={id}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={!expanded ? label : undefined}
      type='button'
      variant='ghost'
    >
      {content}
    </Button>
  );
}
