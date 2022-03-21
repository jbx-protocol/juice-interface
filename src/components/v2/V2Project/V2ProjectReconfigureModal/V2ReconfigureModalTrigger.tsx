import { Button } from 'antd'
import { useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store, { createStore } from 'redux/store'

import { BigNumber } from '@ethersproject/bignumber'

import { SettingOutlined } from '@ant-design/icons'

import V2ProjectReconfigureModal from './index'

// This component uses a local version of the entire Redux store
// so editing within the Reconfigure Funding modal does not
// conflict with existing Redux state. This is so editing a
// persisted Redux state and the Reconfigure Funding modal
// are independent.
export default function V2ReconfigureFundingModalTrigger({
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
    <div style={{ textAlign: 'right' }}>
      {/* {fundingDuration?.gt(0) ? (
        <Tooltip
          title={
            <span>
              <Trans>
                <b>Note:</b> The current funding cycle cannot be edited.
              </Trans>
            </span>
          }
        >
          <Button
            onClick={handleModalOpen}
            size="large"
            disabled={isPreviewMode}
          >
            <Trans>Reconfigure</Trans>
          </Button>
        </Tooltip>
      ) : (
        <Button onClick={handleModalOpen} size="small" disabled={isPreviewMode}>
          <Trans>Reconfigure</Trans>
        </Button>
      )} */}
      <Button
        onClick={handleModalOpen}
        icon={<SettingOutlined />}
        type="text"
      />
      {/* Make button and drawer instance for funding drawer */}
      {localStoreRef.current && (
        <Provider store={localStoreRef.current}>
          <V2ProjectReconfigureModal
            visible={reconfigureModalVisible}
            onOk={() => setReconfigureModalVisible(false)}
          />
        </Provider>
      )}
    </div>
  )
}
