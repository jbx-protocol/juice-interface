import { t } from '@lingui/macro'
import { useCallback, useContext } from 'react'
import { WizardContext } from '../Wizard/contexts'
import { useFundingCycleRecallValue, useFundingTarget } from './hooks'

type PresentableRecall = 'fundingCycles' | 'fundingTarget'

const RecallOption: React.FC<{
  option: string
  value: string
  onClick: VoidFunction
}> = ({ option, value, onClick }) => {
  return (
    <div className="flex justify-between">
      <span>
        {option}: {value}
      </span>
      <a className="underline" onClick={onClick}>
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
  if (!show.length) return null

  return (
    <div className="w-full py-3 px-4 bg-smoke-100 dark:bg-slate-600 flex flex-col gap-2 font-medium">
      {show.includes('fundingCycles') && <FundingCycleRecallOption />}
      {show.includes('fundingTarget') && <FundingTargetRecallOption />}
    </div>
  )
}
