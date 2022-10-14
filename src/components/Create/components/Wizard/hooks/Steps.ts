import { t } from '@lingui/macro'
import { useCallback, useContext, useMemo } from 'react'
import { useEditingCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
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

const isStepDisabled = (stepName: string, furthestStep: string) => {
  const stepIndex = Object.keys(stepNames).indexOf(stepName)
  const furthestStepIndex = Object.keys(stepNames).indexOf(furthestStep)
  return stepIndex > furthestStepIndex
}

export const useSteps = () => {
  const { pages, currentPage, goToPage } = useContext(WizardContext)
  const { furthestPageReached } = useEditingCreateFurthestPageReached()
  const furthertStepIndex = Object.keys(stepNames).indexOf(furthestPageReached)
  if (!pages?.length || !currentPage) {
    console.warn(
      'Steps used but no pages found. Did you forget to add WizardContext.Provider, or add pages?',
      { pages, currentPage },
    )
  }

  const steps = useMemo(
    () =>
      pages?.map(p => ({
        id: p.name,
        title: stepNames[p.name],
        disabled: isStepDisabled(p.name, furthestPageReached),
      })),
    [furthestPageReached, pages],
  )

  const currentIndex = useMemo(
    () => pages?.findIndex(page => page.name === currentPage),
    [currentPage, pages],
  )

  const onStepClicked = useCallback(
    (index: number) => {
      goToPage?.(pages?.[index].name ?? '')
    },
    [goToPage, pages],
  )

  return {
    steps,
    current: { index: currentIndex },
    furthestStepReached: { index: furthertStepIndex },
    onStepClicked,
  }
}
