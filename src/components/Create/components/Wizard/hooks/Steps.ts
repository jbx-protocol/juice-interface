import { t } from '@lingui/macro'
import { useCallback, useContext, useMemo } from 'react'
import { WizardContext } from '../contexts'

const stepNames: Record<string, string> = {
  projectDetails: t`Details`,
  fundingCycles: t`Cycles`,
  fundingTarget: t`Target`,
  payouts: t`Payouts`,
  projectToken: t`Token`,
  nftRewards: t`Rewards`,
  reconfigurationRules: t`Rules`,
  reviewDeploy: t`Deploy`,
}

export const useSteps = () => {
  const { pages, currentPage, goToPage } = useContext(WizardContext)
  if (!pages?.length || !currentPage) {
    console.warn(
      'Steps used but no pages found. Did you forget to add WizardContext.Provider, or add pages?',
      { pages, currentPage },
    )
  }

  const steps = useMemo(
    () => pages?.map(p => ({ id: p.name, title: stepNames[p.name] })),
    [pages],
  )

  const currentIndex = useMemo(
    () => pages?.findIndex(page => page.name === currentPage),
    [currentPage, pages],
  )

  const onStepClicked = useCallback(
    (index: number) => {
      if (index > (currentIndex ?? -1)) return
      goToPage?.(pages?.[index].name ?? '')
    },
    [currentIndex, goToPage, pages],
  )

  return { steps, current: { index: currentIndex }, onStepClicked }
}
