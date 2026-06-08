import { GoogleGenAI } from "@google/genai";

import ActionDefinition from "@/models/action-definition.model";
import { IApiKey, IUser } from "@/models/user.model";
import { decrypt } from "@/utils/encryption.utils";

export interface GenAIError extends Error {
  status?: number;
}

export function compilePrompt(
  template: string,
  variables: Record<string, string>
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || "");
}

export async function executeWithFallback<T>(
  user: IUser & { save: () => Promise<IUser> },
  generator: (genAI: GoogleGenAI, modelId: string) => Promise<T>,
  modelId: string,
  fallbackModelId?: string
): Promise<T> {
  let geminiKeys: IApiKey[] = [];
  if (user.apiKeys) {
    if (typeof user.apiKeys.forEach === "function") {
      user.apiKeys.forEach((val: IApiKey | IApiKey[]) => {
        if (Array.isArray(val)) {
          geminiKeys = geminiKeys.concat(val);
        } else if (val && typeof val === "object") {
          geminiKeys.push(val as IApiKey);
        }
      });
    } else {
      // Fallback for plain objects
      for (const val of Object.values(user.apiKeys)) {
        if (Array.isArray(val)) {
          geminiKeys = geminiKeys.concat(val);
        } else if (val && typeof val === "object") {
          geminiKeys.push(val as IApiKey);
        }
      }
    }
  }
  const activeKeys = geminiKeys
    .filter((k: IApiKey) => k.status === "active")
    .sort((a: IApiKey, b: IApiKey) => a.priority - b.priority);

  if (activeKeys.length === 0) {
    throw new Error(
      "No active Gemini API keys found. Please add or reset keys in settings."
    );
  }

  for (let i = 0; i < activeKeys.length; i++) {
    const keyObj = activeKeys[i];
    const apiKey = decrypt(keyObj.encryptedKey, keyObj.iv);
    const genAI = new GoogleGenAI({ apiKey });

    try {
      const result = await generator(genAI, modelId);

      // Increment usage count on success
      let allProviderKeys: IApiKey[] = [];
      if (typeof user.apiKeys.forEach === "function") {
        user.apiKeys.forEach((val: IApiKey | IApiKey[]) => {
          if (Array.isArray(val)) allProviderKeys = allProviderKeys.concat(val);
          else if (val && typeof val === "object") allProviderKeys.push(val);
        });
      } else {
        for (const val of Object.values(user.apiKeys)) {
          if (Array.isArray(val)) allProviderKeys = allProviderKeys.concat(val);
          else if (val && typeof val === "object") allProviderKeys.push(val);
        }
      }

      const keyIndex = allProviderKeys.findIndex(
        (k: IApiKey) => k._id?.toString() === keyObj._id?.toString()
      );

      if (keyIndex !== -1) {
        allProviderKeys[keyIndex].usageCount =
          (allProviderKeys[keyIndex].usageCount || 0) + 1;
        if (typeof user.apiKeys.clear === "function") {
          user.apiKeys.clear();
          user.apiKeys.set("gemini", allProviderKeys);
        } else {
          user.apiKeys = { gemini: allProviderKeys } as unknown as Map<
            string,
            IApiKey[]
          >;
        }
        await user.save();
      }

      return result;
    } catch (e: unknown) {
      const error = e as GenAIError;
      // Handle rate limits or quota errors
      if (error.status === 429 || error.message?.includes("429")) {
        console.error("Exact Google API Error:", error);
        console.warn(
          `Gemini API Key (Priority ${keyObj.priority}) hit rate limit/quota. Marking as exhausted.`
        );

        // Mark key as exhausted
        keyObj.status = "exhausted";

        // Update user in DB
        let exhaustedProviderKeys: IApiKey[] = [];
        if (typeof user.apiKeys.forEach === "function") {
          user.apiKeys.forEach((val: IApiKey | IApiKey[]) => {
            if (Array.isArray(val))
              exhaustedProviderKeys = exhaustedProviderKeys.concat(val);
            else if (val && typeof val === "object")
              exhaustedProviderKeys.push(val);
          });
        } else {
          for (const val of Object.values(user.apiKeys)) {
            if (Array.isArray(val))
              exhaustedProviderKeys = exhaustedProviderKeys.concat(val);
            else if (val && typeof val === "object")
              exhaustedProviderKeys.push(val);
          }
        }

        const exKeyIndex = exhaustedProviderKeys.findIndex(
          (k: IApiKey) => k._id?.toString() === keyObj._id?.toString()
        );

        if (exKeyIndex !== -1) {
          exhaustedProviderKeys[exKeyIndex].status = "exhausted";
          if (typeof user.apiKeys.clear === "function") {
            user.apiKeys.clear();
            user.apiKeys.set("gemini", exhaustedProviderKeys);
          } else {
            user.apiKeys = { gemini: exhaustedProviderKeys } as unknown as Map<
              string,
              IApiKey[]
            >;
          }
          await user.save();
        }

        if (i < activeKeys.length - 1) {
          console.log(
            `Falling back to next key (Priority ${activeKeys[i + 1].priority})`
          );
          continue;
        } else {
          throw new Error(
            "All Gemini API keys are exhausted. Please add new ones or wait for quota reset."
          );
        }
      }

      // If it's a 500 or 503, try the fallback model.
      if (fallbackModelId && (error.status === 503 || error.status === 500)) {
        console.warn(
          `Model ${modelId} failed. Trying fallback model ${fallbackModelId}...`
        );
        try {
          const fallbackResult = await generator(genAI, fallbackModelId);

          // Increment usage count on success
          let fallbackProviderKeys: IApiKey[] = [];
          if (typeof user.apiKeys.forEach === "function") {
            user.apiKeys.forEach((val: IApiKey | IApiKey[]) => {
              if (Array.isArray(val))
                fallbackProviderKeys = fallbackProviderKeys.concat(val);
              else if (val && typeof val === "object")
                fallbackProviderKeys.push(val);
            });
          } else {
            for (const val of Object.values(user.apiKeys)) {
              if (Array.isArray(val))
                fallbackProviderKeys = fallbackProviderKeys.concat(val);
              else if (val && typeof val === "object")
                fallbackProviderKeys.push(val);
            }
          }

          const fbKeyIndex = fallbackProviderKeys.findIndex(
            (k: IApiKey) => k._id?.toString() === keyObj._id?.toString()
          );

          if (fbKeyIndex !== -1) {
            fallbackProviderKeys[fbKeyIndex].usageCount =
              (fallbackProviderKeys[fbKeyIndex].usageCount || 0) + 1;
            if (typeof user.apiKeys.clear === "function") {
              user.apiKeys.clear();
              user.apiKeys.set("gemini", fallbackProviderKeys);
            } else {
              user.apiKeys = { gemini: fallbackProviderKeys } as unknown as Map<
                string,
                IApiKey[]
              >;
            }
            await user.save();
          }

          return fallbackResult;
        } catch (fallbackError) {
          throw fallbackError;
        }
      }

      // If it's another type of error, bubble it up immediately
      throw error;
    }
  }

  throw new Error("Unexpected end of fallback execution");
}

export async function getActionDefinition(name: string) {
  const action = await ActionDefinition.findOne({ name });
  if (!action) {
    throw new Error(`Action definition ${name} not found`);
  }
  return action;
}
