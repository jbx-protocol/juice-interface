import { t } from '@lingui/macro'
import { useAppSelector } from 'hooks/AppSelector'
import { CreatePage } from 'models/create-page'
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

export const useSteps = () => {
  const { pages, currentPage, goToPage } = useContext(WizardContext)
  const { furthestPageReached } = useEditingCreateFurthestPageReached()
  const softLockedPageQueue = useAppSelector(
    state => state.editingV2Project.createSoftLockPageQueue,
  )

  const firstIndexOfLockedPage = useMemo(() => {
    const index = Object.keys(stepNames).findIndex(stepName =>
      softLockedPageQueue?.includes(stepName as CreatePage),
    )
    return index === -1 ? undefined : index
  }, [softLockedPageQueue])

  const furthertStepIndex = useMemo(() => {
    if (firstIndexOfLockedPage !== undefined) return firstIndexOfLockedPage
    return Object.keys(stepNames).indexOf(furthestPageReached)
  }, [firstIndexOfLockedPage, furthestPageReached])

  if (!pages?.length || !currentPage) {
    console.warn(
      'Steps used but no pages found. Did you forget to add WizardContext.Provider, or add pages?',
      { pages, currentPage },
    )
  }

  const steps = useMemo(
    () =>
      pages?.map((p, i) => ({
        id: p.name,
        title: stepNames[p.name],
        disabled: i > furthertStepIndex,
      })),
    [furthertStepIndex, pages],
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
