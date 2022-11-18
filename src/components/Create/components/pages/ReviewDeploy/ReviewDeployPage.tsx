import { CheckCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Modal } from 'antd'
import { useDeployProject } from 'components/Create/hooks/DeployProject'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/TransactionModal'
import { ThemeContext } from 'contexts/themeContext'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { useModal } from 'hooks/Modal'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { CreateBadge } from '../../CreateBadge'
import { CreateCallout } from '../../CreateCallout'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: 0,
      }}
    >
      {children}
      {skipped ? (
        <span>
          <CreateBadge.Skipped />
        </span>
      ) : (
        <CheckCircleFilled
          style={{ color: colors.background.action.primary }}
        />
      )}
    </h2>
  )
}

export const ReviewDeployPage = () => {
  useSetCreateFurthestPageReached('reviewDeploy')
  const isMobile = useMobile()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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
    dispatch(editingV2ProjectActions.resetState())
    window.location.reload()
  }, [dispatch])

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
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CreateCallout.Info noIcon collapsible={false}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Form.Item noStyle name="termsAccepted" valuePropName="checked">
              <Checkbox />
            </Form.Item>
            <div>
              <Trans>
                I have read and accept the{' '}
                <ExternalLink href="https://info.juicebox.money/tos/">
                  Terms of Service
                </ExternalLink>
                , and understand that any changes I make to my project's funding
                cycle will not be applied until AFTER Funding Cycle #1 has
                finished.
              </Trans>
            </div>
          </div>
        </CreateCallout.Info>
        <Wizard.Page.ButtonControl
          isNextLoading={isDeploying}
          isNextEnabled={isNextEnabled}
        />
      </Form>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          paddingTop: '4.5rem',
          color: colors.text.tertiary,
        }}
      >
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
          <h2>
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
