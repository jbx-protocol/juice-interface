import { CoverPhoto } from './components/CoverPhoto'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectTabs } from './components/ProjectTabs'

export const ProjectDashboard = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <CoverPhoto />
      <div className="flex w-full justify-center px-6">
        <div className="flex w-full max-w-7xl flex-col">
          <ProjectHeader />
          <ProjectTabs />
        </div>
      </div>
    </div>
  )
}
