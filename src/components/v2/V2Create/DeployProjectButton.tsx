import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ConfirmDeployV2ProjectModal from 'components/shared/modals/ConfirmDeployV2ProjectModal'
import { useAppSelector } from 'hooks/AppSelector'
import { useDeployProjectTx } from 'hooks/v2/transactor/DeployProjectTx'
import { useCallback, useState } from 'react'

export default function DeployProjectButton() {
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState<boolean>(false)
  const deployProjectTx = useDeployProjectTx()
  const { info: editingProjectInfo } = useAppSelector(
    state => state.editingV2Project,
  )

  const deployProject = useCallback(async () => {
    deployProjectTx(
      {
        handle: editingProjectInfo.handle,
      },
      {
        // onDone: () => setLoadingCreate(false),
        onConfirmed: () => {
          console.log('done!!!')
        },
      },
    )
  }, [deployProjectTx, editingProjectInfo.handle])

  return (
    <>
      <Button
        onClick={() => setDeployProjectModalVisible(true)}
        type="primary"

        // disabled={
        //   !editingProjectInfo?.metadata.name || !editingProjectInfo.handle
        // }
      >
        <Trans>Review & Deploy</Trans>
      </Button>
      <ConfirmDeployV2ProjectModal
        visible={deployProjectModalVisible}
        onOk={deployProject}
        onCancel={() => setDeployProjectModalVisible(false)}
        // terminalFee={terminalFee}
      />
    </>
  )
}
