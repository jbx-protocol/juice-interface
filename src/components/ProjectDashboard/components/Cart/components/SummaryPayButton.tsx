import { Button } from 'antd'
import { useCartSummary } from '../hooks/useCartSummary'

export const SummaryPayButton = () => {
  const { payProject, walletConnected } = useCartSummary()
  return (
    <Button type="primary" onClick={payProject}>
      {walletConnected ? 'Pay project' : 'Connect wallet'}
    </Button>
  )
}
