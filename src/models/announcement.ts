import { JuiceModalProps } from 'components/modals/JuiceModal'
import { useWallet } from 'hooks/Wallet'
import { NextRouter } from 'next/router'

type AnnouncementCondition = (props: {
  router: NextRouter
  isProjectOwner: boolean
  wallet: Pick<
    ReturnType<typeof useWallet>,
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
