import { HeaderManager } from "@/components/molecules/header-manager.molecule";
import { Settings } from "@/components/organisms/index.organisms";

export function SettingsPage() {
  return (
    <>
      <HeaderManager title='Settings' />
      <Settings />
    </>
  );
}
