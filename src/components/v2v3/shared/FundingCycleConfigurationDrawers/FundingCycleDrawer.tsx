import { JuiceDrawer } from 'components/JuiceDrawer'
import { drawerStyle } from 'constants/styles/drawerStyle'
import { PropsWithChildren } from 'react'

/**
 * Provides the blueprint for Funding Cycle Drawers.
 */
export default function FundingCycleDrawer({
  title,
  open,
  onClose,
  children,
}: PropsWithChildren<{
  title: string
  open: boolean
  onClose: VoidFunction
}>) {
  return (
    <JuiceDrawer {...drawerStyle} open={open} onClose={onClose} destroyOnClose>
      <h1>{title}</h1>
      {children}
    </JuiceDrawer>
  )
}
