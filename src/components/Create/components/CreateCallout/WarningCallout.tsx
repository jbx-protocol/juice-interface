import { WarningOutlined } from '@ant-design/icons'
import Callout from 'components/Callout'
import useMobile from 'hooks/Mobile'

export const WarningCallout: React.FC<{
  collapsible?: boolean
}> = ({ collapsible, children }) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className="bg-warning-50 dark:bg-warning-900 text-warning-800 dark:text-warning-100 border-warning-200 dark:border-warning-500 border border-solid"
      iconComponent={<WarningOutlined className="text-2xl text-warning-500" />}
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
