"use client";

import { useEffect, useState } from "react";

import { Wizard } from "@/components/organisms/index.organisms";
import { useProject } from "@/contexts/project.context";

export default function NewProjectPage() {
  const { setCurrentProject, setWizardStep } = useProject();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCurrentProject(null);
    setWizardStep("idea");
    setIsReady(true);
  }, [setCurrentProject, setWizardStep]);

  if (!isReady) return null;

  return <Wizard />;
}
