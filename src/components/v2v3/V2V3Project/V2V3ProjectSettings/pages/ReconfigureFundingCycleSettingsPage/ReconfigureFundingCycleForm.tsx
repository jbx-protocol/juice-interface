import { getAddress } from '@ethersproject/address'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import RichButton, { RichButtonProps } from 'components/RichButton'
import FundingDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import NftDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import RulesDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { CV_V3 } from 'constants/cv'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2HasPermissions } from 'hooks/v2v3/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext, useState } from 'react'
import { DeployConfigurationButton } from './DeployConfigurationButton'
import { useEditingFundingCycleConfig } from './hooks/editingFundingCycleConfig'
import { useFundingHasSavedChanges } from './hooks/fundingHasSavedChanges'
import { useInitialEditingData } from './hooks/initialEditingData'
import { useReconfigureFundingCycle } from './hooks/reconfigureFundingCycle'
import ReconfigurePreview from './ReconfigurePreview'
import V2V3ReconfigureUpcomingMessage from './ReconfigureUpcomingMessage'
import { SetNftOperatorPermissionsButton } from './SetNftOperatorPermissionsButton'

function ReconfigureButton({
  reconfigureHasChanges,
  ...props
}: {
  reconfigureHasChanges: boolean
} & RichButtonProps) {
  const { colors } = useContext(ThemeContext).theme

  return (
    <RichButton
      {...props}
      buttonStyle={{
        border: reconfigureHasChanges
          ? '1px solid ' + colors.stroke.action.primary
          : undefined,
      }}
    />
  )
}

export function V2V3ReconfigureFundingCycleForm() {
  const { fundingCycleMetadata, projectOwnerAddress } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts, cv } = useContext(V2V3ContractsContext)
  const {
    nftRewards: { CIDs: nftRewardsCids },
  } = useContext(NftRewardsContext)

  const [memo, setMemo] = useState('')
  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [nftDrawerVisible, setNftDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)
  const [nftOperatorConfirmed, setNftOperatorConfirmed] = useState<boolean>()

  const { initialEditingData } = useInitialEditingData({ visible: true })
  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const {
    fundingHasSavedChanges,
    fundingDrawerHasSavedChanges,
    tokenDrawerHasSavedChanges,
    rulesDrawerHasSavedChanges,
    nftDrawerHasSavedChanges,
  } = useFundingHasSavedChanges({
    editingFundingCycleConfig,
    initialEditingData,
  })

  const { reconfigureLoading, reconfigureFundingCycle } =
    useReconfigureFundingCycle({
      editingFundingCycleConfig,
      memo,
      launchedNewNfts: nftDrawerHasSavedChanges,
    })

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
    setNftDrawerVisible(false)
  }

  // const openUnsavedChangesModal = () => setUnsavedChangesModalVisible(true)
  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)

  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  // TODO: unsaved changes
  // const handleGlobalModalClose = useCallback(() => {
  //   openUnsavedChangesModal()
  // }, [])

  const nftsWithFalseDataSourceForPay = Boolean(
    nftRewardsCids?.length && !fundingCycleMetadata?.useDataSourceForPay,
  )

  const isV3 = cv === CV_V3

  const nftDeployerAddress = contracts?.JBTiered721DelegateProjectDeployer
    ? getAddress(contracts.JBTiered721DelegateProjectDeployer.address)
    : undefined
  const { data: nftContractHasPermission } = contracts
    ? useV2HasPermissions({
        operator: nftDeployerAddress,
        account: projectOwnerAddress,
        domain: projectId,
        permissions: [V2OperatorPermission.RECONFIGURE],
      })
    : { data: undefined }

  return (
    <>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <V2V3ReconfigureUpcomingMessage />

        <ReconfigureButton
          heading={t`Funding`}
          description={t`Configure how your project will collect and spend funds.`}
          reconfigureHasChanges={fundingDrawerHasSavedChanges}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          heading={t`Token`}
          description={t`Configure your project's token.`}
          reconfigureHasChanges={tokenDrawerHasSavedChanges}
          onClick={() => setTokenDrawerVisible(true)}
        />
        {isV3 ? (
          <ReconfigureButton
            heading={t`NFTs`}
            description={t`Configure your project's NFTs.`}
            reconfigureHasChanges={nftDrawerHasSavedChanges}
            onClick={() => setNftDrawerVisible(true)}
          />
        ) : null}
        <ReconfigureButton
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges}
          onClick={() => setRulesDrawerVisible(true)}
        />

        <Form layout="vertical">
          <Form.Item
            name="memo"
            label={t`Memo (optional)`}
            className={'antd-no-number-handler'}
            extra={t`Add an on-chain memo to this reconfiguration.`}
          >
            <MemoFormInput value={memo} onChange={setMemo} />
          </Form.Item>
        </Form>

        <h3 className="text-primary" style={{ fontSize: '1.2rem' }}>
          <Trans>Review and deploy</Trans>
        </h3>
        <ReconfigurePreview
          payoutSplits={
            editingFundingCycleConfig.editingPayoutGroupedSplits.splits
          }
          reserveSplits={
            editingFundingCycleConfig.editingReservedTokensGroupedSplits.splits
          }
          fundingCycleMetadata={
            editingFundingCycleConfig.editingFundingCycleMetadata
          }
          fundingCycleData={editingFundingCycleConfig.editingFundingCycleData}
          fundAccessConstraints={
            editingFundingCycleConfig.editingFundAccessConstraints
          }
          nftRewards={editingFundingCycleConfig.editingNftRewards?.rewardTiers}
        />
        {nftDrawerHasSavedChanges && !nftContractHasPermission ? (
          <Space size="middle" direction="vertical">
            <div style={{ display: 'flex' }}>
              <h2 style={{ marginRight: 5 }}>1.</h2>
              <SetNftOperatorPermissionsButton
                onConfirmed={() => setNftOperatorConfirmed(true)}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <h2 style={{ marginRight: 5 }}>2.</h2>
              <DeployConfigurationButton
                loading={reconfigureLoading}
                onClick={reconfigureFundingCycle}
                disabled={
                  (!fundingHasSavedChanges || !nftOperatorConfirmed) &&
                  !nftsWithFalseDataSourceForPay
                }
              />
            </div>
          </Space>
        ) : (
          <DeployConfigurationButton
            loading={reconfigureLoading}
            onClick={reconfigureFundingCycle}
            disabled={!fundingHasSavedChanges && !nftsWithFalseDataSourceForPay}
          />
        )}
      </Space>

      <FundingDrawer
        open={fundingDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <TokenDrawer open={tokenDrawerVisible} onClose={closeReconfigureDrawer} />
      <RulesDrawer open={rulesDrawerVisible} onClose={closeReconfigureDrawer} />
      <NftDrawer open={nftDrawerVisible} onClose={closeReconfigureDrawer} />

      <UnsavedChangesModal
        open={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </>
  )
}
