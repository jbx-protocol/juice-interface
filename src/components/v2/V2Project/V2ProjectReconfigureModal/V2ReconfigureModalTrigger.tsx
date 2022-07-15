import { Button, Tooltip } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import { Provider, useDispatch } from 'react-redux'
import store, { createStore } from 'redux/store'

import { SettingOutlined } from '@ant-design/icons'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'
import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad } from 'utils/formatNumber'

import { t } from '@lingui/macro'

import { reloadWindow } from 'utils/windowUtils'

import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/v2/splits'
import V2ProjectReconfigureModal from './index'

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.
export default function V2ReconfigureFundingModalTrigger({
  hideProjectDetails,
  triggerButton,
}: {
  hideProjectDetails?: boolean
  triggerButton?: (onClick: VoidFunction) => JSX.Element
}) {
  const dispatch = useDispatch()
  const { projectId, fundingCycle, primaryTerminal } =
    useContext(V2ProjectContext)

  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  const localStoreRef = useRef<typeof store>()

  function handleModalOpen() {
    localStoreRef.current = createStore()
    setReconfigureModalVisible(true)
  }

  function handleOk() {
    setReconfigureModalVisible(false)
    reloadWindow()
  }

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
    <div style={{ textAlign: 'right' }}>
      {triggerButton ? (
        triggerButton(handleModalOpen)
      ) : (
        <Tooltip
          title={t`Reconfigure project and funding details`}
          placement="bottom"
        >
          <Button
            onClick={handleModalOpen}
            icon={<SettingOutlined />}
            type="text"
          />
        </Tooltip>
      )}
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2ProjectReconfigureModal
            visible={reconfigureModalVisible}
            onOk={handleOk}
            onCancel={() => setReconfigureModalVisible(false)}
            hideProjectDetails={hideProjectDetails}
          />
        </Provider>
      )}
    </div>
  )
}
