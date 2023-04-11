import { Trans } from '@lingui/macro'

import {
  FundingCycleRiskFlags, FUNDING_CYCLE_WARNING_TEXT
} from 'constants/fundingWarningText'

export default function ProjectRiskNotice({
  unsafeProperties,
}: {
  unsafeProperties: FundingCycleRiskFlags | undefined
}) {
  const unsafePropertyKeys = unsafeProperties
    ? (Object.keys(unsafeProperties) as (keyof FundingCycleRiskFlags)[])
    : undefined

  const warnings =
    unsafePropertyKeys && unsafeProperties
      ? unsafePropertyKeys
          .filter(k => unsafeProperties[k] === true)
          .map(k => FUNDING_CYCLE_WARNING_TEXT()[k])
      : undefined

  return (
    <div>
      <p>
        <Trans>This project's rules may pose risks for contributors:</Trans>
      </p>
      <ul className="list-disc pl-10">
        {warnings?.map((text, i) => (
          <li key={i} className="mb-3">
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
