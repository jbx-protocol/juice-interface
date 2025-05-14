import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Checkbox, Form } from 'antd'
import { Callout } from 'components/Callout/Callout'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/modals/TransactionModal'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { useWallet } from 'hooks/Wallet'
import { emitConfirmationDeletionModal } from 'hooks/emitConfirmationDeletionModal'
import useMobile from 'hooks/useMobile'
import { useModal } from 'hooks/useModal'
import { JBChainId } from 'juice-sdk-core'
import { useRouter } from 'next/router'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/v2v3/useEditingCreateFurthestPageReached'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { helpPagePath } from 'utils/helpPagePath'
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains'
import { useDeployProject } from '../../../hooks/DeployProject/useDeployProject'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse/CreateCollapse'
import { Wizard } from '../../Wizard/Wizard'
import { WizardContext } from '../../Wizard/contexts/WizardContext'
import { CreateChainSelectButton } from './components/CreateChainSelectButton'
import { FundingConfigurationReview } from './components/FundingConfigurationReview/FundingConfigurationReview'
import { LaunchProjectModal } from './components/LaunchProjectModal/LaunchProjectModal'
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
  const chainRef = useRef<HTMLDivElement>(null)

  useSetCreateFurthestPageReached('reviewDeploy')

  const { goToPage } = useContext(WizardContext)
  const isMobile = useMobile()
  const { isConnected, connect, chain, changeNetworks } = useWallet()
  const router = useRouter()
  const omnichainDeployModal = useModal()
  const dispatch = useDispatch()
  const { deployProject, isDeploying, deployTransactionPending } =
    useDeployProject()
  const nftRewards = useAppSelector(
    state => state.creatingV2Project.nftRewards.rewardTiers,
  )
  const selectedRelayrChains = useAppSelector(
    state => state.creatingV2Project.selectedRelayrChainIds,
  )

  const [chainError, setChainError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState<ReviewDeployKey[]>(
    !isMobile ? [ReviewDeployKey.ProjectDetails] : [],
  )

  const [form] = Form.useForm<{ termsAccepted: boolean }>()
  const termsAccepted = Form.useWatch('termsAccepted', form)
  const nftRewardsAreSet = nftRewards && nftRewards?.length > 0

  const isNextEnabled = termsAccepted

  // Set default selected chains when the component loads
  useEffect(() => {
    const isTestnet = process.env.NEXT_PUBLIC_TESTNET === 'true'
    
    // For testnet, select Sepolia
    if (isTestnet) {
      dispatch(
        creatingV2ProjectActions.setSelectedRelayrChainId({
          chainId: sepolia.id,
          selected: true,
        }),
      )
    } 
    // For mainnet, select Ethereum
    else {
      dispatch(
        creatingV2ProjectActions.setSelectedRelayrChainId({
          chainId: mainnet.id,
          selected: true,
        }),
      )
    }
  }, [dispatch])

  const handleStartOverClicked = useCallback(() => {
    router.push('/create')
    goToPage?.('projectDetails')
    dispatch(creatingV2ProjectActions.resetState())
  }, [dispatch, goToPage, router])

  const onFinish = useCallback(async () => {
    const hasChainSelected = Object.values(selectedRelayrChains).some(Boolean)
    const isSingleChainSelected =
      Object.values(selectedRelayrChains).filter(Boolean).length === 1

    if (!isConnected || !chain) {
      await connect()
      return
    }

    if (!hasChainSelected) {
      setChainError('Please select at least one chain to deploy your project.')
      chainRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    // don't use omnichain deployer when only one chain selected
    if (isSingleChainSelected) {
      const selectedChainId = parseInt(
        Object.entries(selectedRelayrChains).find(
          ([_, selected]) => selected,
        )?.[0] ?? '0',
      ) as JBChainId
      if (selectedChainId !== parseInt(chain.id)) {
        await changeNetworks(selectedChainId)
      }
      await deployProject({
        chainId: selectedChainId,
        onProjectDeployed: deployedProjectId => {
          router.push(
            {
              query: {
                projectIds: JSON.stringify([
                  { id: deployedProjectId, c: selectedChainId },
                ]),
              },
            },
            '/create',
            {
              shallow: true,
            },
          )
        },
      })
      return
    }

    // else, use omnichain
    omnichainDeployModal.open()
  }, [
    selectedRelayrChains,
    chain,
    changeNetworks,
    deployProject,
    router,
    isConnected,
    omnichainDeployModal,
    connect,
  ])

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

  const onChainSelected = useCallback(
    (chainId: JBChainId) => (selected: boolean) => {
      setChainError(null)
      dispatch(
        creatingV2ProjectActions.setSelectedRelayrChainId({
          chainId,
          selected,
        }),
      )
    },
    [dispatch],
  )

  const chainOpts =
    process.env.NEXT_PUBLIC_TESTNET === 'true'
      ? [
          <CreateChainSelectButton
            chainId={sepolia.id}
            key={sepolia.id}
            value={selectedRelayrChains[sepolia.id]}
            onChange={onChainSelected(sepolia.id)}
          />,
          <CreateChainSelectButton
            chainId={baseSepolia.id}
            key={optimismSepolia.id}
            value={selectedRelayrChains[baseSepolia.id]}
            onChange={onChainSelected(baseSepolia.id)}
          />,
          <CreateChainSelectButton
            chainId={optimismSepolia.id}
            key={optimismSepolia.id}
            value={selectedRelayrChains[optimismSepolia.id]}
            onChange={onChainSelected(optimismSepolia.id)}
          />,
          <CreateChainSelectButton
            chainId={arbitrumSepolia.id}
            key={optimismSepolia.id}
            value={selectedRelayrChains[arbitrumSepolia.id]}
            onChange={onChainSelected(arbitrumSepolia.id)}
          />,
        ]
      : [
          <CreateChainSelectButton
            chainId={mainnet.id}
            key={mainnet.id}
            value={selectedRelayrChains[mainnet.id]}
            onChange={onChainSelected(mainnet.id)}
          />,
          <CreateChainSelectButton
            chainId={base.id}
            key={base.id}
            value={selectedRelayrChains[base.id]}
            onChange={onChainSelected(base.id)}
          />,
          <CreateChainSelectButton
            chainId={optimism.id}
            key={optimism.id}
            value={selectedRelayrChains[optimism.id]}
            onChange={onChainSelected(optimism.id)}
          />,
          <CreateChainSelectButton
            chainId={arbitrum.id}
            key={arbitrum.id}
            value={selectedRelayrChains[arbitrum.id]}
            onChange={onChainSelected(arbitrum.id)}
          />,
        ]

  return (
    <>
      <div ref={chainRef}>
        <h4 className="text-xl font-medium text-black dark:text-grey-200">
          Select chains:
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          {chainOpts.map(c => c)}
        </div>
        {chainError && (
          <p className="mt-2 text-error-500 dark:text-error-400">
            {chainError}
          </p>
        )}
        <p className="mt-5 text-grey-500 dark:text-grey-300">
          Your project will be deployed on all chains selected above.
        </p>
      </div>
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
              <Trans>Rulesets & Payouts</Trans>
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
                <ExternalLink href={helpPagePath(`/v4/learn/risks`)}>
                  the risks
                </ExternalLink>
                .
              </Trans>
            </label>
          </div>
        </Callout.Info>
        <Callout.Warning className='mt-4'>
          <Trans>
            JUICEBOX V4 IS BRAND NEW. We highly recommend you talk to
            JuiceboxDAO or Juiceworks before launching your project to help make
            sure things look good. If you know what you're doing, carry on.
          </Trans>
        </Callout.Warning>
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
      <LaunchProjectModal
        open={omnichainDeployModal.visible}
        setOpen={omnichainDeployModal.close}
      />
      <TransactionModal
        open={deployTransactionPending}
        transactionPending={deployTransactionPending}
      />
    </>
  )
}
