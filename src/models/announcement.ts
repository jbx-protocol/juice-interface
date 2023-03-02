import { NetworkInfo } from 'constants/networks'
import { NextRouter } from 'next/router'

type AnnouncementCondition = ({
  router,
  network,
  isProjectOwner,
}: {
  router: NextRouter
  network: NetworkInfo
  isProjectOwner: boolean
}) => boolean

export type Announcement = {
  id: string
  conditions: AnnouncementCondition[]
  expire?: number // millis timestamp
  content: JSX.Element
  action?: {
    text?: string
    call?: (router: NextRouter) => void
  }
}
