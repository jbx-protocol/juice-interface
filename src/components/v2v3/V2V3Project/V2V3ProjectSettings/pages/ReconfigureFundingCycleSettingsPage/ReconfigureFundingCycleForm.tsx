import { t, Trans } from '@lingui/macro'
import { Divider, Form, Input } from 'antd'
import RichButton, { RichButtonProps } from 'components/buttons/RichButton'
import { Callout } from 'components/Callout'
import ExternalLink from 'components/ExternalLink'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { MemoFormInput } from 'components/Project/PayProjectForm/MemoFormInput'
import TooltipIcon from 'components/TooltipIcon'
import { FundingDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import { NftDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { RulesDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import { TokenDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { CV_V3 } from 'constants/cv'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useContext, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import {
  DEFAULT_MUST_START_AT_OR_AFTER,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'
import { formatDate } from 'utils/format/formatDate'
import { DeployConfigurationButton } from './DeployConfigurationButton'
import { useEditingFundingCycleConfig } from './hooks/useEditingFundingCycleConfig'
import { useFundingHasSavedChanges } from './hooks/useFundingHasSavedChanges'
import { useInitialEditingData } from './hooks/useInitialEditingData'
import { useReconfigureFundingCycle } from './hooks/useReconfigureFundingCycle'
import { ReconfigurePreview } from './ReconfigurePreview'
import V2V3ReconfigureUpcomingMessage from './ReconfigureUpcomingMessage'
import { SetNftOperatorPermissionsButton } from './SetNftOperatorPermissionsButton'

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
          ? 'border-2 border-bluebs-500 dark:border dark:border-bluebs-500'
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

  const dispatch = useAppDispatch()
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
  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
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

  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)

  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  const nftsWithFalseDataSourceForPay = Boolean(
    nftRewardsCids?.length && !fundingCycleMetadata?.useDataSourceForPay,
  )

  const isV3 = cv === CV_V3

  return (
    <>
      <div className="flex flex-col gap-4">
        <V2V3ReconfigureUpcomingMessage />

        <ReconfigureButton
          heading={t`Funding`}
          description={t`How your project will be paid and pay out ETH.`}
          reconfigureHasChanges={fundingDrawerHasSavedChanges}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <ReconfigureButton
          heading={t`Token`}
          description={t`Your project's token.`}
          reconfigureHasChanges={tokenDrawerHasSavedChanges}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <ReconfigureButton
          heading={t`Rules`}
          description={t`Restrictions for your cycles.`}
          reconfigureHasChanges={rulesDrawerHasSavedChanges}
          onClick={() => setRulesDrawerVisible(true)}
        />
        {isV3 ? (
          <ReconfigureButton
            heading={t`NFTs (optional)`}
            description={t`Your project's NFTs.`}
            reconfigureHasChanges={nftDrawerHasSavedChanges}
            onClick={() => setNftDrawerVisible(true)}
          />
        ) : null}

        <Form layout="vertical" className="mt-5">
          <Form.Item
            label={t`Memo`}
            className={'antd-no-number-handler'}
            extra={t`Add an on-chain note about this cycle.`}
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
            className="mb-0"
          >
            <Input
              type="number"
              min={0}
              onChange={e => {
                const val = e.target.value
                const time = `${val.length ? val : 0}`
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
          <Trans>Review reconfiguration</Trans>
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
          mustStartAtOrAfter={
            editingFundingCycleConfig.editingMustStartAtOrAfter
          }
        />

        {nftDrawerHasSavedChanges && !nftDeployerCanReconfigure ? (
          <div className="mt-4 flex flex-col gap-4">
            <Callout.Info>
              <Trans>
                You're about to add NFTs to your cycle. You'll need to{' '}
                <strong>grant NFT permissions</strong> before deploying the new
                cycle
              </Trans>{' '}
              <TooltipIcon
                tip={
                  <Trans>
                    Allow the{' '}
                    <ExternalLink
                      href={`https://github.com/jbx-protocol/juice-721-delegate/blob/main/contracts/JBTiered721DelegateDeployer.sol`}
                    >
                      Juicebox NFT deployer contract
                    </ExternalLink>{' '}
                    to edit this project's cycle.
                  </Trans>
                }
              />
            </Callout.Info>
            <div>
              <SetNftOperatorPermissionsButton
                onConfirmed={() => setNftOperatorConfirmed(true)}
              />
            </div>
            <div>
              <DeployConfigurationButton
                loading={reconfigureLoading}
                onClick={reconfigureFundingCycle}
                disabled={
                  (!fundingHasSavedChanges || !nftOperatorConfirmed) &&
                  !nftsWithFalseDataSourceForPay
                }
              />
            </div>
          </div>
        ) : (
          <DeployConfigurationButton
            className="max-w-fit"
            loading={reconfigureLoading}
            onClick={reconfigureFundingCycle}
            disabled={!fundingHasSavedChanges && !nftsWithFalseDataSourceForPay}
          />
        )}
      </div>

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
