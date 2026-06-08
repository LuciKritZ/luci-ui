import mongoose, { Document, Schema } from "mongoose";

import { Artifact } from "@/types/index.types";
import { clearModelIfLocal } from "@/utils/db.utils";

export interface IProject extends Document {
  artifacts: Artifact[];
  createdAt: number;
  description: string;
  lastEdited: number;
  name: string;
  theme: string;
  updatedAt: number;
  userId: mongoose.Types.ObjectId;
  versions: string[];
}

const ProjectSchema: Schema = new Schema(
  {
    artifacts: { default: [], type: [Schema.Types.Mixed] },
    createdAt: { required: true, type: Number },
    description: { required: true, type: String },
    lastEdited: { required: true, type: Number },
    name: { required: true, type: String },
    theme: { required: true, type: String },
    updatedAt: { required: true, type: Number },
    userId: { ref: "User", required: true, type: Schema.Types.ObjectId },
    versions: { default: [], type: [String] },
  },
  {
    timestamps: false, // We handle them manually via createdAt/updatedAt
  }
);

// Add transformation to rename _id to id and remove __v
ProjectSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    const r = ret as Record<string, unknown> & {
      __v?: number;
      _id?: { toString: () => string };
      id?: string;
      password?: string;
    };

    if (r._id) {
      r.id = r._id.toString();
      delete r._id;
    }

    delete r.password;
    delete r.__v;

    return r;
  },
});

// Use the centralized helper to handle hot reloading in local environment
clearModelIfLocal("Project");

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
