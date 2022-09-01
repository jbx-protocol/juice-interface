import { useContext, useEffect, useRef } from 'react'
import { Provider, useDispatch } from 'react-redux'
import store, { createStore } from 'redux/store'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/formatNumber'

import V2ProjectReconfigureForm from 'components/v2/V2Project/V2ProjectReconfigureForm'

import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.
export function V2ReconfigureFundingCycleSettingsPage() {
  const dispatch = useDispatch()
  const { projectId, fundingCycle, primaryTerminal } =
    useContext(V2ProjectContext)

  const localStoreRef = useRef<typeof store>()
  localStoreRef.current = createStore()

  // Load queued FC data of project
  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse ?? []

  let effectiveFundingCycle: V2FundingCycle | undefined
  // If duration is 0, use current FC (not queued)
  if (!fundingCycle?.duration || fundingCycle?.duration.eq(0)) {
    effectiveFundingCycle = fundingCycle
  } else {
    effectiveFundingCycle = queuedFundingCycle
  }

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: effectiveFundingCycle?.configuration.toString(),
    terminal: primaryTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: effectiveFundingCycle?.configuration?.toString(),
  })

  // Load queued FC data (if it exists) into redux
  useEffect(() => {
    if (queuedDistributionLimitData) {
      dispatch(
        editingV2ProjectActions.setDistributionLimit(
          fromWad(queuedDistributionLimit),
        ),
      )
      dispatch(
        editingV2ProjectActions.setDistributionLimitCurrency(
          queuedDistributionLimitCurrency.toNumber().toString(),
        ),
      )
    }
    if (effectiveFundingCycle?.duration) {
      dispatch(
        editingV2ProjectActions.setDuration(
          effectiveFundingCycle?.duration.toNumber().toString(),
        ),
      )
    }
    if (queuedPayoutSplits) {
      dispatch(editingV2ProjectActions.setPayoutSplits(queuedPayoutSplits))
    }
  }, [
    queuedDistributionLimitData,
    dispatch,
    effectiveFundingCycle,
    queuedDistributionLimit,
    queuedDistributionLimitCurrency,
    queuedPayoutSplits,
  ])

  return (
    <>
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2ProjectReconfigureForm />
        </Provider>
      )}
    </>
  )
}
