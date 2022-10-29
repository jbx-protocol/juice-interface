import { t } from '@lingui/macro'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { useCallback, useContext, useMemo } from 'react'
import { WizardContext } from '../Wizard/contexts'
import { useFundingCycleRecallValue, useFundingTarget } from './hooks'

type PresentableRecall = 'fundingCycles' | 'fundingTarget'

const RecallOption: React.FC<{
  option: string
  value: string
  onClick: VoidFunction
}> = ({ option, value, onClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>
        {option}: {value}
      </span>
      <a style={{ textDecoration: 'underline' }} onClick={onClick}>
        Edit
      </a>
    </div>
  )
}

const FundingCycleRecallOption: React.FC = () => {
  const { goToPage } = useContext(WizardContext)
  const fundingCycleRecallValue = useFundingCycleRecallValue()
  const onClick = useCallback(() => goToPage?.('fundingCycles'), [goToPage])

  if (!fundingCycleRecallValue) return null

  return (
    <RecallOption
      option={t`Funding Cycle`}
      value={fundingCycleRecallValue}
      onClick={onClick}
    />
  )
}

const FundingTargetRecallOption: React.FC = () => {
  const { goToPage } = useContext(WizardContext)
  const fundingTarget = useFundingTarget()
  const onClick = useCallback(() => goToPage?.('fundingTarget'), [goToPage])

  if (!fundingTarget) return null

  return (
    <RecallOption
      option={t`Funding Target`}
      value={fundingTarget}
      onClick={onClick}
    />
  )
}

export const RecallCard: React.FC<{
  show: PresentableRecall[]
}> = ({ show }) => {
  const { isDarkMode } = useContext(ThemeContext)

  const backgroundColor = useMemo(
    () =>
      isDarkMode
        ? styleColors.darkColors.darkGray700
        : styleColors.lightColors.warmGray100,
    [isDarkMode],
  )

  if (!show.length) return null

  return (
    <div
      style={{
        width: '100%',
        padding: '0.625rem 1rem',
        backgroundColor,
      }}
    >
      {show.includes('fundingCycles') && <FundingCycleRecallOption />}
      {show.includes('fundingTarget') && <FundingTargetRecallOption />}
    </div>
  )
}
