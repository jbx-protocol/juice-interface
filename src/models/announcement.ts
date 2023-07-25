import { JuiceModalProps } from 'components/modals/JuiceModal'
import { NextRouter } from 'next/router'

type AnnouncementCondition = (props: {
  router: NextRouter
  isProjectOwner: boolean
  wallet: Partial<{
    userAddress: string
    isConnected: boolean
    chain: { id: string; name: string }
    chainUnsupported?: boolean
  }>
}) => boolean

export type Announcement = {
  id: string
  conditions: AnnouncementCondition[]
  expire?: number // millis timestamp
  Content: React.FC<
    React.PropsWithChildren<Pick<JuiceModalProps, 'open' | 'setOpen'>>
  >
}
