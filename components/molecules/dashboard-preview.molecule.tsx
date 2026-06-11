"use client";

import {
  ActivityIcon,
  BarChart3Icon,
  BellIcon,
  FileTextIcon,
  FolderIcon,
  GitBranchIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  LogOutIcon,
  MoonIcon,
  MoreVerticalIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  TrendingUpIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/atoms/badge.atom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card.atom";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/index.atoms";
import { Input } from "@/components/atoms/input.atom";
import { Toaster } from "@/components/atoms/sonner.atom";
import { MultiSelect } from "@/components/molecules/multi-select.molecule";
import { DataTable } from "@/components/organisms/datatable/datatable.organism";
import { IDesignTheme } from "@/contexts/design.context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardPreviewProps {
  initialMode?: "dark" | "light";
  theme: IDesignTheme | null;
}

type PreviewTab = "charts" | "components" | "data" | "outline";

// ─── Color Utilities ──────────────────────────────────────────────────────────

function deriveChartPalette(colors: Record<string, string>): string[] {
  return [
    colors.primary,
    colors.accent,
    colors.secondary !== colors.background
      ? colors.secondary
      : mixHex(colors.primary, colors.accent, 0.5),
    mixHex(colors.primary, colors.background, 0.4),
    colors.mutedForeground,
    mixHex(colors.accent, colors.background, 0.35),
  ];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map(c => c + c)
          .join("")
      : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function mixHex(a: string, b: string, t: number): string {
  try {
    const [ar, ag, ab] = hexToRgb(a);
    const [br, bg, bb] = hexToRgb(b);
    return `#${[
      Math.round(ar + (br - ar) * t),
      Math.round(ag + (bg - ag) * t),
      Math.round(ab + (bb - ab) * t),
    ]
      .map(v => v.toString(16).padStart(2, "0"))
      .join("")}`;
  } catch {
    return a;
  }
}

// ─── Default Tokens ───────────────────────────────────────────────────────────

const defaultDark = {
  accent: "#3b82f6",
  background: "#09090b",
  border: "#27272a",
  card: "#09090b",
  cardForeground: "#fafafa",
  content: "#fafafa",
  destructive: "#ef4444",
  destructiveForeground: "#fafafa",
  input: "#27272a",
  muted: "#27272a",
  mutedForeground: "#a1a1aa",
  popover: "#09090b",
  popoverForeground: "#fafafa",
  primary: "#fafafa",
  primaryForeground: "#18181b",
  ring: "#d4d4d8",
  secondary: "#27272a",
  secondaryForeground: "#fafafa",
  sidebarActive: "#27272a",
  sidebarActiveForeground: "#fafafa",
  surface: "#18181b",
};

const defaultLight = {
  accent: "#3b82f6",
  background: "#ffffff",
  border: "#e4e4e7",
  card: "#ffffff",
  cardForeground: "#09090b",
  content: "#09090b",
  destructive: "#ef4444",
  destructiveForeground: "#fafafa",
  input: "#e4e4e7",
  muted: "#f4f4f5",
  mutedForeground: "#71717a",
  popover: "#ffffff",
  popoverForeground: "#09090b",
  primary: "#18181b",
  primaryForeground: "#fafafa",
  ring: "#a1a1aa",
  secondary: "#f4f4f5",
  secondaryForeground: "#18181b",
  sidebarActive: "#e4e4e7",
  sidebarActiveForeground: "#09090b",
  surface: "#f9fafb",
};

// ─── Static Chart Data ────────────────────────────────────────────────────────

const areaData = [
  { month: "Jan", revenue: 4200, users: 2400 },
  { month: "Feb", revenue: 5800, users: 3100 },
  { month: "Mar", revenue: 4900, users: 2800 },
  { month: "Apr", revenue: 7200, users: 4200 },
  { month: "May", revenue: 6100, users: 3800 },
  { month: "Jun", revenue: 8900, users: 5100 },
  { month: "Jul", revenue: 7600, users: 4600 },
  { month: "Aug", revenue: 9400, users: 5800 },
];
const barData = [
  { name: "Mon", value: 320 },
  { name: "Tue", value: 480 },
  { name: "Wed", value: 290 },
  { name: "Thu", value: 610 },
  { name: "Fri", value: 520 },
  { name: "Sat", value: 180 },
  { name: "Sun", value: 240 },
];
const lineData = [
  { a: 40, b: 24, week: "W1" },
  { a: 55, b: 38, week: "W2" },
  { a: 47, b: 42, week: "W3" },
  { a: 70, b: 55, week: "W4" },
  { a: 63, b: 61, week: "W5" },
  { a: 85, b: 70, week: "W6" },
];
const pieData = [
  { name: "Organic", value: 38 },
  { name: "Paid", value: 27 },
  { name: "Referral", value: 20 },
  { name: "Direct", value: 15 },
];
const radarData = [
  { A: 85, subject: "Design" },
  { A: 92, subject: "Dev" },
  { A: 68, subject: "Marketing" },
  { A: 74, subject: "Sales" },
  { A: 88, subject: "Support" },
  { A: 79, subject: "Analytics" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function DashboardPreview({
  initialMode = "dark",
  theme,
}: DashboardPreviewProps) {
  const [localMode, setLocalMode] = React.useState(initialMode);
  const [activeTab, setActiveTab] = React.useState<PreviewTab>("outline");
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setLocalMode(initialMode);
  }, [initialMode]);

  const isDark = localMode === "dark";
  const baseThemeColors = theme?.colors?.dark || theme?.colors?.light;
  const colors = theme?.colors?.[localMode] || {
    ...(isDark ? defaultDark : defaultLight),
    accent:
      baseThemeColors?.accent ||
      (isDark ? defaultDark.accent : defaultLight.accent),
    primary:
      baseThemeColors?.primary ||
      (isDark ? defaultDark.primary : defaultLight.primary),
  };

  const chartPalette = deriveChartPalette(colors);

  const baseSpacing = parseInt(theme?.spacing?.base || "4px");
  const sp = {
    lg: `${baseSpacing * 6}px`,
    md: `${baseSpacing * 4}px`,
    sm: `${baseSpacing * 2}px`,
    xl: `${baseSpacing * 8}px`,
    xs: `${baseSpacing}px`,
  };

  const style = {
    "--accent": colors.accent,
    "--accent-foreground": colors.primaryForeground,
    "--background": colors.background,
    "--border": colors.border,
    "--card": colors.card,
    "--card-foreground": colors.cardForeground,
    // Tailwind v4 --color-* mappings for standard utility classes
    "--color-accent": colors.accent,
    "--color-accent-foreground": colors.primaryForeground,
    "--color-background": colors.background,
    "--color-border": colors.border,
    "--color-card": colors.card,
    "--color-card-foreground": colors.cardForeground,
    "--color-destructive": colors.destructive,
    "--color-destructive-foreground": colors.destructiveForeground,
    "--color-foreground": colors.content,
    "--color-input": colors.input,
    "--color-muted": colors.muted,
    "--color-muted-foreground": colors.mutedForeground,
    "--color-popover": colors.popover,
    "--color-popover-foreground": colors.popoverForeground,
    "--color-primary": colors.primary,
    "--color-primary-foreground": colors.primaryForeground,
    "--color-ring": colors.ring,
    "--color-secondary": colors.secondary,
    "--color-secondary-foreground": colors.secondaryForeground,
    "--destructive": colors.destructive,
    "--destructive-foreground": colors.destructiveForeground,
    "--foreground": colors.content,
    "--input": colors.input,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--popover": colors.popover,
    "--popover-foreground": colors.popoverForeground,
    "--preview-accent": colors.accent,
    "--preview-bg": colors.background,
    "--preview-border": colors.border,
    "--preview-card": colors.card,
    "--preview-card-foreground": colors.cardForeground,
    "--preview-content": colors.content,
    "--preview-destructive": colors.destructive,
    "--preview-destructive-foreground": colors.destructiveForeground,
    "--preview-font-display": theme?.fontDisplay || "Space Grotesk",
    "--preview-font-sans": theme?.fontSans || "Inter",
    "--preview-input": colors.input,
    "--preview-muted": colors.muted,
    "--preview-muted-foreground": colors.mutedForeground,
    "--preview-popover": colors.popover,
    "--preview-popover-foreground": colors.popoverForeground,
    "--preview-primary": colors.primary,

    "--preview-primary-foreground": colors.primaryForeground,
    "--preview-radius": theme?.radius || "0px",
    "--preview-ring": colors.ring,
    "--preview-secondary": colors.secondary,
    "--preview-secondary-foreground": colors.secondaryForeground,
    "--preview-sidebar-active": colors.sidebarActive,
    "--preview-sidebar-active-foreground": colors.sidebarActiveForeground,
    "--preview-space-lg": sp.lg,
    "--preview-space-md": sp.md,
    "--preview-space-sm": sp.sm,
    "--preview-space-xl": sp.xl,
    "--preview-space-xs": sp.xs,
    "--preview-surface": colors.surface,
    // Shadcn passthrough
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--radius": theme?.radius || "0px",
    "--ring": colors.ring,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,

    transition: theme?.animation === "minimal" ? "none" : "all 0.5s ease",
  } as React.CSSProperties;

  const fontsToLoad = Array.from(
    new Set([theme?.fontDisplay || "Space Grotesk", theme?.fontSans || "Inter"])
  );
  const fontsQuery = fontsToLoad
    .map(f => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700;900`)
    .join("&");

  return (
    <>
      <link href='https://fonts.googleapis.com' rel='preconnect' />
      <link
        crossOrigin='anonymous'
        href='https://fonts.gstatic.com'
        rel='preconnect'
      />
      <link
        href={`https://fonts.googleapis.com/css2?${fontsQuery}&display=swap`}
        rel='stylesheet'
      />

      <div
        className='w-full aspect-[16/10] bg-(--preview-bg) text-(--preview-content) overflow-hidden flex font-(--preview-font-sans) border border-(--preview-border) rounded-(--preview-radius) shadow-2xl relative'
        style={style}
      >
        {/* ── Sidebar ── */}
        <aside className='w-[200px] border-r border-(--preview-border) bg-(--preview-surface) flex flex-col p-(--preview-space-md) shrink-0'>
          <div className='flex items-center gap-2 mb-(--preview-space-xl)'>
            <div className='w-8 h-8 rounded-lg bg-(--preview-primary) flex items-center justify-center text-(--preview-primary-foreground) font-bold text-xs shrink-0'>
              A
            </div>
            <span className='font-bold text-xs truncate'>ACME INC.</span>
            <LayoutGridIcon className='w-3 h-3 ml-auto text-(--preview-muted-foreground)' />
          </div>
          <nav className='space-y-1 flex-1 overflow-y-auto pr-1 preview-scrollbar'>
            <NavItem
              active
              icon={<LayoutDashboardIcon className='w-3.5 h-3.5' />}
              label='Dashboard'
            />
            <NavItem
              icon={<UsersIcon className='w-3.5 h-3.5' />}
              label='Lifecycle'
            />
            <NavItem
              icon={<BarChart3Icon className='w-3.5 h-3.5' />}
              label='Analytics'
            />
            <NavItem
              icon={<FolderIcon className='w-3.5 h-3.5' />}
              label='Projects'
            />
            <NavItem icon={<UserIcon className='w-3.5 h-3.5' />} label='Team' />
          </nav>
          <div className='mt-auto space-y-1 border-t border-(--preview-border) pt-(--preview-space-md)'>
            <NavItem
              icon={<SettingsIcon className='w-3.5 h-3.5' />}
              label='Settings'
            />
            <NavItem
              icon={<SearchIcon className='w-3.5 h-3.5' />}
              label='Search'
            />
          </div>
        </aside>

        {/* ── Main ── */}
        <main className='flex-1 flex flex-col overflow-hidden'>
          {/* Header */}
          <header className='h-14 border-b border-(--preview-border) flex items-center justify-between px-(--preview-space-xl) shrink-0 relative'>
            <div className='flex items-center gap-4'>
              {/* Hamburger — triggers dropdown menu */}
              <div className='relative'>
                <button
                  className='w-7 h-7 flex items-center justify-center rounded-(--preview-radius) hover:bg-(--preview-muted) transition-colors text-(--preview-muted-foreground) hover:text-(--preview-content)'
                  onClick={() => setMenuOpen(v => !v)}
                >
                  <PanelLeftOpenIcon className='w-4 h-4' />
                </button>
                {menuOpen && <CommandMenu onClose={() => setMenuOpen(false)} />}
              </div>
              <h1 className='text-sm font-(--preview-font-display) font-bold tracking-tight'>
                DOCUMENTS
              </h1>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-[10px] text-(--preview-muted-foreground) bg-(--preview-surface) px-2 py-1 border border-(--preview-border) rounded-(--preview-radius) font-medium'>
                GitHub
              </span>
              <button
                className='w-7 h-7 flex items-center justify-center rounded-(--preview-radius) hover:bg-(--preview-muted) transition-colors text-(--preview-muted-foreground) hover:text-(--preview-content)'
                onClick={() => setLocalMode(isDark ? "light" : "dark")}
              >
                {isDark ? (
                  <SunIcon className='w-4 h-4' />
                ) : (
                  <MoonIcon className='w-4 h-4' />
                )}
              </button>
            </div>
          </header>

          {/* Scrollable Body */}
          <div
            className='flex-1 overflow-y-auto p-(--preview-space-xl) preview-scrollbar'
            onClick={() => menuOpen && setMenuOpen(false)}
          >
            {/* Stat Cards */}
            <div className='grid grid-cols-4 gap-(--preview-space-md) mb-(--preview-space-xl)'>
              <StatCard
                icon={<TrendingUpIcon className='w-3 h-3' />}
                label='Total Revenue'
                trend='+12.5%'
                value='$1,250.00'
              />
              <StatCard
                icon={<UsersIcon className='w-3 h-3' />}
                label='New Customers'
                trend='-20%'
                value='1,234'
              />
              <StatCard
                icon={<ActivityIcon className='w-3 h-3' />}
                label='Active Accounts'
                trend='+12.5%'
                value='45,678'
              />
              <StatCard
                icon={<ZapIcon className='w-3 h-3' />}
                label='Growth Rate'
                trend='+4.5%'
                value='4.5%'
              />
            </div>

            {/* Tab Bar */}
            <div className='flex gap-0 border-b border-(--preview-border) mb-(--preview-space-xl)'>
              {(
                ["outline", "components", "charts", "data"] as PreviewTab[]
              ).map(tab => (
                <button
                  className={`text-[10px] font-bold py-2 px-3 uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                    activeTab === tab
                      ? "border-(--preview-primary) text-(--preview-content)"
                      : "border-transparent text-(--preview-muted-foreground) hover:text-(--preview-content)"
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "outline" && <OutlineTab />}
            {activeTab === "components" && <ComponentsTab />}
            {activeTab === "charts" && (
              <ChartsTab colors={colors} palette={chartPalette} />
            )}
            {activeTab === "data" && <DataTab />}
          </div>
        </main>

        <style jsx>{`
          .preview-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .preview-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .preview-scrollbar::-webkit-scrollbar-thumb {
            background: var(--preview-border);
            border-radius: 10px;
          }
          .preview-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--preview-muted-foreground);
          }
          .preview-select {
            appearance: none;
            -webkit-appearance: none;
            background-color: var(--preview-input);
            color: var(--preview-content);
            border: 1px solid var(--preview-border);
            border-radius: var(--preview-radius);
            padding: 0 28px 0 8px;
            height: 32px;
            font-size: 11px;
            font-family: var(--preview-font-sans);
            width: 100%;
            outline: none;
            cursor: pointer;
          }
          .preview-select:focus {
            border-color: var(--preview-ring);
            box-shadow: 0 0 0 2px
              color-mix(in srgb, var(--preview-ring) 30%, transparent);
          }
          .preview-select option {
            background-color: var(--preview-popover);
            color: var(--preview-popover-foreground);
          }
          .preview-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            min-width: 14px;
            border: 1.5px solid var(--preview-border);
            border-radius: calc(var(--preview-radius) * 0.5);
            background: transparent !important;
            color: transparent;
            margin: 0;
            padding: 0;
            cursor: pointer;
            position: relative;
            transition: all 0.15s ease;
          }
          .preview-checkbox:checked {
            background: var(--preview-primary) !important;
            border-color: var(--preview-primary);
          }
          .preview-checkbox:checked::after {
            content: "";
            position: absolute;
            left: 3px;
            top: 1px;
            width: 5px;
            height: 8px;
            border: 1.5px solid var(--preview-primary-foreground);
            border-top: none;
            border-left: none;
            transform: rotate(45deg);
          }
          .preview-checkbox:focus {
            outline: none;
            box-shadow: 0 0 0 2px
              color-mix(in srgb, var(--preview-ring) 40%, transparent);
          }
        `}</style>
        <Toaster />
      </div>
    </>
  );
}

// ─── Command Menu (hamburger dropdown) ───────────────────────────────────────

function ChartCard({
  children,
  subtitle,
  title,
}: {
  children: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <div className='p-3 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-card)/60 space-y-2'>
      <div>
        <p className='text-[10px] font-bold text-(--preview-content)'>
          {title}
        </p>
        <p className='text-[8px] text-(--preview-muted-foreground)'>
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────

function ChartLegend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className='flex gap-3 mt-1'>
      {items.map(item => (
        <div className='flex items-center gap-1' key={item.label}>
          <span
            className='w-2 h-[2px] rounded-full inline-block'
            style={{ backgroundColor: item.color }}
          />
          <span className='text-[8px] text-(--preview-muted-foreground)'>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function ChartsTab({
  colors,
  palette,
}: {
  colors: Record<string, string>;
  palette: string[];
}) {
  const tooltipStyle = {
    backgroundColor: colors.popover,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    color: colors.content,
    fontSize: "10px",
    padding: "6px 10px",
  };

  return (
    <div className='space-y-4 animate-in fade-in duration-300'>
      <div className='grid grid-cols-2 gap-4'>
        <ChartCard subtitle='Last 8 months · Area' title='Revenue vs Users'>
          <ResponsiveContainer height={110} width='100%'>
            <AreaChart
              data={areaData}
              margin={{ bottom: 0, left: -28, right: 4, top: 4 }}
            >
              <defs>
                <linearGradient id='gA' x1='0' x2='0' y1='0' y2='1'>
                  <stop offset='5%' stopColor={palette[0]} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={palette[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id='gB' x1='0' x2='0' y1='0' y2='1'>
                  <stop offset='5%' stopColor={palette[1]} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={palette[1]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke={colors.border}
                strokeDasharray='3 3'
                strokeOpacity={0.5}
              />
              <XAxis
                axisLine={false}
                dataKey='month'
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                dataKey='revenue'
                dot={false}
                fill='url(#gA)'
                stroke={palette[0]}
                strokeWidth={1.5}
                type='monotone'
              />
              <Area
                dataKey='users'
                dot={false}
                fill='url(#gB)'
                stroke={palette[1]}
                strokeWidth={1.5}
                type='monotone'
              />
            </AreaChart>
          </ResponsiveContainer>
          <ChartLegend
            items={[
              { color: palette[0], label: "Revenue" },
              { color: palette[1], label: "Users" },
            ]}
          />
        </ChartCard>

        <ChartCard subtitle='This week · Bar' title='Daily Sessions'>
          <ResponsiveContainer height={110} width='100%'>
            <BarChart
              data={barData}
              margin={{ bottom: 0, left: -28, right: 4, top: 4 }}
            >
              <CartesianGrid
                stroke={colors.border}
                strokeDasharray='3 3'
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey='name'
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: `${palette[0]}15` }}
              />
              <Bar
                dataKey='value'
                fill={palette[0]}
                maxBarSize={28}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <ChartCard subtitle='6 weeks · Line' title='A/B Performance'>
          <ResponsiveContainer height={100} width='100%'>
            <LineChart
              data={lineData}
              margin={{ bottom: 0, left: -28, right: 4, top: 4 }}
            >
              <CartesianGrid
                stroke={colors.border}
                strokeDasharray='3 3'
                strokeOpacity={0.5}
              />
              <XAxis
                axisLine={false}
                dataKey='week'
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: colors.mutedForeground, fontSize: 8 }}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                dataKey='a'
                dot={false}
                stroke={palette[0]}
                strokeWidth={1.5}
                type='monotone'
              />
              <Line
                dataKey='b'
                dot={false}
                stroke={palette[1]}
                strokeDasharray='4 2'
                strokeWidth={1.5}
                type='monotone'
              />
            </LineChart>
          </ResponsiveContainer>
          <ChartLegend
            items={[
              { color: palette[0], label: "Variant A" },
              { color: palette[1], label: "Variant B" },
            ]}
          />
        </ChartCard>

        <ChartCard subtitle='Current period · Donut' title='Traffic Sources'>
          <div className='flex items-center gap-3'>
            <ResponsiveContainer height={90} width={90}>
              <PieChart>
                <Pie
                  cx='50%'
                  cy='50%'
                  data={pieData}
                  dataKey='value'
                  innerRadius={25}
                  outerRadius={42}
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell fill={palette[i % palette.length]} key={i} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className='space-y-1.5 flex-1'>
              {pieData.map((entry, i) => (
                <div
                  className='flex items-center justify-between'
                  key={entry.name}
                >
                  <div className='flex items-center gap-1.5'>
                    <span
                      className='w-1.5 h-1.5 rounded-full shrink-0'
                      style={{ backgroundColor: palette[i % palette.length] }}
                    />
                    <span className='text-[8px] text-(--preview-muted-foreground)'>
                      {entry.name}
                    </span>
                  </div>
                  <span className='text-[8px] font-bold text-(--preview-content)'>
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard subtitle='By department · Radar' title='Team Performance'>
          <ResponsiveContainer height={100} width='100%'>
            <RadarChart
              data={radarData}
              margin={{ bottom: 4, left: 12, right: 12, top: 4 }}
            >
              <PolarGrid stroke={colors.border} strokeOpacity={0.6} />
              <PolarAngleAxis
                dataKey='subject'
                tick={{ fill: colors.mutedForeground, fontSize: 7 }}
              />
              <Radar
                dataKey='A'
                dot={false}
                fill={palette[0]}
                fillOpacity={0.15}
                stroke={palette[0]}
                strokeWidth={1.5}
              />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className='grid grid-cols-4 gap-3'>
        {[
          {
            data: [20, 35, 28, 45, 38, 52, 48, 61],
            delta: "+0.4%",
            label: "Conversion",
            value: "3.24%",
          },
          {
            data: [55, 42, 60, 38, 65, 50, 70, 58],
            delta: "+18s",
            label: "Avg. Session",
            value: "4m 12s",
          },
          {
            data: [60, 55, 58, 50, 48, 45, 42, 40],
            delta: "-2.1%",
            label: "Bounce Rate",
            value: "42.1%",
          },
          {
            data: [30, 38, 35, 45, 40, 52, 48, 58],
            delta: "+0.7",
            label: "Pages/Visit",
            value: "5.8",
          },
        ].map((item, idx) => (
          <SparkCard
            key={item.label}
            {...item}
            color={palette[idx % palette.length]}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Data Tab ─────────────────────────────────────────────────────────────────

function CommandMenu({ onClose }: { onClose: () => void }) {
  const groups = [
    {
      items: [
        {
          icon: <LayoutDashboardIcon className='w-3 h-3' />,
          label: "Dashboard",
          shortcut: "⌘D",
        },
        {
          icon: <BarChart3Icon className='w-3 h-3' />,
          label: "Analytics",
          shortcut: "⌘A",
        },
        {
          icon: <FolderIcon className='w-3 h-3' />,
          label: "Projects",
          shortcut: "⌘P",
        },
      ],
      label: "Navigation",
    },
    {
      items: [
        {
          icon: <FileTextIcon className='w-3 h-3' />,
          label: "New Document",
          shortcut: "⌘N",
        },
        {
          icon: <GitBranchIcon className='w-3 h-3' />,
          label: "View on GitHub",
          shortcut: null,
        },
        {
          icon: <BellIcon className='w-3 h-3' />,
          label: "Notifications",
          shortcut: null,
        },
      ],
      label: "Actions",
    },
    {
      items: [
        {
          icon: <HelpCircleIcon className='w-3 h-3' />,
          label: "Help & Support",
          shortcut: null,
        },
        {
          icon: <LogOutIcon className='w-3 h-3' />,
          label: "Sign Out",
          shortcut: null,
        },
      ],
      label: "Account",
    },
  ];

  return (
    <div
      className='absolute top-9 left-0 z-50 w-52 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-popover) shadow-xl overflow-hidden'
      onClick={e => e.stopPropagation()}
    >
      {/* Search bar inside menu */}
      <div className='flex items-center gap-2 px-3 py-2 border-b border-(--preview-border)'>
        <SearchIcon className='w-3 h-3 text-(--preview-muted-foreground) shrink-0' />
        <span className='text-[10px] text-(--preview-muted-foreground)'>
          Quick search...
        </span>
        <span className='ml-auto text-[8px] text-(--preview-muted-foreground) bg-(--preview-muted) px-1 py-0.5 rounded font-mono'>
          ⌘K
        </span>
      </div>

      <div className='py-1'>
        {groups.map((group, gi) => (
          <div key={group.label}>
            {gi > 0 && <div className='h-px bg-(--preview-border) my-1' />}
            <p className='text-[8px] font-bold uppercase tracking-widest text-(--preview-muted-foreground) px-3 py-1'>
              {group.label}
            </p>
            {group.items.map(item => (
              <button
                className='w-full flex items-center gap-2.5 px-3 py-1.5 text-[10px] text-(--preview-popover-foreground) hover:bg-(--preview-muted) transition-colors text-left'
                key={item.label}
                onClick={onClose}
              >
                <span className='text-(--preview-muted-foreground)'>
                  {item.icon}
                </span>
                <span className='flex-1'>{item.label}</span>
                {item.shortcut && (
                  <span className='text-[8px] text-(--preview-muted-foreground) font-mono'>
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Outline Tab ──────────────────────────────────────────────────────────────

function ComponentsTab() {
  const [selectVal, setSelectVal] = React.useState("option1");
  const [multiChecks, setMultiChecks] = React.useState({
    digest: true,
    notifs: true,
    updates: false,
  });

  return (
    <div className='space-y-5 animate-in fade-in duration-300'>
      {/* Buttons */}
      <Section title='Buttons'>
        <div className='flex flex-wrap gap-2'>
          <Button size='sm'>Primary</Button>
          <Button size='sm' variant='secondary'>
            Secondary
          </Button>
          <Button size='sm' variant='destructive'>
            Destructive
          </Button>
          <Button size='sm' variant='outline'>
            Outline
          </Button>
          <Button size='sm' variant='ghost'>
            Ghost
          </Button>
          <Button disabled size='sm'>
            Disabled
          </Button>
        </div>
      </Section>

      {/* Badges */}
      <Section title='Badges'>
        <div className='flex flex-wrap gap-2'>
          <Badge>Default</Badge>
          <Badge variant='secondary'>Secondary</Badge>
          <Badge variant='destructive'>Destructive</Badge>
          <Badge variant='outline'>Outline</Badge>
        </div>
      </Section>

      {/* Inputs + Select */}
      <Section title='Inputs & Select'>
        <div className='grid grid-cols-3 gap-3'>
          <Input
            className='text-xs h-8'
            placeholder='Email address'
            type='email'
          />
          <Input className='text-xs h-8' placeholder='Search...' />
          <Input className='text-xs h-8' disabled placeholder='Disabled' />
        </div>
        <div className='grid grid-cols-2 gap-3 mt-3'>
          <div className='relative'>
            <Select onValueChange={setSelectVal} value={selectVal}>
              <SelectTrigger className='h-8 text-xs bg-(--preview-input) border-(--preview-border) text-(--preview-content) [&>span]:truncate w-full'>
                <SelectValue placeholder='Select workspace...' />
              </SelectTrigger>
              <SelectContent className='bg-(--preview-popover) text-(--preview-popover-foreground) border-(--preview-border)'>
                <SelectItem className='text-xs' value='option1'>
                  Acme Inc. — Workspace
                </SelectItem>
                <SelectItem className='text-xs' value='option2'>
                  Personal Account
                </SelectItem>
                <SelectItem className='text-xs' value='option3'>
                  Open Source Org
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='relative'>
            <Select>
              <SelectTrigger className='h-8 text-xs bg-(--preview-input) border-(--preview-border) text-(--preview-content) [&>span]:truncate w-full'>
                <SelectValue placeholder='Select a role...' />
              </SelectTrigger>
              <SelectContent className='bg-(--preview-popover) text-(--preview-popover-foreground) border-(--preview-border)'>
                <SelectItem className='text-xs' value='admin'>
                  Admin
                </SelectItem>
                <SelectItem className='text-xs' value='editor'>
                  Editor
                </SelectItem>
                <SelectItem className='text-xs' value='viewer'>
                  Viewer
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Multi-Select */}
      <Section title='Multi-Select Search'>
        <MultiSelect
          className='bg-(--preview-input) border-(--preview-border) text-(--preview-content)'
          onChange={() => {}}
          options={[
            { label: "React", value: "react" },
            { label: "Next.js", value: "next" },
            { label: "Tailwind CSS", value: "tailwind" },
            { label: "Shadcn UI", value: "shadcn" },
            { label: "TypeScript", value: "ts" },
          ]}
          selected={["react", "tailwind"]}
        />
      </Section>

      {/* Checkboxes */}
      <Section title='Checkboxes & Toggles'>
        <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
          {[
            { key: "notifs", label: "Email notifications" },
            { key: "updates", label: "Product updates" },
            { key: "digest", label: "Weekly digest" },
          ].map(item => (
            <label
              className='flex items-center gap-2.5 cursor-pointer group'
              key={item.key}
            >
              <input
                checked={!!multiChecks[item.key as keyof typeof multiChecks]}
                className='preview-checkbox'
                onChange={() =>
                  setMultiChecks(c => ({
                    ...c,
                    [item.key]: !c[item.key as keyof typeof multiChecks],
                  }))
                }
                type='checkbox'
              />
              <span className='text-[10px] text-(--preview-content) group-hover:text-(--preview-primary) transition-colors'>
                {item.label}
              </span>
            </label>
          ))}
          {/* Radio group */}
          {["Free", "Pro", "Enterprise"].map(plan => (
            <label
              className='flex items-center gap-2.5 cursor-pointer'
              key={plan}
            >
              <input
                className='preview-checkbox'
                name='plan'
                style={{ borderRadius: "50%" }}
                type='radio'
              />
              <span className='text-[10px] text-(--preview-content)'>
                {plan} Plan
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Card + Toast */}
      <Section title='Cards & Notifications'>
        <div className='grid grid-cols-2 gap-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm'>Revenue Summary</CardTitle>
              <CardDescription className='text-xs'>
                Compared to last month
              </CardDescription>
            </CardHeader>
            <CardContent className='pb-2'>
              <p className='text-2xl font-bold font-(--preview-font-display)'>
                $48,295
              </p>
              <p className='text-xs text-green-500 mt-1'>
                ↑ 12.5% from last period
              </p>
            </CardContent>
            <CardFooter>
              <Button className='w-full text-xs h-7' size='sm'>
                View Report
              </Button>
            </CardFooter>
          </Card>

          <div className='flex flex-col gap-2 p-4 border border-(--preview-border) rounded-(--preview-radius) bg-(--preview-surface)/50 justify-center'>
            <p className='text-xs font-semibold text-(--preview-content)'>
              Toast Variants
            </p>
            <Button
              className='text-xs h-7'
              onClick={() => toast.success("Changes saved successfully")}
              size='sm'
              variant='outline'
            >
              Success Toast
            </Button>
            <Button
              className='text-xs h-7'
              onClick={() =>
                toast.error("Something went wrong", {
                  description: "Please try again.",
                })
              }
              size='sm'
              variant='outline'
            >
              Error Toast
            </Button>
          </div>
        </div>
      </Section>

      {/* Typography */}
      <Section title='Typography Scale'>
        <div className='space-y-1 p-3 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-card)/40'>
          <p className='font-(--preview-font-display) font-black text-xl text-(--preview-content) leading-tight'>
            Display — Aa Bb Cc 123
          </p>
          <p className='font-(--preview-font-sans) font-semibold text-sm text-(--preview-content)'>
            Heading — Aa Bb Cc 123
          </p>
          <p className='font-(--preview-font-sans) text-xs text-(--preview-content)'>
            Body — The quick brown fox jumps over the lazy dog.
          </p>
          <p className='font-(--preview-font-sans) text-[10px] text-(--preview-muted-foreground)'>
            Caption — Secondary information and metadata appear here.
          </p>
          <p className='font-(--preview-font-sans) text-[9px] text-(--preview-muted-foreground) font-mono'>
            Mono — 0x3A4F · #preview-border · 12px
          </p>
        </div>
      </Section>

      {/* Progress + Status */}
      <Section title='Progress & Status'>
        <div className='space-y-2'>
          {[
            { color: "var(--preview-primary)", label: "Storage", value: 72 },
            { color: "var(--preview-accent)", label: "Bandwidth", value: 45 },
            {
              color: "var(--preview-destructive)",
              label: "API Usage",
              value: 91,
            },
          ].map(item => (
            <div className='flex items-center gap-3' key={item.label}>
              <span className='text-[9px] text-(--preview-muted-foreground) w-16 shrink-0'>
                {item.label}
              </span>
              <div className='flex-1 h-1.5 rounded-full bg-(--preview-muted) overflow-hidden'>
                <div
                  className='h-full rounded-full transition-all'
                  style={{
                    backgroundColor: item.color,
                    width: `${item.value}%`,
                  }}
                />
              </div>
              <span className='text-[9px] text-(--preview-content) font-bold w-7 text-right'>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Components Tab ───────────────────────────────────────────────────────────

function DataTab() {
  const [loading] = React.useState(false);
  const [data] = React.useState([
    {
      email: "john@example.com",
      id: "1",
      name: "John Doe",
      role: "Admin",
      status: "Active",
    },
    {
      email: "jane@example.com",
      id: "2",
      name: "Jane Smith",
      role: "Editor",
      status: "Active",
    },
    {
      email: "bob@example.com",
      id: "3",
      name: "Bob Johnson",
      role: "Viewer",
      status: "Inactive",
    },
    {
      email: "alice@example.com",
      id: "4",
      name: "Alice Williams",
      role: "Editor",
      status: "Active",
    },
    {
      email: "charlie@example.com",
      id: "5",
      name: "Charlie Brown",
      role: "Viewer",
      status: "Pending",
    },
  ]);

  type RowData = {
    email: string;
    id: string;
    name: string;
    role: string;
    status: string;
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      cell: ({ row }: { row: { original: RowData } }) => (
        <Badge variant='outline'>{row.original.role}</Badge>
      ),
      header: "Role",
    },
    {
      accessorKey: "status",
      cell: ({ row }: { row: { original: RowData } }) => {
        const s = row.original.status;
        return (
          <Badge
            variant={
              s === "Active"
                ? "default"
                : s === "Inactive"
                  ? "destructive"
                  : "secondary"
            }
          >
            {s}
          </Badge>
        );
      },
      header: "Status",
    },
  ];

  return (
    <div className='space-y-4 animate-in fade-in duration-300'>
      <Section title='User Management'>
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          renderGridCard={(item: RowData) => (
            <Card className='p-3 border-(--preview-border) bg-(--preview-card)'>
              <div className='flex justify-between items-start gap-2'>
                <div className='min-w-0'>
                  <h4 className='text-sm font-semibold truncate'>
                    {item.name}
                  </h4>
                  <p className='text-xs text-muted-foreground truncate'>
                    {item.email}
                  </p>
                </div>
                <Badge
                  className='shrink-0 text-[10px] px-1.5 py-0'
                  variant={
                    item.status === "Active"
                      ? "default"
                      : item.status === "Inactive"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              <div className='mt-4'>
                <Badge className='text-[10px]' variant='outline'>
                  {item.role}
                </Badge>
              </div>
            </Card>
          )}
          searchKey='name'
          searchPlaceholder='Search users...'
          viewMode='list'
        />
      </Section>
    </div>
  );
}

// ─── Charts Tab ───────────────────────────────────────────────────────────────

function NavItem({
  active = false,
  icon,
  label,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-(--preview-radius) text-[10px] transition-colors cursor-pointer ${
        active
          ? "bg-(--preview-sidebar-active) text-(--preview-sidebar-active-foreground)"
          : "text-(--preview-muted-foreground) hover:bg-(--preview-secondary)/50 hover:text-(--preview-content)"
      }`}
    >
      {icon}
      <span className='font-bold uppercase tracking-tight'>{label}</span>
    </div>
  );
}

// ─── Chart helpers ────────────────────────────────────────────────────────────

function OutlineTab() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const rows = [
    { label: "Project Header", status: "In Process", type: "SECTION" },
    { label: "Cover page design", status: "Done", type: "COVER" },
    { label: "Executive summary draft", status: "Done", type: "NARRATIVE" },
    { label: "Financial projections", status: "In Process", type: "DATA" },
    { label: "Market analysis", status: "Pending", type: "SECTION" },
  ];

  return (
    <div className='space-y-2 animate-in fade-in duration-300'>
      {rows.map(row => (
        <div
          className='flex items-center justify-between p-2.5 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-card)/50 hover:bg-(--preview-card) transition-colors'
          key={row.label}
        >
          <div className='flex items-center gap-3'>
            <input
              checked={!!checked[row.label]}
              className='preview-checkbox'
              onChange={() =>
                setChecked(c => ({ ...c, [row.label]: !c[row.label] }))
              }
              type='checkbox'
            />
            <span
              className={`text-[10px] font-medium transition-colors ${checked[row.label] ? "line-through text-(--preview-muted-foreground)" : "text-(--preview-content)"}`}
            >
              {row.label}
            </span>
          </div>
          <div className='flex items-center gap-6'>
            <span className='text-[8px] text-(--preview-muted-foreground) uppercase font-bold tracking-wide'>
              {row.type}
            </span>
            <span
              className={`text-[8px] px-2 py-0.5 rounded-full border font-medium ${
                row.status === "Done"
                  ? "border-green-500/30 text-green-500 bg-green-500/5"
                  : row.status === "Pending"
                    ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                    : "border-orange-500/30 text-orange-500 bg-orange-500/5"
              }`}
            >
              {row.status}
            </span>
            <MoreVerticalIcon className='w-3 h-3 text-(--preview-muted-foreground)' />
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className='space-y-2'>
      <h3 className='text-[9px] font-bold uppercase tracking-widest text-(--preview-muted-foreground)'>
        {title}
      </h3>
      {children}
    </div>
  );
}

function SparkCard({
  color,
  data,
  delta,
  label,
  value,
}: {
  color: string;
  data: number[];
  delta: string;
  label: string;
  value: string;
}) {
  const max = Math.max(...data),
    min = Math.min(...data);
  const h = 28,
    w = 80;
  const pts = data
    .map(
      (d, i) =>
        `${(i / (data.length - 1)) * w},${h - ((d - min) / (max - min || 1)) * h}`
    )
    .join(" ");
  return (
    <div className='p-3 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-card)/60'>
      <p className='text-[8px] text-(--preview-muted-foreground) uppercase font-bold tracking-tight mb-1'>
        {label}
      </p>
      <p className='text-sm font-bold font-(--preview-font-display) text-(--preview-content)'>
        {value}
      </p>
      <div className='flex items-end justify-between mt-1'>
        <span
          className={`text-[8px] font-bold ${delta.startsWith("+") ? "text-green-500" : "text-red-500"}`}
        >
          {delta}
        </span>
        <svg
          className='overflow-visible'
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          width={w}
        >
          <polyline
            fill='none'
            points={pts}
            stroke={color}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  trend,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  trend: string;
  value: string;
}) {
  const isPositive = trend.startsWith("+");
  return (
    <div className='p-4 rounded-(--preview-radius) border border-(--preview-border) bg-(--preview-card)'>
      <div className='flex justify-between items-center mb-2'>
        <div className='flex items-center gap-1 text-(--preview-muted-foreground)'>
          {icon}
          <span className='text-[8px] uppercase font-bold tracking-tighter'>
            {label}
          </span>
        </div>
        <span
          className={`text-[8px] px-1 py-0.5 rounded-sm font-bold ${isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
        >
          {trend}
        </span>
      </div>
      <div className='text-lg font-(--preview-font-display) font-bold text-(--preview-card-foreground)'>
        {value}
      </div>
    </div>
  );
}
