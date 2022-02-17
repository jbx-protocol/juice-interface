import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ConfirmDeployV2ProjectModal from 'components/v2/V2Create/ConfirmDeployV2ProjectModal'
import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useDeployProjectTx } from 'hooks/v2/transactor/DeployProjectTx'
import { useCallback, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'

export default function DeployProjectButton() {
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState<boolean>(false)
  const deployProjectTx = useDeployProjectTx()
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()

  const deployProject = useCallback(async () => {
    if (
      !(
        projectMetadata &&
        fundingCycleData &&
        fundingCycleMetadata &&
        fundAccessConstraints
      )
    ) {
      throw new Error('Error deploying project.')
    }

    // Upload project metadata
    const uploadedMetadata = await uploadProjectMetadata(projectMetadata)

    if (!uploadedMetadata.success) {
      console.error('Failed to upload project metadata.')
      return
    }

    deployProjectTx(
      {
        projectMetadataCID: uploadedMetadata.cid,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
      },
      {
        // onDone: () => setLoadingCreate(false),
        onConfirmed: () => {
          console.log('done!!!')
        },
      },
    )
  }, [
    deployProjectTx,
    projectMetadata,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
  ])

  return (
    <>
      <Button
        onClick={() => setDeployProjectModalVisible(true)}
        type="primary"
        disabled={!projectMetadata?.name}
      >
        <Trans>Review & Deploy</Trans>
      </Button>
      <ConfirmDeployV2ProjectModal
        visible={deployProjectModalVisible}
        onOk={deployProject}
        onCancel={() => setDeployProjectModalVisible(false)}
      />
    </>
  )
}
