import { Button } from 'antd'
import { useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'

import { SettingOutlined } from '@ant-design/icons'

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
  const localStoreRef = useRef<typeof store>()

  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  function handleModalOpen() {
    localStoreRef.current = createStore()
    setReconfigureModalVisible(true)
  }

  return (
    <div style={{ textAlign: 'right' }}>
      {triggerButton ? (
        triggerButton(handleModalOpen)
      ) : (
        <Button
          onClick={handleModalOpen}
          icon={<SettingOutlined />}
          type="text"
        />
      )}
      {/* Make button and drawer instance for funding drawer */}
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2ProjectReconfigureModal
            visible={reconfigureModalVisible}
            onOk={() => setReconfigureModalVisible(false)}
            hideProjectDetails={hideProjectDetails}
          />
        </Provider>
      )}
    </div>
  )
}
