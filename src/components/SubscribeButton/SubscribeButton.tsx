import { Button, Tooltip } from 'antd'
import SkeletonButton from 'antd/lib/skeleton/Button'
import { TooltipPlacement } from 'antd/lib/tooltip'
import { twMerge } from 'tailwind-merge'
import { useSubscribeButton } from './hooks/useSubscribeButton'
import { SubscribeButtonIcon } from './SubscribeButtonIcon'

export const SubscribeButton = ({
  projectId,
  className,
  tooltipPlacement,
}: {
  projectId: number
  className?: string
  tooltipPlacement?: TooltipPlacement
}) => {
  const {
    loading,
    isSubscribed,
    showSubscribeButton,
    onSubscribeButtonClicked,
  } = useSubscribeButton({ projectId })

  if (!showSubscribeButton) return null

  if (loading) return <SkeletonButton active size="small" />

  return (
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
      >
        <SubscribeButtonIcon isSubscribed={isSubscribed} />
      </Button>
    </Tooltip>
  )
}
