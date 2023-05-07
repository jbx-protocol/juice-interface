import { t, Trans } from '@lingui/macro'
import { Button, Divider, Form, Input } from 'antd'
import RichButton from 'components/buttons/RichButton'
import { useIsNftProject } from 'components/Create/hooks/DeployProject/hooks'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import UnsavedChangesModal from 'components/modals/UnsavedChangesModal'
import { FundingDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import { NftDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import { RulesDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import { TokenDrawer } from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftDeployerCanReconfigure } from 'hooks/JB721Delegate/contractReader/useNftDeployerCanReconfigure'
import { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { formatDate } from 'utils/format/formatDate'
import { useEditingFundingCycleConfig } from '../../../../../ReconfigureFundingCycleSettingsPage/hooks/useEditingFundingCycleConfig'
import { ReconfigurePreview } from '../../../../../ReconfigureFundingCycleSettingsPage/ReconfigurePreview'
import { SetNftOperatorPermissionsButton } from '../../../../../ReconfigureFundingCycleSettingsPage/SetNftOperatorPermissionsButton'
import { useLaunchFundingCycles } from './hooks/useLaunchFundingCycles'

export function LaunchFundingCycleForm() {
  const { projectOwnerAddress, fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [nftDrawerVisible, setNftDrawerVisible] = useState<boolean>(false)
  const [unsavedChangesModalVisibile, setUnsavedChangesModalVisible] =
    useState<boolean>(false)
  const [nftOperatorConfirmed, setNftOperatorConfirmed] = useState<boolean>()

  const [syncStartTime, setSyncStartTime] = useState<boolean>(true)

  const dispatch = useDispatch()
  const editingFundingCycleConfig = useEditingFundingCycleConfig()
  const { launchFundingCycleLoading, launchFundingCycle } =
    useLaunchFundingCycles({ editingFundingCycleConfig })

  const isNftFundingCycle = useIsNftProject()
  const nftDeployerCanReconfigure = useNftDeployerCanReconfigure({
    projectId,
    projectOwnerAddress,
  })

  const closeReconfigureDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setNftDrawerVisible(false)
    setRulesDrawerVisible(false)
  }
  const closeUnsavedChangesModal = () => setUnsavedChangesModalVisible(false)
  const closeUnsavedChangesModalAndExit = () => {
    closeUnsavedChangesModal()
  }

  const defaultV3StartTime = fundingCycle?.start.add(fundingCycle.duration)

  return (
    <>
      <div className="flex flex-col gap-4">
        <Form layout="vertical">
          <Form.Item
            extra={
              <Trans>
                Start the V3 cycle as soon as the current V2 cycle ends{' '}
                <strong>
                  (
                  {defaultV3StartTime
                    ? formatDate(defaultV3StartTime?.mul(1000))
                    : '--'}
                  )
                </strong>
                .
              </Trans>
            }
          >
            <JuiceSwitch
              label={t`Sync start time with current V2 funding cycle.`}
              value={syncStartTime}
              onChange={setSyncStartTime}
            />
          </Form.Item>
          {syncStartTime ? null : (
            <Form.Item
              label={<Trans>Start time</Trans>}
              extra={
                <Trans>
                  Unix timestamp in seconds. Leave blank to start immediately.
                </Trans>
              }
              className={'mt-5'}
            >
              <Input
                type="number"
                min={0}
                onChange={e => {
                  const time = e.target.value
                  dispatch(editingV2ProjectActions.setMustStartAtOrAfter(time))
                }}
              />
            </Form.Item>
          )}
        </Form>
        <RichButton
          heading={t`Funding`}
          description={t`Configure how your project will collect and spend ETH.`}
          onClick={() => setFundingDrawerVisible(true)}
        />
        <RichButton
          heading={t`Token`}
          description={t`Configure your project's token.`}
          onClick={() => setTokenDrawerVisible(true)}
        />
        <RichButton
          heading={t`NFTs (optional)`}
          description={t`Edit your project's NFTs.`}
          onClick={() => setNftDrawerVisible(true)}
        />
        <RichButton
          heading={t`Rules`}
          description={t`Edit your cycle's rules.`}
          onClick={() => setRulesDrawerVisible(true)}
        />

        <Divider />

        <h3 className="text-xl text-black dark:text-grey-100">
          <Trans>Review and deploy</Trans>
        </h3>
        <div className="mb-4">
          <ReconfigurePreview
            payoutSplits={
              editingFundingCycleConfig.editingPayoutGroupedSplits.splits
            }
            reserveSplits={
              editingFundingCycleConfig.editingReservedTokensGroupedSplits
                .splits
            }
            fundingCycleMetadata={
              editingFundingCycleConfig.editingFundingCycleMetadata
            }
            fundingCycleData={editingFundingCycleConfig.editingFundingCycleData}
            fundAccessConstraints={
              editingFundingCycleConfig.editingFundAccessConstraints
            }
            nftRewards={
              editingFundingCycleConfig.editingNftRewards?.rewardTiers
            }
            projectOwnerAddress={projectOwnerAddress}
          />
        </div>

        {isNftFundingCycle && !nftDeployerCanReconfigure ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-start">
              <span className="mr-3 text-lg">1.</span>
              <SetNftOperatorPermissionsButton
                onConfirmed={() => setNftOperatorConfirmed(true)}
                size="large"
              />
            </div>
            <div className="flex items-start">
              <span className="mr-3 text-lg">2.</span>
              <Button
                loading={launchFundingCycleLoading}
                onClick={launchFundingCycle}
                type="primary"
                disabled={!nftOperatorConfirmed}
                size="large"
              >
                <span>
                  <Trans>Launch V3 funding cycle</Trans>
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            loading={launchFundingCycleLoading}
            onClick={launchFundingCycle}
            type="primary"
            size="large"
          >
            <span>
              <Trans>Launch V3 cycle</Trans>
            </span>
          </Button>
        )}
      </div>

      <FundingDrawer
        open={fundingDrawerVisible}
        onClose={closeReconfigureDrawer}
      />
      <TokenDrawer open={tokenDrawerVisible} onClose={closeReconfigureDrawer} />
      <NftDrawer open={nftDrawerVisible} onClose={closeReconfigureDrawer} />
      <RulesDrawer open={rulesDrawerVisible} onClose={closeReconfigureDrawer} />
      <UnsavedChangesModal
        open={unsavedChangesModalVisibile}
        onOk={closeUnsavedChangesModalAndExit}
        onCancel={closeUnsavedChangesModal}
      />
    </>
  )
}
