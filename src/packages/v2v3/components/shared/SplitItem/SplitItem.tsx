import { Split } from 'models/splits'

import { isJuiceboxProjectSplit } from 'packages/v2v3/utils/distributions'
import { ETHAddressBeneficiary } from './EthAddressBeneficiary'
import { JuiceboxProjectBeneficiary } from './JuiceboxProjectBeneficiary'
import { LockedUntilValue } from './LockedUntilValue'
import { ReservedTokensValue } from './ReservedTokensValue'
import { SplitValue } from './SplitValue'

export type SplitProps = {
  split: Split
  totalValue: bigint | undefined
  projectOwnerAddress: string | undefined
  reservedRate?: number
  valueSuffix?: string | JSX.Element
  valueFormatProps?: { precision?: number }
  currency?: bigint
  oldCurrency?: bigint
  showAmount?: boolean
  showFee?: boolean
  dontApplyFeeToAmount?: boolean
}

export function SplitItem({ props }: { props: SplitProps }) {
  const isJuiceboxProject = isJuiceboxProjectSplit(props.split)

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div>
        <div className="flex items-baseline leading-6">
          {isJuiceboxProject ? (
            <JuiceboxProjectBeneficiary split={props.split} />
          ) : (
            <ETHAddressBeneficiary
              projectOwnerAddress={props.projectOwnerAddress}
              beneficaryAddress={props.split.beneficiary}
            />
          )}
        </div>

        {props.split.lockedUntil && props.split.lockedUntil > 0 ? (
          <LockedUntilValue lockedUntil={props.split.lockedUntil} />
        ) : null}
      </div>
      <div className="flex items-center whitespace-nowrap">
        <SplitValue splitProps={props} />
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
