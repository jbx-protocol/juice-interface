import { BigNumber } from '@ethersproject/bignumber'
import { AmountSubject } from '../shared'
import { useDistributePayoutsEvents } from './hooks/DistributePayoutsEvents'

export function DistributePayoutsEventSubject({
  id,
  distributedAmount,
}: {
  id: string | undefined
  distributedAmount: BigNumber | undefined
}) {
  const distributePayoutsEvents = useDistributePayoutsEvents({ id })
  if (!distributePayoutsEvents?.length) {
    return null
  }

  return <AmountSubject amount={distributedAmount} />
}
