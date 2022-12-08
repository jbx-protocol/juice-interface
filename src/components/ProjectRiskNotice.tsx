import { Trans } from '@lingui/macro'

import {
  FundingCycleRiskFlags,
  FUNDING_CYCLE_WARNING_TEXT,
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
        <Trans>
          This project's current funding cycle configuration may pose risks for
          contributors:
        </Trans>
      </p>
      <ul>
        {warnings.map((text, i) => (
          <li key={i} className="mb-3">
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
