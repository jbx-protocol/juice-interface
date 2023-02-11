import { t, Trans } from '@lingui/macro'
import { Divider, Form, Input, Space } from 'antd'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import RichButton, { RichButtonProps } from 'components/buttons/RichButton'
import { FundingDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import NftDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { RulesDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import { TokenDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { CV_V3 } from 'constants/cv'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/NftDeployerCanReconfigure'
import { useContext, useState } from 'react'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { DeployConfigurationButton } from './DeployConfigurationButton'
import { useEditingFundingCycleConfig } from './hooks/editingFundingCycleConfig'
import { useFundingHasSavedChanges } from './hooks/fundingHasSavedChanges'
import { useInitialEditingData } from './hooks/initialEditingData'
import { useReconfigureFundingCycle } from './hooks/reconfigureFundingCycle'
import ReconfigurePreview from './ReconfigurePreview'
import V2V3ReconfigureUpcomingMessage from './ReconfigureUpcomingMessage'
import { SetNftOperatorPermissionsButton } from './SetNftOperatorPermissionsButton'
import { formatDate } from 'utils/format/formatDate'
import { useAppDispatch } from 'redux/hooks/AppDispatch'

function ReconfigureButton({
  reconfigureHasChanges,
  ...props
}: {
  reconfigureHasChanges: boolean
} & RichButtonProps) {
  return (
    <RichButton
      {...props}
      className={
        reconfigureHasChanges
          ? 'border-2 border-solid border-haze-400 dark:border dark:border-haze-400'
          : ''
      }
    />
  )
}

export function V2V3ReconfigureFundingCycleForm() {
  const { fundingCycleMetadata, projectOwnerAddress } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { cv } = useContext(V2V3ContractsContext)
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
  const dispatch = useAppDispatch()

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

  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)

  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  const nftsWithFalseDataSourceForPay = Boolean(
    nftRewardsCids?.length && !fundingCycleMetadata?.useDataSourceForPay,
  )

  const isV3 = cv === CV_V3

  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  return (
    <>
      <Space direction="vertical" size="middle" className="w-full">
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
        <ReconfigureButton
          heading={t`Rules`}
          description={t`Configure restrictions for your funding cycles.`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges}
          onClick={() => setRulesDrawerVisible(true)}
        />
        {isV3 ? (
          <ReconfigureButton
            heading={t`NFTs (optional)`}
            description={t`Configure your project's NFTs.`}
            reconfigureHasChanges={nftDrawerHasSavedChanges}
            onClick={() => setNftDrawerVisible(true)}
          />
        ) : null}

        <Form layout="vertical">
          <Form.Item
            label={t`Memo`}
            className={'antd-no-number-handler'}
            extra={t`Add a note about this reconfiguration on-chain.`}
            requiredMark="optional"
          >
            <MemoFormInput value={memo} onChange={setMemo} />
          </Form.Item>
          <Form.Item
            label={<Trans>Start time</Trans>}
            extra={
              <Trans>
                Unix timestamp in seconds (for example,{' '}
                {Math.floor(Date.now() / 1000)}). Leave blank to start as soon
                as possible.
              </Trans>
            }
            required={false}
            requiredMark="optional"
          >
            <Input
              type="number"
              min={0}
              onChange={e => {
                const time = `${e.target.value}`
                dispatch(editingV2ProjectActions.setMustStartAtOrAfter(time))
              }}
              addonAfter={
                <span className="text-grey-500 dark:text-slate-100">
                  {editingFundingCycleConfig?.editingMustStartAtOrAfter !==
                  DEFAULT_MUST_START_AT_OR_AFTER
                    ? formatDate(
                        parseInt(
                          editingFundingCycleConfig.editingMustStartAtOrAfter,
                        ) * 1000,
                      )
                    : null}
                </span>
              }
            />
          </Form.Item>
        </Form>

        <Divider />

        <h3 className="text-xl text-black dark:text-grey-100">
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
          projectOwnerAddress={projectOwnerAddress}
          mustStartAtOrAfter={
            editingFundingCycleConfig.editingMustStartAtOrAfter
          }
        />

        {nftDrawerHasSavedChanges && !nftDeployerCanReconfigure ? (
          <Space className="mt-4" size="middle" direction="vertical">
            <div className="flex">
              <span className="mr-1">1.</span>
              <SetNftOperatorPermissionsButton
                onConfirmed={() => setNftOperatorConfirmed(true)}
              />
            </div>
            <div className="flex">
              <span className="mr-1">2.</span>
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
