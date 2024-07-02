import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { BigNumber } from 'ethers'
import { useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'
import ReconfigureFCModal from '../modals/ReconfigureFCModal/ReconfigureFCModal'

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.
export default function ReconfigureFundingModalTrigger({
  fundingDuration,
}: {
  fundingDuration?: BigNumber
}) {
  const localStoreRef = useRef<typeof store>()

  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  function handleModalOpen() {
    localStoreRef.current = createStore()
    setReconfigureModalVisible(true)
  }

  return (
    <div className="text-right">
      <Button onClick={handleModalOpen} size="small">
        {fundingDuration?.gt(0) ? (
          <Trans>Edit upcoming cycle</Trans>
        ) : (
          <Trans>Edit cycle</Trans>
        )}
      </Button>

      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <ReconfigureFCModal
            open={reconfigureModalVisible}
            onDone={() => setReconfigureModalVisible(false)}
          />
        </Provider>
      )}
    </div>
  )
}
