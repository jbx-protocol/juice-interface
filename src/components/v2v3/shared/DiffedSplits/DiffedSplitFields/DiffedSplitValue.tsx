import { BigNumber } from 'ethers'
import { Split } from 'models/splits'
import { classNames } from 'utils/classNames'
import { formatSplitPercent } from 'utils/v2v3/math'
import { SplitProps } from '../../SplitItem'
import { DiffedSplitAmount } from './DiffedSplitAmount'
import { DiffedSplitPercent } from './DiffedSplitPercent'

export function DiffedSplitValue({
  splitProps,
  diffSplit,
}: {
  splitProps: SplitProps
  diffSplit?: Split
}) {
  const diffSplitProps: SplitProps | undefined = diffSplit
    ? {
        split: diffSplit,
        totalValue: diffSplit.totalValue,
        projectOwnerAddress: splitProps.projectOwnerAddress,
        currency: splitProps.currency,
      }
    : undefined

  const splitIsZero =
    formatSplitPercent(BigNumber.from(splitProps.split.percent)) === '0'

  const showAmounts =
    splitProps.showAmount && splitProps.totalValue?.gt(0) && !splitIsZero

  return (
    <div
      className={classNames(
        'flex-end',
        showAmounts ? 'grid grid-rows-2' : undefined,
      )}
    >
      <DiffedSplitPercent
        percent={splitProps.split.percent}
        oldPercent={diffSplit?.percent}
      />
      {showAmounts && (
        <DiffedSplitAmount
          newSplitProps={splitProps}
          oldSplitProps={diffSplitProps}
        />
      )}
    </div>
  )
}
