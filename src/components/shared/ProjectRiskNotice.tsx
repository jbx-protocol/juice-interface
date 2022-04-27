import { useContext } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { ThemeContext } from 'contexts/themeContext'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const unsafePropertyKeys = Object.keys(
    unsafeProperties,
  ) as (keyof FundingCycleRiskFlags)[]

  const warnings = unsafePropertyKeys
    .filter(k => unsafeProperties[k] === true)
    .map(k => FUNDING_CYCLE_WARNING_TEXT()[k])

  return (
    <div style={{ backgroundColor: colors.background.l1, padding: '1rem' }}>
      <h4 style={{ color: colors.text.primary, fontWeight: 600 }}>
        <ExclamationCircleOutlined /> <Trans>Potential risks</Trans>
      </h4>
      <p style={{ color: colors.text.secondary }}>
        <Trans>
          Some properties of the project's current funding cycle may indicate
          risk for contributors.
        </Trans>
      </p>
      <ul>
        {warnings.map(text => (
          // eslint-disable-next-line react/jsx-key
          <li>{text}</li>
        ))}
      </ul>
    </div>
  )
}
