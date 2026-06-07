import { useCallback, useState } from 'react';

import { useSettings } from '@/contexts/settings.context';
import { Artifact, ComponentVariation, Session } from '@/types/index.types';
import { generateId } from '@/utils/index.utils';

export function useGenerator() {
  const { settings } = useSettings();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [componentVariations, setComponentVariations] = useState<
    ComponentVariation[]
  >([]);

  const parseJsonStream = async function* (
    responseStream: ReadableStream<Uint8Array>
  ) {
    const reader = responseStream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let braceCount = 0;
      let start = buffer.indexOf('{');
      while (start !== -1) {
        braceCount = 0;
        let end = -1;
        for (let i = start; i < buffer.length; i++) {
          if (buffer[i] === '{') braceCount++;
          else if (buffer[i] === '}') braceCount--;
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
            start = buffer.indexOf('{');
          } catch {
            start = buffer.indexOf('{', start + 1);
          }
        } else {
          break;
        }
      }
    }
  };

  const generateVariations = useCallback(
    async (prompt: string, theme: string = 'minimal') => {
      setIsLoading(true);
      setComponentVariations([]);

      try {
        if (!settings.hasGeminiApiKey)
          throw new Error('API_KEY is not configured.');

        const response = await fetch('/api/generate/variations', {
          body: JSON.stringify({ prompt, theme }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });

        if (!response.ok || !response.body)
          throw new Error('Failed to generate variations');

        for await (const variation of parseJsonStream(response.body)) {
          if (variation.name && variation.html) {
            setComponentVariations(prev => [...prev, variation]);
          }
        }
      } catch (e) {
        console.error('Error generating variations:', e);
      } finally {
        setIsLoading(false);
      }
    },
    [settings.hasGeminiApiKey]
  );

  const generateSession = useCallback(
    async (prompt: string, theme: string = 'minimal') => {
      if (!prompt.trim() || isLoading) return;

      setIsLoading(true);
      const baseTime = Date.now();
      const sessionId = generateId();

      const placeholderArtifacts: Artifact[] = Array(3)
        .fill(null)
        .map((_, i) => ({
          html: '',
          id: `${sessionId}_${i}`,
          status: 'streaming',
          styleName: 'Designing...',
        }));

      const newSession: Session = {
        artifacts: placeholderArtifacts,
        id: sessionId,
        prompt: prompt,
        timestamp: baseTime,
      };

      setSessions(prev => [...prev, newSession]);
      setCurrentSessionIndex(prev => prev + 1);

      try {
        if (!settings.hasGeminiApiKey)
          throw new Error('API_KEY is not configured.');

        // Fetch Styles
        const styleResponse = await fetch('/api/generate/styles', {
          body: JSON.stringify({ prompt, theme }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        });

        let generatedStyles: string[] = [];
        if (styleResponse.ok) {
          const data = await styleResponse.json();
          if (data.styles) {
            generatedStyles = data.styles;
          }
        }

        if (!generatedStyles || generatedStyles.length < 3) {
          generatedStyles = [
            'Primary Pigment Gridwork',
            'Tactile Risograph Layering',
            'Kinetic Silhouette Balance',
          ];
        }

        generatedStyles = generatedStyles.slice(0, 3);

        setSessions(prev =>
          prev.map(s => {
            if (s.id !== sessionId) return s;
            return {
              ...s,
              artifacts: s.artifacts.map((art, i) => ({
                ...art,
                styleName: generatedStyles[i],
              })),
            };
          })
        );

        const generateArtifact = async (
          artifact: Artifact,
          styleInstruction: string
        ) => {
          try {
            const artifactResponse = await fetch('/api/generate/artifact', {
              body: JSON.stringify({ prompt, styleInstruction, theme }),
              headers: { 'Content-Type': 'application/json' },
              method: 'POST',
            });

            if (!artifactResponse.ok || !artifactResponse.body) {
              throw new Error('Failed to generate artifact');
            }

            const reader = artifactResponse.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedHtml = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              accumulatedHtml += decoder.decode(value, { stream: true });
              setSessions(prev =>
                prev.map(sess =>
                  sess.id === sessionId
                    ? {
                        ...sess,
                        artifacts: sess.artifacts.map(art =>
                          art.id === artifact.id
                            ? { ...art, html: accumulatedHtml }
                            : art
                        ),
                      }
                    : sess
                )
              );
            }

            let finalHtml = accumulatedHtml.trim();
            if (finalHtml.startsWith('\`\`\`html'))
              finalHtml = finalHtml.substring(7).trimStart();
            if (finalHtml.startsWith('\`\`\`'))
              finalHtml = finalHtml.substring(3).trimStart();
            if (finalHtml.endsWith('\`\`\`'))
              finalHtml = finalHtml
                .substring(0, finalHtml.length - 3)
                .trimEnd();

            setSessions(prev =>
              prev.map(sess =>
                sess.id === sessionId
                  ? {
                      ...sess,
                      artifacts: sess.artifacts.map(art =>
                        art.id === artifact.id
                          ? {
                              ...art,
                              html: finalHtml,
                              status: finalHtml ? 'complete' : 'error',
                            }
                          : art
                      ),
                    }
                  : sess
              )
            );
          } catch (e) {
            console.error('Error generating artifact:', e);
          }
        };

        await Promise.all(
          placeholderArtifacts.map((art, i) =>
            generateArtifact(art, generatedStyles[i])
          )
        );
      } catch (e) {
        console.error('Fatal error in generation process', e);
        setSessions(prev =>
          prev.map(sess =>
            sess.id === sessionId
              ? {
                  ...sess,
                  artifacts: sess.artifacts.map(art => ({
                    ...art,
                    status: 'error',
                    styleName: 'Error: API Key missing or invalid',
                  })),
                }
              : sess
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, settings.hasGeminiApiKey]
  );

  return {
    componentVariations,
    currentSessionIndex,
    generateSession,
    generateVariations,
    isLoading,
    sessions,
    setComponentVariations,
    setCurrentSessionIndex,
    setSessions,
  };
}
