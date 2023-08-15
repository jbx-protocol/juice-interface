import { AppWrapper } from 'components/common'
import { HomePage } from 'components/Home'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'

export default function LandingPage() {
  return (
    <AppWrapper>
      <AnnouncementsProvider>
        <HomePage />
      </AnnouncementsProvider>
    </AppWrapper>
  )
}
