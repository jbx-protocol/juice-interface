import { t, Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

export function StartOverButton() {
  const [startOverModalVisible, setStartOverModalVisible] =
    useState<boolean>(false)

  const router = useRouter()
  const dispatch = useDispatch()

  const resetV2CreateFlow = () => {
    dispatch(editingV2ProjectActions.resetState())
    router.reload()
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
        okText={t`Start over`}
        title={t`Are you sure you want to start over?`}
        onOk={resetV2CreateFlow}
        onCancel={() => setStartOverModalVisible(false)}
      >
        <Trans>
          This will reset the data for your new project. All changes will be
          lost.
        </Trans>
      </Modal>
    </>
  )
}
