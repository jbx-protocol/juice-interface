import { ProjectsView } from 'components/Projects/ProjectsView'
import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function ProjectsPage() {
  return (
    <AppWrapper>
      <ProjectsView />
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
