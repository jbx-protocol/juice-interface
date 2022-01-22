import { Button } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import React, { useContext, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'

import ReconfigureFCModal from '../modals/ReconfigureFCModal'

interface Props {}

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.

const ReconfigureFundingModalTrigger: React.FC<Props> = () => {
  const {
    projectId,
    currentFC,
    queuedFC,
    queuedPayoutMods,
    queuedTicketMods,
    currentPayoutMods,
    currentTicketMods,
    isPreviewMode,
  } = useContext(ProjectContext)

  const localStoreRef = useRef<typeof store>()

  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  function handleModalOpen() {
    localStoreRef.current = createStore()
    setReconfigureModalVisible(true)
  }

  return (
    <>
      <Button
        style={{ marginTop: 20 }}
        onClick={handleModalOpen}
        size="small"
        disabled={isPreviewMode}
      >
        Reconfigure funding
      </Button>

      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <ReconfigureFCModal
            visible={reconfigureModalVisible}
            fundingCycle={queuedFC?.number.gt(0) ? queuedFC : currentFC}
            payoutMods={
              queuedFC?.number.gt(0) ? queuedPayoutMods : currentPayoutMods
            }
            ticketMods={
              queuedFC?.number.gt(0) ? queuedTicketMods : currentTicketMods
            }
            projectId={projectId}
            onDone={() => setReconfigureModalVisible(false)}
          />
        </Provider>
      )}
    </>
  )
}

export default ReconfigureFundingModalTrigger
