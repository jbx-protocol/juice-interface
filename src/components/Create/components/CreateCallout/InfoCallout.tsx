import { InfoCircleOutlined } from '@ant-design/icons'
import Callout from 'components/Callout'

export const InfoCallout: React.FC = ({ children }) => {
  return (
    <Callout
      iconComponent={<InfoCircleOutlined style={{ fontSize: '1.5rem' }} />}
    >
      {children}
    </Callout>
  )
}
