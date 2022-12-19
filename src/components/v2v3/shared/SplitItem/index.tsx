import { BigNumber } from '@ethersproject/bignumber'

import {
  DiffMinus,
  DiffPlus,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails/DiffedItem'
import {
  DIFF_NEW_BACKGROUND,
  DIFF_OLD_BACKGROUND,
} from 'constants/styles/colors'

import { Split } from 'models/splits'
import { twJoin } from 'tailwind-merge'
import { OldSplit } from 'utils/splits'

import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { ETHAddressBeneficiary } from './EthAddressBeneficiary'
import { JuiceboxProjectBeneficiary } from './JuiceboxProjectBeneficiary'
import { LockedUntilValue } from './LockedUntilValue'
import { ReservedTokensValue } from './ReservedTokensValue'
import { SplitValue } from './SplitValue'

export type SplitProps = {
  split: Split
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  reservedRate?: number
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}

export function SplitItem({
  split,
  showFees,
  totalValue,
  projectOwnerAddress,
  reservedRate,
  valueSuffix,
  valueFormatProps,
  currency,
}: {
  split: Split & { oldSplit?: OldSplit }
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  reservedRate?: number
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
}) {
  const isJuiceboxProject = isJuiceboxProjectSplit(split)

  const oldSplit = split.oldSplit
  const splitIsRemoved = oldSplit === true
  const splitIsNew = oldSplit === false

  const hasDiff = oldSplit !== undefined && !(splitIsRemoved || splitIsNew)

  const className = twJoin(
    'flex flex-wrap items-baseline justify-between',
    splitIsRemoved ? DIFF_OLD_BACKGROUND : undefined,
    splitIsNew ? DIFF_NEW_BACKGROUND : undefined,
  )

  return (
    <div className={className}>
      <div>
        <div className="items-baselineleading-6 flex">
          {splitIsRemoved ? <DiffMinus /> : null}
          {splitIsNew ? <DiffPlus /> : null}
          {isJuiceboxProject ? (
            <JuiceboxProjectBeneficiary
              projectOwnerAddress={projectOwnerAddress}
              split={split}
              oldSplit={hasDiff ? oldSplit : undefined}
            />
          ) : (
            <ETHAddressBeneficiary
              projectOwnerAddress={projectOwnerAddress}
              split={split}
            />
          )}
        </div>

        {(split.lockedUntil && split.lockedUntil > 0) || hasDiff ? (
          <LockedUntilValue
            lockedUntil={split.lockedUntil}
            oldLockedUntil={hasDiff ? oldSplit.lockedUntil : undefined}
            showDiff={hasDiff} // need for LockedText because lockedUntil can be undefined
          />
        ) : null}
      </div>
      <div className="flex whitespace-nowrap">
        <SplitValue
          split={split}
          oldSplit={hasDiff ? oldSplit : undefined}
          totalValue={totalValue}
          valueSuffix={valueSuffix}
          valueFormatProps={valueFormatProps}
          currency={currency}
          showFees={showFees}
        />
        {reservedRate !== undefined ? (
          <ReservedTokensValue
            splitPercent={split.percent}
            reservedRate={reservedRate}
          />
        ) : null}
      </div>
    </div>
  )
}
