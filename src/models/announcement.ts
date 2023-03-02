import { NextRouter } from 'next/router'

type AnnouncementCondition = ({
  router,
  isProjectOwner,
}: {
  router: NextRouter
  isProjectOwner: boolean
}) => boolean

export type Announcement = {
  id: string
  conditions: AnnouncementCondition[]
  expire?: number // millis timestamp
  content: JSX.Element
  cta?: {
    text?: string
    fn?: (router: NextRouter) => void
  }
}
