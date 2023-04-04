import IntroImprovedSearch from 'components/announcements/IntroImprovedSearch'
import IntroProjectTags from 'components/announcements/IntroProjectTags'
import { Announcement } from 'models/announcement'

export const announcements: Announcement[] = [
  {
    id: 'introProjectTags',
    conditions: [({ isProjectOwner }) => isProjectOwner],
    content: IntroProjectTags,
    expire: new Date('2023-05-01T00:00:00.000Z').valueOf(),
  },
  {
    id: 'introImprovedSearch',
    conditions: [({ router }) => router.pathname.includes('projects')],
    content: IntroImprovedSearch,
    expire: new Date('2023-05-01T00:00:00.000Z').valueOf(),
  },
]

const expired = announcements.filter(
  a => a.expire && a.expire < Date.now().valueOf(),
)

if (expired.length) {
  // Just a friendly helper log
  console.warn(
    'Some announcements have expired and can be removed:',
    expired.map(e => e.id).join(', '),
  )
}
