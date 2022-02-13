import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ConfirmDeployV2ProjectModal from 'components/v2/V2Create/ConfirmDeployV2ProjectModal'
import { useAppSelector } from 'hooks/AppSelector'
import { useDeployProjectTx } from 'hooks/v2/transactor/DeployProjectTx'
import { useCallback, useState } from 'react'
import * as constants from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { uploadProjectMetadata } from 'utils/ipfs'

export default function DeployProjectButton() {
  const [deployProjectModalVisible, setDeployProjectModalVisible] =
    useState<boolean>(false)
  const deployProjectTx = useDeployProjectTx()
  const { info: editingProjectInfo } = useAppSelector(
    state => state.editingV2Project,
  )

  const deployProject = useCallback(async () => {
    // Upload project metadata
    const uploadedMetadata = await uploadProjectMetadata(
      editingProjectInfo.metadata,
    )

    if (!uploadedMetadata.success) {
      console.error('Failed to upload project metadata.')
      return
    }

    const fundingCycleData = {
      duration: 0,
      weight: BigNumber.from('1' + '0'.repeat(18)), // 1,000,000 of your project's tokens will be minted per ETH received
      discountRate: 0,
      ballot: constants.AddressZero,
    }

    const fundingCycleMetadata = {
      reservedRate: 0,
      redemptionRate: 0,
      ballotRedemptionRate: 0,
      pausePay: 0,
      pauseDistributions: 0,
      pauseRedeem: 0,
      pauseMint: 0,
      pauseBurn: 0,
      allowTerminalMigration: 0,
      allowControllerMigration: 0,
      holdFees: 0,
      useLocalBalanceForRedemptions: 0,
      useDataSourceForPay: 0,
      useDataSourceForRedeem: 0,
      dataSource: constants.AddressZero,
    }

    deployProjectTx(
      {
        projectMetadataCID: uploadedMetadata.cid,
        fundingCycleData,
        fundingCycleMetadata,
      },
      {
        // onDone: () => setLoadingCreate(false),
        onConfirmed: () => {
          console.log('done!!!')
        },
      },
    )
  }, [deployProjectTx, editingProjectInfo.metadata])

  return (
    <>
      <Button
        onClick={() => setDeployProjectModalVisible(true)}
        type="primary"
        disabled={!editingProjectInfo?.metadata.name}
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
