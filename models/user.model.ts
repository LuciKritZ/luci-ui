import mongoose, { Document, Schema } from 'mongoose';

import { clearModelIfLocal } from '@/utils/db.utils';

export interface IApiKey {
  _id?: string;
  createdAt?: Date;
  encryptedKey: string;
  iv: string;
  meta?: { description?: string };
  priority: number;
  status: 'active' | 'exhausted';
}

export interface IUser extends Document {
  apiKeys: Map<string, IApiKey[]>;
  createdAt: Date;
  email: string;
  name?: string;
  password?: string;
  updatedAt: Date;
}

const ApiKeySchema = new Schema({
  createdAt: { default: Date.now, type: Date },
  encryptedKey: { required: true, type: String },
  iv: { required: true, type: String },
  meta: {
    description: { type: String },
  },
  priority: { default: 1, type: Number },
  status: { default: 'active', enum: ['active', 'exhausted'], type: String },
});

const UserSchema: Schema = new Schema(
  {
    apiKeys: {
      default: {},
      of: [ApiKeySchema],
      type: Map,
    },
    email: { required: true, type: String, unique: true },
    name: { type: String },
    password: { required: true, type: String },
  },
  {
    timestamps: true,
  }
);

// Add transformation to rename _id to id and remove sensitive fields
UserSchema.set('toJSON', {
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

    // We also remove the raw encrypted keys from the user object sent to client
    if (
      r.apiKeys &&
      typeof r.apiKeys === 'object' &&
      !(r.apiKeys instanceof Array)
    ) {
      const safeApiKeys: Record<
        string,
        Array<Omit<IApiKey, 'encryptedKey' | 'iv'> & { hasKey: boolean }>
      > = {};
      for (const [provider, keys] of Object.entries(
        r.apiKeys as Record<string, IApiKey[]>
      )) {
        if (Array.isArray(keys)) {
          safeApiKeys[provider] = keys.map((key: IApiKey) => ({
            _id: key._id,
            createdAt: key.createdAt,
            hasKey: true, // Only return a flag that the key exists
            meta: key.meta,
            priority: key.priority,
            status: key.status,
          }));
        }
      }
      r.apiKeys = safeApiKeys;
    }

    return r;
  },
});

// Use the centralized helper to handle hot reloading in local environment
clearModelIfLocal('User');

export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);
