import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ConfirmDeployV2ProjectModal from 'components/v2/V2Create/DeployProjectModal'
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

  const [loadingDeploy, setLoadingDeploy] = useState<boolean>()

  const { projectMetadata, reserveTokenGroupedSplits, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()

  const deployProject = useCallback(async () => {
    setLoadingDeploy(true)
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
      setLoadingDeploy(false)
      return
    }

    const groupedSplits = [payoutGroupedSplits, reserveTokenGroupedSplits]

    deployProjectTx(
      {
        projectMetadataCID: uploadedMetadata.cid,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits,
      },
      {
        onDone: () => {
          console.info('Transaction executed. Awaiting confirmation...')
        },
        onConfirmed: e => {
          console.info('Transaction confirmed:', e)
          window.location.hash = '/projects?tab=all'
        },
      },
    )
  }, [
    deployProjectTx,
    projectMetadata,
    payoutGroupedSplits,
    reserveTokenGroupedSplits,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
  ])

  return (
    <>
      <Button
        onClick={() => setDeployProjectModalVisible(true)}
        type="primary"
        htmlType="submit"
        disabled={!projectMetadata?.name}
      >
        <Trans>Review & Deploy</Trans>
      </Button>
      <ConfirmDeployV2ProjectModal
        visible={deployProjectModalVisible}
        onOk={deployProject}
        onCancel={() => setDeployProjectModalVisible(false)}
        confirmLoading={loadingDeploy}
      />
    </>
  )
}
