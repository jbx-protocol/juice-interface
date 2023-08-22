import {
  DIFF_NEW_BACKGROUND,
  DIFF_OLD_BACKGROUND,
  DiffMinus,
  DiffPlus,
} from 'components/v2v3/shared/DiffedItem'
import { twMerge } from 'tailwind-merge'
import { SplitWithDiff } from 'utils/splits'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import { SplitProps } from '../SplitItem'
import { ETHAddressBeneficiary } from '../SplitItem/EthAddressBeneficiary'
import { ReservedTokensValue } from '../SplitItem/ReservedTokensValue'
import { DiffedJBProjectBeneficiary } from './DiffedSplitFields/DiffedJBProjectBeneficiary'
import { DiffedLockedUntil } from './DiffedSplitFields/DiffedLockedUntil'
import { DiffedSplitValue } from './DiffedSplitFields/DiffedSplitValue'

type DiffedSplitProps = Omit<SplitProps, 'split'> & { split: SplitWithDiff }

export function DiffedSplitItem({ props }: { props: DiffedSplitProps }) {
  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)

  const oldSplit = props.split.oldSplit
  const splitIsRemoved = oldSplit === true
  const splitIsNew = oldSplit === false

  const hasDiff = oldSplit !== undefined && !(splitIsRemoved || splitIsNew)

  const className = twMerge(
    'flex flex-wrap items-center justify-between py-1 rounded-md',
    splitIsRemoved ? DIFF_OLD_BACKGROUND : undefined,
    splitIsNew ? DIFF_NEW_BACKGROUND : undefined,
    splitIsRemoved || splitIsNew ? 'pl-3 pr-4 my-1' : undefined,
  )

  return (
    <div className={className}>
      <div>
        <div className="flex items-center">
          {splitIsRemoved ? <DiffMinus /> : null}
          {splitIsNew ? <DiffPlus /> : null}
          {isJuiceboxProject ? (
            <DiffedJBProjectBeneficiary
              split={props.split}
              oldSplit={hasDiff ? oldSplit : undefined}
            />
          ) : (
            <ETHAddressBeneficiary
              projectOwnerAddress={props.projectOwnerAddress}
              beneficaryAddress={props.split.beneficiary}
              hideAvatar
            />
          )}
        </div>

        {(props.split.lockedUntil && props.split.lockedUntil > 0) || hasDiff ? (
          <DiffedLockedUntil
            lockedUntil={props.split.lockedUntil}
            oldLockedUntil={hasDiff ? oldSplit.lockedUntil : undefined}
          />
        ) : null}
      </div>
      <div className="flex items-center whitespace-nowrap">
        <DiffedSplitValue
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
