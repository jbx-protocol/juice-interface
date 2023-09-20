import { Button, Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { ModalProvider } from 'contexts/Modal'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { SubscribeButtonIcon } from './SubscribeButtonIcon'
import { SubscribeModal } from './SubscribeModal'
import { useSubscribeButton } from './hooks/useSubscribeButton'

type SubscribeButtonProps = {
  className?: string
  iconClassName?: string
  projectId: number
  children?: ReactNode
  tooltipPlacement?: TooltipPlacement
  disableTooltip?: boolean
}

const _SubscribeButton = ({
  className,
  iconClassName,
  projectId,
  children,
  tooltipPlacement,
  disableTooltip,
}: SubscribeButtonProps) => {
  const { loading, isSubscribed, onSubscribeButtonClicked } =
    useSubscribeButton({ projectId })

  return (
    <>
      <Tooltip
        open={disableTooltip ? false : undefined}
        placement={tooltipPlacement}
        title={
          isSubscribed
            ? 'You are subscribed to notifications'
            : 'Subscribe to notifications'
        }
      >
        <Button
          className={twMerge('flex items-center gap-x-2 p-0', className)}
          type="text"
          onClick={onSubscribeButtonClicked}
          loading={loading}
          icon={
            <SubscribeButtonIcon
              className={iconClassName}
              isSubscribed={isSubscribed}
            />
          }
        >
          {children}
        </Button>
      </Tooltip>

      <SubscribeModal />
    </>
  )
}

export const SubscribeButton = (props: SubscribeButtonProps) => (
  <ModalProvider>
    <_SubscribeButton {...props} />
  </ModalProvider>
)
