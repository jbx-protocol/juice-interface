import { BigNumber } from '@ethersproject/bignumber'
import { primaryContentFontSize } from 'components/activityEventElems/styles'
import ETHAmount from 'components/currency/ETHAmount'

export interface AmountSubjectProps {
  amount: BigNumber | undefined
}

export function AmountSubject({ amount }: AmountSubjectProps) {
  return (
    <div style={{ fontSize: primaryContentFontSize }}>
      <ETHAmount amount={amount} />
    </div>
  )
}
