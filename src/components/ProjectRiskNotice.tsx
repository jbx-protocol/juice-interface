import { Trans } from '@lingui/macro'

import {
  FUNDING_CYCLE_WARNING_TEXT,
  FundingCycleRiskFlags,
} from 'constants/fundingWarningText'

export default function ProjectRiskNotice({
  unsafeProperties,
}: {
  unsafeProperties: FundingCycleRiskFlags
}) {
  const unsafePropertyKeys = Object.keys(
    unsafeProperties,
  ) as (keyof FundingCycleRiskFlags)[]

  const warnings = unsafePropertyKeys
    .filter(k => unsafeProperties[k] === true)
    .map(k => FUNDING_CYCLE_WARNING_TEXT()[k])

  return (
    <div>
      <p>
        <Trans>This project's rules may pose risks for contributors:</Trans>
      </p>
      <ul className="list-disc pl-10">
        {warnings.map((text, i) => (
          <li key={i} className="mb-3">
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
