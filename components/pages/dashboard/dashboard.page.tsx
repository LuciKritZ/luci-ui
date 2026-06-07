import { HeaderManager } from '@/components/molecules/header-manager.molecule';
import { AnalyticsDashboard } from '@/components/organisms/index.organisms';

export function DashboardPage() {
  return (
    <>
      <HeaderManager title='Dashboard' />
      <AnalyticsDashboard />
    </>
  );
}
