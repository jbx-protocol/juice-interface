import { ProjectsUpdateFeatureAnnouncement } from 'components/announcements/ProjectsUpdateFeatureAnnouncement'
import { Announcement } from 'models/announcement'

// e.g
// {
//   id: 'introProfile',
//   conditions: [
//     ({ wallet }) => wallet.isConnected && !wallet.chainUnsupported,
//   ],
//   expire: new Date('2023-05-10').valueOf(),
//   Content: IntroProfileAnnouncement,
// },
export const Announcements: Announcement[] = [
  {
    id: 'project-updates',
    expire: new Date('2023-08-18').valueOf(),
    conditions: [
      ({ router }) => router.pathname.startsWith('/v2/p/'),
      ({ isProjectOwner }) => isProjectOwner,
    ],
    Content: ProjectsUpdateFeatureAnnouncement,
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
