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
      className="border border-solid border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100"
      iconComponent={<WarningOutlined className="text-2xl text-warning-500" />}
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
