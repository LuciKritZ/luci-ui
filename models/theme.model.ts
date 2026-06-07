import mongoose, { Document, Schema } from 'mongoose';

import { clearModelIfLocal } from '@/utils/db.utils';

export interface IDesignColors {
  accent: string;
  background: string;
  border: string;
  card: string;
  cardForeground: string;
  content: string;
  destructive: string;
  destructiveForeground: string;
  input: string;
  muted: string;
  mutedForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  ring: string;
  secondary: string;
  secondaryForeground: string;
  sidebarActive: string;
  sidebarActiveForeground: string;
  surface: string;
}

export interface IDesignTheme extends Document {
  animation: 'bouncy' | 'fluid' | 'minimal' | 'snappy';
  colors: {
    dark: IDesignColors;
    light: IDesignColors;
  };
  createdAt: Date;
  description?: string;
  fontDisplay: string;
  fontSans: string;
  name: string;
  radius: string;
  shadows: 'glow' | 'none' | 'sharp' | 'soft';
  spacing: {
    base: string;
    scale: 'comfortable' | 'compact' | 'loose';
  };
  userId: mongoose.Types.ObjectId;
}

const ColorsSchema = new Schema(
  {
    accent: { required: true, type: String },
    background: { required: true, type: String },
    border: { required: true, type: String },
    card: { required: true, type: String },
    cardForeground: { required: true, type: String },
    content: { required: true, type: String },
    destructive: { required: true, type: String },
    destructiveForeground: { required: true, type: String },
    input: { required: true, type: String },
    muted: { required: true, type: String },
    mutedForeground: { required: true, type: String },
    popover: { required: true, type: String },
    popoverForeground: { required: true, type: String },
    primary: { required: true, type: String },
    primaryForeground: { required: true, type: String },
    ring: { required: true, type: String },
    secondary: { required: true, type: String },
    secondaryForeground: { required: true, type: String },
    sidebarActive: { required: true, type: String },
    sidebarActiveForeground: { required: true, type: String },
    surface: { required: true, type: String },
  },
  { _id: false }
);

const ThemeSchema = new Schema(
  {
    animation: {
      default: 'fluid',
      enum: ['bouncy', 'fluid', 'minimal', 'snappy'],
      type: String,
    },
    colors: {
      dark: { required: true, type: ColorsSchema },
      light: { required: true, type: ColorsSchema },
    },
    description: { type: String },
    fontDisplay: { default: 'Space Grotesk', type: String },
    fontSans: { default: 'Inter', type: String },
    name: { required: true, type: String },
    radius: { default: '0px', type: String },
    shadows: {
      default: 'none',
      enum: ['glow', 'none', 'sharp', 'soft'],
      type: String,
    },
    spacing: {
      base: { default: '4px', type: String },
      scale: {
        default: 'comfortable',
        enum: ['comfortable', 'compact', 'loose'],
        type: String,
      },
    },
    userId: { ref: 'User', required: true, type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

ThemeSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as Record<string, unknown>;
    obj.id = (obj._id as { toString: () => string }).toString();
    delete obj._id;
    delete obj.__v;
    return obj;
  },
});

clearModelIfLocal('Theme');

export default mongoose.models.Theme ||
  mongoose.model<IDesignTheme>('Theme', ThemeSchema);
