import mongoose, { Schema } from "mongoose";

import { clearModelIfLocal } from "@/utils/db.utils";

export interface IActionDefinition {
  createdAt: Date;
  fallbackModel?: string;
  model: string;
  name: string;
  prompt: string;
  responseSchema?: string;
  updatedAt: Date;
}

const ActionDefinitionSchema: Schema = new Schema(
  {
    fallbackModel: { type: String },
    model: { required: true, type: String },
    name: { required: true, type: String, unique: true },
    prompt: { required: true, type: String },
    responseSchema: { type: String },
  },
  {
    timestamps: true,
  }
);

ActionDefinitionSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    const r = ret as Record<string, unknown> & {
      __v?: number;
      _id?: { toString: () => string };
      id?: string;
    };

    if (r._id) {
      r.id = r._id.toString();
      delete r._id;
    }
    delete r.__v;

    return r;
  },
});

clearModelIfLocal("ActionDefinition");

export default mongoose.models.ActionDefinition ||
  mongoose.model<IActionDefinition>("ActionDefinition", ActionDefinitionSchema);
