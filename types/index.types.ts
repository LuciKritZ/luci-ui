export * from "./auth.types";
export * from "./project.types";
export * from "./settings.types";

export interface Artifact {
  html: string;
  id: string;
  prompt: string;
  status: "complete" | "error" | "streaming";
  styleName: string;
  timestamp: number;
}

export interface ComponentVariation {
  html: string;
  name: string;
}
