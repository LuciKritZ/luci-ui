import { HeaderManager } from "@/components/molecules/header-manager.molecule";
import { Dashboard as ProjectsList } from "@/components/organisms/index.organisms";

export function ProjectsPage() {
  return (
    <>
      <HeaderManager title='Projects' />
      <main className='py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <ProjectsList />
        </div>
      </main>
    </>
  );
}
