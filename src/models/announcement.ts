import { JuiceModalProps } from 'components/JuiceModal'
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
  Content: React.FC<Pick<JuiceModalProps, 'open' | 'setOpen'>>
}
