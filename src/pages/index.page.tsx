import { AppWrapper } from 'components/common'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'
import { HomePage } from './home'

export default function LandingPage() {
  return (
    <AppWrapper>
      <AnnouncementsProvider>
        <HomePage />
      </AnnouncementsProvider>
    </AppWrapper>
  )
}
