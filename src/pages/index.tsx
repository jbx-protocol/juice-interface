import { AppWrapper } from 'components/common'
import { HomePage } from 'components/Home'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function LandingPage() {
  return (
    <AppWrapper>
      <AnnouncementsProvider>
        <HomePage />
      </AnnouncementsProvider>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
