import { JuiceModalProps } from 'components/modals/JuiceModal'
import { Wallet } from 'hooks/Wallet'

type AnnouncementCondition = (props: {
  pathname: string
  isProjectOwner: boolean
  wallet: Pick<
    Wallet,
    'userAddress' | 'isConnected' | 'chain' | 'chainUnsupported'
  >
}) => boolean

export type Announcement = {
  id: string
  conditions: AnnouncementCondition[]
  expire?: number // millis timestamp
  Content: React.FC<
    React.PropsWithChildren<Pick<JuiceModalProps, 'open' | 'setOpen'>>
  >
}
