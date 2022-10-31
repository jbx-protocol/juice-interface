import { InfoCircleOutlined } from '@ant-design/icons'
import Callout from 'components/Callout'
import useMobile from 'hooks/Mobile'

export const InfoCallout: React.FC<{
  noIcon?: boolean
  collapsible?: boolean
}> = ({ children, noIcon = false, collapsible }) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      iconComponent={
        !noIcon ? <InfoCircleOutlined style={{ fontSize: '1.5rem' }} /> : null
      }
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
