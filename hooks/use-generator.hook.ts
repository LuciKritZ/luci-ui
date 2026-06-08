import { useCallback, useEffect, useRef, useState } from "react";

import { useSettings } from "@/contexts/settings.context";
import { Artifact, ComponentVariation } from "@/types/index.types";
import { Project } from "@/types/project.types";
import { sanitizeHtmlLinks } from "@/utils/html.utils";
import { generateId } from "@/utils/index.utils";

export function useGenerator(
  projectId?: string,
  initialArtifacts?: Artifact[],
  updateProject?: (id: string, updates: Partial<Project>) => Promise<void>
) {
  const { settings } = useSettings();
  const [artifacts, setArtifacts] = useState<Artifact[]>(
    initialArtifacts || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [componentVariations, setComponentVariations] = useState<
    ComponentVariation[]
  >([]);

  const lastSavedRef = useRef<string>("");

  // Sync artifacts to DB when not streaming
  useEffect(() => {
    if (!projectId) return;
    const hasStreaming = artifacts.some(a => a.status === "streaming");
    if (!hasStreaming) {
      const currentStr = JSON.stringify(artifacts);
      if (currentStr === lastSavedRef.current) return;
      lastSavedRef.current = currentStr;

      if (updateProject) {
        // We use updateProject which inherently makes a PATCH request and syncs global context.
        updateProject(projectId, { artifacts }).catch(console.error);
      }
    }
  }, [artifacts, projectId, updateProject]);

  const deleteArtifact = useCallback((artifactId: string) => {
    setArtifacts(prev => prev.filter(a => a.id !== artifactId));
  }, []);

  const parseJsonStream = async function* (
    responseStream: ReadableStream<Uint8Array>
  ) {
    const reader = responseStream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let braceCount = 0;
      let start = buffer.indexOf("{");
      while (start !== -1) {
        braceCount = 0;
        let end = -1;
        for (let i = start; i < buffer.length; i++) {
          if (buffer[i] === "{") braceCount++;
          else if (buffer[i] === "}") braceCount--;
          if (braceCount === 0 && i > start) {
            end = i;
            break;
          }
        }
        if (end !== -1) {
          const jsonString = buffer.substring(start, end + 1);
          try {
            yield JSON.parse(jsonString);
            buffer = buffer.substring(end + 1);
            start = buffer.indexOf("{");
          } catch {
            start = buffer.indexOf("{", start + 1);
          }
        } else {
          break;
        }
      }
    }
  };

  const generateVariations = useCallback(
    async (prompt: string, theme: string = "minimal") => {
      setIsLoading(true);
      setComponentVariations([]);

      try {
        if (!settings.hasGeminiApiKey)
          throw new Error("API_KEY is not configured.");

        const response = await fetch("/api/generate/variations", {
          body: JSON.stringify({ prompt, theme }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok || !response.body)
          throw new Error("Failed to generate variations");

        for await (const variation of parseJsonStream(response.body)) {
          if (variation.name && variation.html) {
            setComponentVariations(prev => [
              ...prev,
              { ...variation, html: sanitizeHtmlLinks(variation.html) },
            ]);
          }
        }
      } catch (e) {
        console.error("Error generating variations:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [settings.hasGeminiApiKey]
  );

  const generateArtifacts = useCallback(
    async (prompt: string, theme: string = "minimal") => {
      if (!prompt.trim() || isLoading) return;

      setIsLoading(true);
      const baseTime = Date.now();

      const placeholderArtifacts: Artifact[] = Array(3)
        .fill(null)
        .map(() => ({
          html: "",
          id: generateId(),
          prompt,
          status: "streaming",
          styleName: "Designing...",
          timestamp: baseTime,
        }));

      setArtifacts(prev => [...placeholderArtifacts, ...prev]);

      try {
        if (!settings.hasGeminiApiKey)
          throw new Error("API_KEY is not configured.");

        // Fetch Styles
        const styleResponse = await fetch("/api/generate/styles", {
          body: JSON.stringify({ prompt, theme }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        let generatedStyles: string[] = [];
        if (styleResponse.ok) {
          const data = await styleResponse.json();
          if (data.styles) {
            generatedStyles = data.styles;
          }
        } else {
          const errText = await styleResponse.text();
          throw new Error(errText || "Failed to generate styles");
        }

        if (!generatedStyles || generatedStyles.length < 3) {
          throw new Error("Failed to generate enough styles");
        }

        generatedStyles = generatedStyles.slice(0, 3);

        setArtifacts(prev =>
          prev.map(art => {
            const index = placeholderArtifacts.findIndex(p => p.id === art.id);
            if (index !== -1) {
              return { ...art, styleName: generatedStyles[index] };
            }
            return art;
          })
        );

        const generateArtifact = async (
          artifact: Artifact,
          styleInstruction: string
        ) => {
          try {
            const artifactResponse = await fetch("/api/generate/artifact", {
              body: JSON.stringify({ prompt, styleInstruction, theme }),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            });

            if (!artifactResponse.ok || !artifactResponse.body) {
              throw new Error("Failed to generate artifact");
            }

            const reader = artifactResponse.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedHtml = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              accumulatedHtml += decoder.decode(value, { stream: true });
              setArtifacts(prev =>
                prev.map(art =>
                  art.id === artifact.id
                    ? { ...art, html: sanitizeHtmlLinks(accumulatedHtml) }
                    : art
                )
              );
            }

            let finalHtml = accumulatedHtml.trim();
            if (finalHtml.startsWith("```html"))
              finalHtml = finalHtml.substring(7).trimStart();
            if (finalHtml.startsWith("```"))
              finalHtml = finalHtml.substring(3).trimStart();
            if (finalHtml.endsWith("```"))
              finalHtml = finalHtml
                .substring(0, finalHtml.length - 3)
                .trimEnd();

            setArtifacts(prev =>
              prev.map(art =>
                art.id === artifact.id
                  ? {
                      ...art,
                      html: sanitizeHtmlLinks(finalHtml),
                      status: finalHtml ? "complete" : "error",
                    }
                  : art
              )
            );
          } catch (e: unknown) {
            console.error("Error generating artifact:", e);
            const error = e as Error;
            setArtifacts(prev =>
              prev.map(art =>
                art.id === artifact.id
                  ? {
                      ...art,
                      html: error.message || "Generation failed",
                      status: "error",
                    }
                  : art
              )
            );
          }
        };

        await Promise.all(
          placeholderArtifacts.map((art, i) =>
            generateArtifact(art, generatedStyles[i])
          )
        );
      } catch (e) {
        console.error("Fatal error in generation process", e);
        setArtifacts(prev =>
          prev.map(art => {
            const index = placeholderArtifacts.findIndex(p => p.id === art.id);
            if (index !== -1) {
              return {
                ...art,
                html: e instanceof Error ? e.message : "Unknown error",
                status: "error",
                styleName: "Generation Failed",
              };
            }
            return art;
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, settings.hasGeminiApiKey]
  );

  return {
    artifacts,
    componentVariations,
    deleteArtifact,
    generateArtifacts,
    generateVariations,
    isLoading,
    setArtifacts,
    setComponentVariations,
  };
}
