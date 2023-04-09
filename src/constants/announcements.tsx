import { IntroImprovedSearchAnnouncement } from 'components/announcements/IntroImprovedSearchAnnouncement'
import { IntroProfileAnnouncement } from 'components/announcements/IntroProfileAnnouncement'
import { IntroProjectTagsAnnouncement } from 'components/announcements/IntroProjectTagsAnnouncement'
import { Announcement } from 'models/announcement'

export const Announcements: Announcement[] = [
  {
    id: 'introProjectTags',
    conditions: [
      ({ isProjectOwner, router }) =>
        isProjectOwner && router.pathname.includes('/v2/p/'),
    ],
    Content: IntroProjectTagsAnnouncement,
    expire: new Date('2023-05-01T00:00:00.000Z').valueOf(),
  },
  {
    id: 'introImprovedSearch',
    conditions: [({ router }) => router.pathname.includes('projects')],
    Content: IntroImprovedSearchAnnouncement,
    expire: new Date('2023-05-01T00:00:00.000Z').valueOf(),
  },
  {
    id: 'introProfile',
    conditions: [
      ({ wallet }) => wallet.isConnected && !wallet.chainUnsupported,
    ],
    Content: IntroProfileAnnouncement,
  },
]

const expired = Announcements.filter(
  a => a.expire && a.expire < Date.now().valueOf(),
)

if (expired.length) {
  // Just a friendly helper log
  console.warn(
    'Some announcements have expired and can be removed:',
    expired.map(e => e.id).join(', '),
  )
}
