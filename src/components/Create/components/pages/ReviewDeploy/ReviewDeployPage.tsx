import { CheckCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Modal } from 'antd'
import { Callout } from 'components/Callout'
import { useDeployProject } from 'components/Create/hooks/DeployProject'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/TransactionModal'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import { WizardContext } from '../../Wizard/contexts'
import {
  FundingConfigurationReview,
  ProjectDetailsReview,
  ProjectTokenReview,
  RewardsReview,
  RulesReview,
} from './components'

enum ReviewDeployKey {
  ProjectDetails = 0,
  FundingConfiguration = 1,
  ProjectToken = 2,
  Rewards = 3,
  Rules = 4,
}

const Header: React.FC<{ skipped?: boolean }> = ({
  children,
  skipped = false,
}) => {
  return (
    <h2 className="mb-0 flex items-center gap-2 text-lg font-medium text-black dark:text-grey-200">
      {children}
      {skipped ? (
        <span>
          <CreateBadge.Skipped />
        </span>
      ) : (
        <CheckCircleFilled className="text-haze-400" />
      )}
    </h2>
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
  const modal = useModal()
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
    modal.close()
    dispatch(editingV2ProjectActions.resetState())
  }, [dispatch, goToPage, modal, router])

  const onFinish = useCallback(async () => {
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    await deployProject({
      onProjectDeployed: deployedProjectId =>
        router.push({ query: { deployedProjectId } }, '/create', {
          shallow: true,
        }),
    })
  }, [
    chainUnsupported,
    changeNetworks,
    connect,
    deployProject,
    isConnected,
    router,
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
              <Trans>Funding Configuration</Trans>
            </Header>
          }
        >
          <FundingConfigurationReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={ReviewDeployKey.ProjectToken}
          header={
            <Header>
              <Trans>Project Token</Trans>
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
              <Trans>Rules</Trans>
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
            <div>
              <Trans>
                I have read and accept the{' '}
                <ExternalLink href={TERMS_OF_SERVICE_URL}>
                  Terms of Service
                </ExternalLink>
                , and understand that any changes I make to my project's funding
                cycle will not be applied until AFTER Funding Cycle #1 has
                finished.
              </Trans>
            </div>
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
            Not quite ready to launch? Your project details will be saved as a
            'draft' as long as you don't clear your browser's data.
          </Trans>
        </div>
        <span>
          <Trans>Made a mistake?</Trans>{' '}
          <a onClick={modal.open}>
            <Trans>Start over</Trans>
          </a>
          .
        </span>
      </div>
      <TransactionModal
        transactionPending={deployTransactionPending}
        open={deployTransactionPending}
      />
      <Modal
        title={
          <h2 className="text-xl font-medium text-black dark:text-grey-200">
            <Trans>Are you sure?</Trans>
          </h2>
        }
        okText={t`Yes, start over`}
        cancelText={t`No, keep editing`}
        open={modal.visible}
        onOk={handleStartOverClicked}
        onCancel={modal.close}
      >
        <Trans>Starting over will erase all currently saved progress.</Trans>
      </Modal>
    </>
  )
}
