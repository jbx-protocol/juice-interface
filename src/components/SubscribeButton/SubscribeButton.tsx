import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { ModalProvider } from 'contexts/Modal'
import { twMerge } from 'tailwind-merge'
import { SubscribeButtonIcon } from './SubscribeButtonIcon'
import { SubscribeModal } from './SubscribeModal'
import { useSubscribeButton } from './hooks/useSubscribeButton'

interface SubscribeButtonProps {
  projectId: number
  className?: string
  tooltipPlacement?: TooltipPlacement
}

const _SubscribeButton = ({
  projectId,
  className,
  tooltipPlacement,
}: SubscribeButtonProps) => {
  const { loading, isSubscribed, onSubscribeButtonClicked } =
    useSubscribeButton({ projectId })

  return (
    <>
      <Tooltip
        placement={tooltipPlacement}
        title={
          isSubscribed
            ? 'You are subscribed to notifications'
            : 'Subscribe to notifications'
        }
      >
        <Button
          className={twMerge(
            'flex items-center justify-center gap-3 p-0',
            className,
          )}
          type="text"
          onClick={onSubscribeButtonClicked}
          loading={loading}
          icon={<SubscribeButtonIcon isSubscribed={isSubscribed} />}
        >
          <span className="font-base text-sm">
            <Trans>Get Updates</Trans>
          </span>
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
