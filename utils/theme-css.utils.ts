import { IDesignTheme } from "@/contexts/design.context";

export function generateThemeCss(theme: IDesignTheme): string {
  return `:root {
  /* Light Mode (Default) */
  --bg-primary: ${theme.colors.light.background};
  --bg-secondary: ${theme.colors.light.surface || theme.colors.light.card};
  --text-primary-val: ${theme.colors.light.content || theme.colors.light.primaryForeground};
  --text-secondary-val: ${theme.colors.light.mutedForeground};
  --text-tertiary-val: ${theme.colors.light.mutedForeground};
  --border-color-val: ${theme.colors.light.border};
  --accent-color-val: ${theme.colors.light.primary};
  --glow-color: color-mix(in srgb, ${theme.colors.light.primary} 8%, transparent);

  /* Shadcn UI specifics */
  --destructive-val: ${theme.colors.light.destructive};
  --destructive-foreground-val: ${theme.colors.light.destructiveForeground};
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.447 0 0);
  --chart-4: oklch(0.366 0 0);
  --chart-5: oklch(0.297 0 0);
}

.dark {
  /* Dark Mode */
  --bg-primary: ${theme.colors.dark.background};
  --bg-secondary: ${theme.colors.dark.surface || theme.colors.dark.card};
  --text-primary-val: ${theme.colors.dark.content || theme.colors.dark.primaryForeground};
  --text-secondary-val: ${theme.colors.dark.mutedForeground};
  --text-tertiary-val: ${theme.colors.dark.mutedForeground};
  --border-color-val: ${theme.colors.dark.border};
  --accent-color-val: ${theme.colors.dark.primary};
  --glow-color: color-mix(in srgb, ${theme.colors.dark.primary} 5%, transparent);

  /* Shadcn UI specifics */
  --destructive-val: ${theme.colors.dark.destructive};
  --destructive-foreground-val: ${theme.colors.dark.destructiveForeground};
  --chart-1: oklch(0.488 0 0);
  --chart-2: oklch(0.696 0 0);
  --chart-3: oklch(0.769 0 0);
  --chart-4: oklch(0.627 0 0);
  --chart-5: oklch(0.645 0 0);
}

@custom-variant dark (&:is(.dark *));

@theme {
  /* Typography */
  --font-sans: var(--font-${(theme.fontSans || "inter").toLowerCase().replace(/\s+/g, '-')}), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-${(theme.fontDisplay || "space-grotesk").toLowerCase().replace(/\s+/g, '-')}), sans-serif;

  /* Semantic Colors - Base Palettes */
  --color-background: var(--bg-primary);
  --color-surface: var(--bg-secondary);
  --color-brand: var(--accent-color-val);
  --color-fracture: color-mix(
    in srgb,
    var(--accent-color-val) 10%,
    transparent
  );

  /* Semantic Colors - Contextual text & borders */
  --color-content-primary: var(--text-primary-val);
  --color-content-secondary: var(--text-secondary-val);
  --color-content-tertiary: var(--text-tertiary-val);
  --color-border: var(--border-color-val);

  /* Shadcn UI Semantic Mapping */
  --color-foreground: var(--text-primary-val);
  --color-card: var(--bg-secondary);
  --color-card-foreground: var(--text-primary-val);
  --color-popover: var(--bg-secondary);
  --color-popover-foreground: var(--text-primary-val);
  --color-primary: var(--accent-color-val);
  --color-primary-foreground: #ffffff;
  --color-secondary: var(--bg-secondary);
  --color-secondary-foreground: var(--text-primary-val);
  --color-muted: var(--bg-secondary);
  --color-muted-foreground: var(--text-secondary-val);
  --color-accent: var(--bg-secondary);
  --color-accent-foreground: var(--text-primary-val);
  --color-destructive: var(--destructive-val);
  --color-destructive-foreground: var(--destructive-foreground-val);
  --color-input: var(--bg-secondary);
  --color-ring: var(--accent-color-val);

  /* Border Radii */
  --radius-sm: ${theme.radius === '0rem' ? '0rem' : 'calc(' + theme.radius + ' - 4px)'};
  --radius-default: ${theme.radius};
  --radius-md: ${theme.radius === '0rem' ? '0rem' : 'calc(' + theme.radius + ' - 2px)'};
  --radius-lg: ${theme.radius};
  --radius-full: 9999px;
  --radius: ${theme.radius};

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;

  /* Z-Indices */
  --z-base: 10;
  --z-nav: 50;
  --z-dropdown: 60;
  --z-modal: 100;
}
`;
}
