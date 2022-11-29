import { InfoCircleOutlined } from '@ant-design/icons'
import useMobile from 'hooks/Mobile'
import { twMerge } from 'tailwind-merge'
import { Callout } from './Callout'

export const InfoCallout: React.FC<{
  className?: string
  noIcon?: boolean
  collapsible?: boolean
  transparent?: boolean
}> = ({
  className,
  children,
  noIcon = false,
  transparent = false,
  collapsible,
}) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className={twMerge(
        className,
        !transparent ? 'bg-smoke-75 dark:bg-slate-400' : undefined,
      )}
      iconComponent={
        !noIcon ? <InfoCircleOutlined className="text-2xl" /> : null
      }
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
