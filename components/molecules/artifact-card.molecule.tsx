"use client";

import React, { useEffect, useRef } from "react";

import { Artifact } from "@/types/index.types";

interface ArtifactCardProps {
  artifact: Artifact;
  isFocused: boolean;
  onClick: () => void;
}

const ArtifactCard = React.memo(
  ({ artifact, isFocused, onClick }: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);

    // Auto-scroll logic for this specific card
    useEffect(() => {
      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight;
      }
    }, [artifact.html]);

    const isBlurring = artifact.status === "streaming";

    return (
      <div
        className={`artifact-card ${isFocused ? "focused" : ""} ${isBlurring ? "generating" : ""}`}
        onClick={onClick}
      >
        <div className='artifact-header'>
          <span className='artifact-style-tag'>{artifact.styleName}</span>
          {isBlurring && (
            <span className='text-[0.6rem] animate-pulse'>Designing...</span>
          )}
        </div>
        <div className='artifact-card-inner'>
          {isBlurring && (
            <div className='generating-overlay'>
              <pre className='code-stream-preview' ref={codeRef}>
                {artifact.html}
              </pre>
            </div>
          )}
          <iframe
            className='artifact-iframe'
            sandbox='allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin'
            srcDoc={artifact.html}
            title={artifact.id}
          />
        </div>
      </div>
    );
  }
);

ArtifactCard.displayName = "ArtifactCard";

export default ArtifactCard;
