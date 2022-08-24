import { Button, Tooltip } from 'antd'
import { useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'

import { SettingOutlined } from '@ant-design/icons'

import { t } from '@lingui/macro'

import { reloadWindow } from 'utils/windowUtils'

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
