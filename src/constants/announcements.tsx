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
export const Announcements: Announcement[] = []

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
