import { BellFilled, BellOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import SkeletonButton from 'antd/lib/skeleton/Button'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { Badge } from 'components/Badge'
import { ModalProvider } from 'contexts/Modal'
import { twMerge } from 'tailwind-merge'
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
  const {
    loading,
    isSubscribed,
    showSubscribeButton,
    onSubscribeButtonClicked,
  } = useSubscribeButton({ projectId })

  if (!showSubscribeButton) return null

  if (loading) return <SkeletonButton active size="small" />

  return (
    <div className="flex flex-nowrap items-center">
      <Tooltip
        placement={tooltipPlacement}
        title={
          isSubscribed
            ? 'You are subscribed to notifications'
            : 'Subscribe to notifications'
        }
      >
        <Button
          className={twMerge('p-0', className)}
          type="text"
          onClick={onSubscribeButtonClicked}
          icon={isSubscribed ? <BellFilled /> : <BellOutlined />}
        />
      </Tooltip>
      <span>
        <Badge variant="info">
          <Trans>New</Trans>
        </Badge>
      </span>
      <SubscribeModal />
    </div>
  )
}

export const SubscribeButton = (props: SubscribeButtonProps) => (
  <ModalProvider>
    <_SubscribeButton {...props} />
  </ModalProvider>
)
