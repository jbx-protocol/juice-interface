import { BigNumber } from '@ethersproject/bignumber'

import {
  DiffMinus,
  DiffPlus,
  DIFF_NEW_BACKGROUND,
  DIFF_OLD_BACKGROUND,
} from 'components/v2v3/shared/DiffedItem'

import { twJoin } from 'tailwind-merge'
import { SplitWithDiff } from 'utils/splits'

import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { ETHAddressBeneficiary } from './EthAddressBeneficiary'
import { JuiceboxProjectBeneficiary } from './JuiceboxProjectBeneficiary'
import { LockedUntilValue } from './LockedUntilValue'
import { ReservedTokensValue } from './ReservedTokensValue'
import { SplitValue } from './SplitValue'

export type SplitProps = {
  split: SplitWithDiff
  totalValue: BigNumber | undefined
  projectOwnerAddress: string | undefined
  reservedRate?: number
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: BigNumber
  showFees?: boolean
  showAmount?: boolean
}

export function SplitItem({ props }: { props: SplitProps }) {
  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)

  const oldSplit = props.split.oldSplit
  const splitIsRemoved = oldSplit === true
  const splitIsNew = oldSplit === false

  const hasDiff = oldSplit !== undefined && !(splitIsRemoved || splitIsNew)

  const className = twJoin(
    'flex flex-wrap items-baseline justify-between',
    splitIsRemoved ? DIFF_OLD_BACKGROUND : undefined,
    splitIsNew ? DIFF_NEW_BACKGROUND : undefined,
    splitIsRemoved || splitIsNew ? '-ml-5 pr-1' : undefined,
  )

  return (
    <div className={className}>
      <div>
        <div className="items-baselineleading-6 flex">
          {splitIsRemoved ? <DiffMinus /> : null}
          {splitIsNew ? <DiffPlus /> : null}
          {isJuiceboxProject ? (
            <JuiceboxProjectBeneficiary
              projectOwnerAddress={props.projectOwnerAddress}
              split={props.split}
              oldSplit={hasDiff ? oldSplit : undefined}
            />
          ) : (
            <ETHAddressBeneficiary
              projectOwnerAddress={props.projectOwnerAddress}
              beneficaryAddress={props.split.beneficiary}
            />
          )}
        </div>

        {(props.split.lockedUntil && props.split.lockedUntil > 0) || hasDiff ? (
          <LockedUntilValue
            lockedUntil={props.split.lockedUntil}
            oldLockedUntil={hasDiff ? oldSplit.lockedUntil : undefined}
            showDiff={hasDiff} // need for LockedText because lockedUntil can be undefined
          />
        ) : null}
      </div>
      <div className="flex items-center whitespace-nowrap">
        <SplitValue
          diffSplit={hasDiff ? oldSplit : undefined}
          splitProps={props}
        />
        {props.reservedRate !== undefined ? (
          <ReservedTokensValue
            splitPercent={props.split.percent}
            reservedRate={props.reservedRate}
          />
        ) : null}
      </div>
    </div>
  )
}
