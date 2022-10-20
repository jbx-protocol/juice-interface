import { CheckCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Modal } from 'antd'
import Callout from 'components/Callout'
import { useDeployProject } from 'components/Create/hooks/DeployProject'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/TransactionModal'
import { ThemeContext } from 'contexts/themeContext'
import { useModal } from 'hooks/Modal'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useCallback, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import {
  FundingConfigurationReview,
  ProjectDetailsReview,
  ProjectTokenReview,
  RewardsReview,
  RulesReview,
} from './components'

const Header: React.FC = ({ children }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {children}
      <CheckCircleFilled style={{ color: colors.background.action.primary }} />
    </h2>
  )
}

export const ReviewDeployPage = () => {
  useSetCreateFurthestPageReached('reviewDeploy')
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

  const isNextEnabled = termsAccepted
  return (
    <>
      <CreateCollapse accordion defaultActiveKey={0}>
        <CreateCollapse.Panel
          key={0}
          header={
            <Header>
              <Trans>Project Details</Trans>
            </Header>
          }
        >
          <ProjectDetailsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={1}
          header={
            <Header>
              <Trans>Funding Configuration</Trans>
            </Header>
          }
        >
          <FundingConfigurationReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={2}
          header={
            <Header>
              <Trans>Project Token</Trans>
            </Header>
          }
        >
          <ProjectTokenReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={3}
          header={
            <Header>
              <Trans>NFT Rewards</Trans>
            </Header>
          }
        >
          <RewardsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={4}
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
      >
        <Callout iconComponent={null}>
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
                , and understand that I CANNOT make changes to my project's
                funding configuration until AFTER Funding Cycle #1 has finished.
              </Trans>
            </div>
          </div>
        </Callout>
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
        visible={deployTransactionPending}
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
