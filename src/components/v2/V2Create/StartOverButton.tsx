import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function StartOverButton() {
  const [startOverModalVisible, setStartOverModalVisible] =
    useState<boolean>(false)

  const history = useHistory()

  const resetV2CreateFlow = () => {
    history.push({
      search: '?resetForms=true',
    })
    history.go(0)
  }

  return (
    <>
      <Button
        type="default"
        onClick={() => setStartOverModalVisible(true)}
        size="large"
        style={{ marginLeft: '15px' }}
      >
        <span>
          <Trans>Start over</Trans>
        </span>
      </Button>
      <Modal
        visible={startOverModalVisible}
        okText={t`Start Over`}
        okType="danger"
        title={t`Are you sure you want to start over?`}
        onOk={resetV2CreateFlow}
        onCancel={() => setStartOverModalVisible(false)}
      >
        <Trans>
          This will erase all of your changes to every section of the project
          create flow.
        </Trans>
      </Modal>
    </>
  )
}
