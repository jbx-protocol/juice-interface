import { Button, Tooltip } from 'antd'
import { ProjectContext } from 'contexts/projectContext'
import React, { useContext, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import { Trans } from '@lingui/macro'

import ReconfigureFCModal from '../modals/ReconfigureFCModal'

interface Props {}

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.

const ReconfigureFundingModalTrigger: React.FC<Props> = () => {
  const { isPreviewMode } = useContext(ProjectContext)

  const localStoreRef = useRef<typeof store>()

  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  function handleModalOpen() {
    localStoreRef.current = createStore()
    setReconfigureModalVisible(true)
  }

  return (
    <div style={{ textAlign: 'right' }}>
      <Tooltip
        title={
          <span>
            <b>Note:</b> The current funding cycle cannot be edited.
          </span>
        }
      >
        <Button onClick={handleModalOpen} size="small" disabled={isPreviewMode}>
          <Trans>Reconfigure upcoming</Trans>
        </Button>
      </Tooltip>

      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <ReconfigureFCModal
            visible={reconfigureModalVisible}
            onDone={() => setReconfigureModalVisible(false)}
          />
        </Provider>
      )}
    </div>
  )
}

export default ReconfigureFundingModalTrigger
