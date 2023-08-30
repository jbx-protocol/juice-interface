import { AppWrapper } from 'components/common'
import { AnnouncementsProvider } from 'contexts/Announcements/AnnouncementsProvider'

export default function Page() {
  return (
    <AppWrapper>
      <AnnouncementsProvider>
        <h1>foo</h1>
      </AnnouncementsProvider>
    </AppWrapper>
  )
}
