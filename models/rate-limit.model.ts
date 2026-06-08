import mongoose, { Document, Schema } from "mongoose";

import { clearModelIfLocal } from "@/utils/db.utils";

export interface IRateLimit extends Document {
  count: number;
  identifier: string;
  resetAt: Date;
}

const RateLimitSchema: Schema = new Schema(
  {
    count: { default: 0, type: Number },
    identifier: { required: true, type: String, unique: true },
    resetAt: { expires: 0, required: true, type: Date }, // TTL Index: Document expires at resetAt
  },
  {
    timestamps: true,
  }
);

clearModelIfLocal("RateLimit");

export default mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
