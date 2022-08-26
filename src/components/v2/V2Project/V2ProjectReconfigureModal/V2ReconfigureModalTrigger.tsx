import { Button, Tooltip } from 'antd'
import { useContext, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'

import { SettingOutlined } from '@ant-design/icons'

import { t } from '@lingui/macro'

import { reloadWindow } from 'utils/windowUtils'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useRouter } from 'next/router'
import { pushSettingsContent } from 'utils/routes'
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
  const router = useRouter()
  const { projectId } = useContext(V2ProjectContext)
  const [reconfigureModalVisible, setReconfigureModalVisible] =
    useState<boolean>(false)

  const localStoreRef = useRef<typeof store>()

  function handleReconfigureClick() {
    pushSettingsContent(router, 'reconfigurefc', projectId)
  }

  function handleOk() {
    setReconfigureModalVisible(false)
    reloadWindow()
  }

  return (
    <div style={{ textAlign: 'right' }}>
      {triggerButton ? (
        triggerButton(handleReconfigureClick)
      ) : (
        <Tooltip
          title={t`Reconfigure project and funding details`}
          placement="bottom"
        >
          <Button
            onClick={handleReconfigureClick}
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
