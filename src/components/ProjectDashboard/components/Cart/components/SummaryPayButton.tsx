import { Button } from 'antd'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = ({ className }: { className?: string }) => {
  const { payProject, walletConnected } = useCartSummary()
  return (
    <Button className={className} type="primary" onClick={payProject}>
      {walletConnected ? 'Pay project' : 'Connect wallet'}
    </Button>
  )
}
