import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Checkbox, Form } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useDeployProject } from 'components/Create/hooks/DeployProject/useDeployProject'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/modals/TransactionModal'
import { emitConfirmationDeletionModal } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/modals'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { useWallet } from 'hooks/Wallet'
import useMobile from 'hooks/useMobile'
import { useModal } from 'hooks/useModal'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { helpPagePath } from 'utils/routes'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse/CreateCollapse'
import { Wizard } from '../../Wizard/Wizard'
import { WizardContext } from '../../Wizard/contexts/WizardContext'
import { FundingConfigurationReview } from './components/FundingConfigurationReview/FundingConfigurationReview'
import { ProjectDetailsReview } from './components/ProjectDetailsReview/ProjectDetailsReview'
import { ProjectTokenReview } from './components/ProjectTokenReview/ProjectTokenReview'
import { RewardsReview } from './components/RewardsReview/RewardsReview'
import { RulesReview } from './components/RulesReview/RulesReview'

enum ReviewDeployKey {
  ProjectDetails = 0,
  FundingConfiguration = 1,
  ProjectToken = 2,
  Rewards = 3,
  Rules = 4,
}

const Header: React.FC<React.PropsWithChildren<{ skipped?: boolean }>> = ({
  children,
  skipped = false,
}) => {
  return (
    <h4 className="mb-0 flex items-center gap-2 text-xl font-medium text-black dark:text-grey-200">
      {children}
      {skipped ? (
        <div className="flex">
          <CreateBadge.Skipped />
        </div>
      ) : (
        <CheckCircleFilled className="text-bluebs-500" />
      )}
    </h4>
  )
}

export const ReviewDeployPage = () => {
  useSetCreateFurthestPageReached('reviewDeploy')
  const { goToPage } = useContext(WizardContext)
  const isMobile = useMobile()
  const { chainUnsupported, changeNetworks, isConnected, connect } = useWallet()
  const router = useRouter()
  const [form] = Form.useForm<{ termsAccepted: boolean }>()
  const termsAccepted = Form.useWatch('termsAccepted', form)
  const transactionModal = useModal()
  const { deployProject, isDeploying, deployTransactionPending } =
    useDeployProject()
  const nftRewards = useAppSelector(
    state => state.editingV2Project.nftRewards.rewardTiers,
  )

  const nftRewardsAreSet = useMemo(
    () => nftRewards && nftRewards?.length > 0,
    [nftRewards],
  )

  const dispatch = useDispatch()

  const handleStartOverClicked = useCallback(() => {
    router.push('/create')
    goToPage?.('projectDetails')
    dispatch(editingV2ProjectActions.resetState())
  }, [dispatch, goToPage, router])

  const onFinish = useCallback(async () => {
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    transactionModal.open()
    await deployProject({
      onProjectDeployed: deployedProjectId => {
        router.push({ query: { deployedProjectId } }, '/create', {
          shallow: true,
        })
        transactionModal.close()
      },
    })
  }, [
    chainUnsupported,
    changeNetworks,
    connect,
    deployProject,
    isConnected,
    router,
    transactionModal,
  ])

  const [activeKey, setActiveKey] = useState<ReviewDeployKey[]>(
    !isMobile ? [ReviewDeployKey.ProjectDetails] : [],
  )

  const handleOnChange = (key: string | string[]) => {
    if (typeof key === 'string') {
      setActiveKey([parseInt(key)])
    } else {
      setActiveKey(key.map(k => parseInt(k)))
    }
  }

  // Remove the nft rewards panel if there are no nft rewards
  useEffect(() => {
    if (!nftRewardsAreSet) {
      setActiveKey(activeKey.filter(k => k !== ReviewDeployKey.Rewards))
    }
    // Only run this effect when the nft rewards are set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftRewardsAreSet])

  const isNextEnabled = termsAccepted
  return (
    <>
      <CreateCollapse activeKey={activeKey} onChange={handleOnChange}>
        <CreateCollapse.Panel
          key={ReviewDeployKey.ProjectDetails}
          header={
            <Header>
              <Trans>Project Details</Trans>
            </Header>
          }
        >
          <ProjectDetailsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={ReviewDeployKey.FundingConfiguration}
          header={
            <Header>
              <Trans>Cycles & Payouts</Trans>
            </Header>
          }
        >
          <FundingConfigurationReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={ReviewDeployKey.ProjectToken}
          header={
            <Header>
              <Trans>Token</Trans>
            </Header>
          }
        >
          <ProjectTokenReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={ReviewDeployKey.Rewards}
          collapsible={nftRewardsAreSet ? 'header' : 'disabled'}
          header={
            <Header skipped={!nftRewardsAreSet}>
              <Trans>NFTs</Trans>
            </Header>
          }
        >
          <RewardsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={ReviewDeployKey.Rules}
          header={
            <Header>
              <Trans>Other Rules</Trans>
            </Header>
          }
        >
          <RulesReview />
        </CreateCollapse.Panel>
      </CreateCollapse>
      <Form
        form={form}
        initialValues={{ termsAccepted: false }}
        onFinish={onFinish}
        className="mt-8 flex flex-col"
      >
        <Callout.Info noIcon collapsible={false}>
          <div className="flex gap-4">
            <Form.Item noStyle name="termsAccepted" valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <label htmlFor="termsAccepted">
              <Trans>
                I have read and accept the{' '}
                <ExternalLink href={TERMS_OF_SERVICE_URL}>
                  Terms of Service
                </ExternalLink>{' '}
                and{' '}
                <ExternalLink href={helpPagePath(`/dev/learn/risks`)}>
                  the risks
                </ExternalLink>
                .
              </Trans>
            </label>
          </div>
        </Callout.Info>
        <Wizard.Page.ButtonControl
          isNextLoading={isDeploying}
          isNextEnabled={isNextEnabled}
        />
      </Form>

      <div className="flex flex-col gap-4 pt-20 text-grey-400 dark:text-slate-200">
        <div>
          <Trans>
            Not ready? Your project will be saved as a 'draft' as long as you
            don't clear your browser's data.
          </Trans>
        </div>
        <span>
          <Trans>Made a mistake?</Trans>{' '}
          <a
            onClick={() =>
              emitConfirmationDeletionModal({
                description: (
                  <Trans>
                    Starting over will erase all currently saved progress.
                  </Trans>
                ),
                okText: <Trans>Yes, start over</Trans>,
                cancelText: <Trans>No, keep editing</Trans>,
                onConfirm: handleStartOverClicked,
              })
            }
          >
            <Trans>Start over</Trans>
          </a>
          .
        </span>
      </div>
      <TransactionModal
        transactionPending={deployTransactionPending}
        open={deployTransactionPending && transactionModal.visible}
        onCancel={transactionModal.close}
      />
    </>
  )
}
