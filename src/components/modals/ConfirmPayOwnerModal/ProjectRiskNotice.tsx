import { ProjectContext } from 'contexts/projectContext'
import { useContext } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  fundingCycleRiskCount,
  getUnsafeFundingCycleProperties,
} from 'utils/fundingCycle'

import { ThemeContext } from 'contexts/themeContext'

import {
  FundingCycleRiskFlags,
  FUNDING_CYCLE_WARNING_TEXT,
} from 'constants/fundingWarningText'

export default function ProjectRiskNotice() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { currentFC } = useContext(ProjectContext)
  if (!currentFC || fundingCycleRiskCount(currentFC) === 0) return null

  const unsafeProperties = getUnsafeFundingCycleProperties(currentFC)
  const unsafePropertyKeys = Object.keys(
    unsafeProperties,
  ) as (keyof FundingCycleRiskFlags)[]

  const warnings = unsafePropertyKeys
    .filter(k => unsafeProperties[k] === true)
    .map(k => FUNDING_CYCLE_WARNING_TEXT(currentFC)[k])

  return (
    <div style={{ backgroundColor: colors.background.l1, padding: '1rem' }}>
      <h4 style={{ color: colors.text.primary, fontWeight: 600 }}>
        <ExclamationCircleOutlined /> Potential risks
      </h4>
      <p style={{ color: colors.text.secondary }}>
        Some properties of the project's current funding cycle may indicate risk
        for contributors.
      </p>
      <ul>
        {warnings.map(text => (
          <li>{text}</li>
        ))}
      </ul>
    </div>
  )
}
