import { Checkbox, Form } from 'antd'
import {
  jb721TiersHookProjectDeployerAbi,
  jbControllerAbi,
} from 'juice-sdk-core'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
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

import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Callout } from 'components/Callout/Callout'
import ExternalLink from 'components/ExternalLink'
import TransactionModal from 'components/modals/TransactionModal'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { emitConfirmationDeletionModal } from 'hooks/emitConfirmationDeletionModal'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import useMobile from 'hooks/useMobile'
import { useModal } from 'hooks/useModal'
import { useWallet } from 'hooks/Wallet'
import { JBChainId } from 'juice-sdk-core'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useRouter } from 'next/router'
import QueueSafeLaunchProjectTxsModal from 'packages/v4v5/components/QueueSafeTxsModal/QueueSafeLaunchProjectTxsModal'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/v2v3/useEditingCreateFurthestPageReached'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { helpPagePath } from 'utils/helpPagePath'
import { emitErrorNotification } from 'utils/notifications'
import { ContractFunctionArgs } from 'viem'
import { useIsNftProject } from '../../../hooks/DeployProject/hooks/NFT/useIsNftProject'
import { useNftProjectLaunchData } from '../../../hooks/DeployProject/hooks/NFT/useNftProjectLaunchData'
import { useUploadNftRewards } from '../../../hooks/DeployProject/hooks/NFT/useUploadNftRewards'
import { useStandardProjectLaunchData } from '../../../hooks/DeployProject/hooks/useStandardProjectLaunchData'
import { useDeployProject } from '../../../hooks/DeployProject/useDeployProject'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse/CreateCollapse'
import { WizardContext } from '../../Wizard/contexts/WizardContext'
import { Wizard } from '../../Wizard/Wizard'
import { CreateChainSelectButton } from './components/CreateChainSelectButton'
import { FundingConfigurationReview } from './components/FundingConfigurationReview/FundingConfigurationReview'
import { LaunchProjectModal } from './components/LaunchProjectModal/LaunchProjectModal'
import { ProjectDetailsReview } from './components/ProjectDetailsReview/ProjectDetailsReview'
import { ProjectTokenReview } from './components/ProjectTokenReview/ProjectTokenReview'
import { RewardsReview } from './components/RewardsReview/RewardsReview'
import { RulesReview } from './components/RulesReview/RulesReview'
import { SaveCreateStateToFile } from './SaveCreateStateToFile'

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
  const { isConnected, connect, chain, changeNetworks, userAddress } =
    useWallet()
  const router = useRouter()
  const omnichainDeployModal = useModal()
  const dispatch = useDispatch()
  const { deployProject, isDeploying, deployTransactionPending } =
    useDeployProject()

  // Project data hooks
  const createData = useAppSelector(state => state.creatingV2Project)
  const isNftProject = useIsNftProject()
  const uploadNftRewards = useUploadNftRewards()
  const getStandardProjectLaunchData = useStandardProjectLaunchData()
  const getNftProjectLaunchData = useNftProjectLaunchData()

  // Safe detection - check if project owner is a Safe
  const projectOwner = createData.inputProjectOwner || userAddress
  const { data: gnosisSafeData } = useGnosisSafe(projectOwner)
  const isProjectOwnerSafe = Boolean(gnosisSafeData)

  // State
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

  // Safe queue modal state
  const [showSafeQueueModal, setShowSafeQueueModal] = useState(false)
  const [metadataLoading, setMetadataLoading] = useState(false)
  const [projectMetadataCid, setProjectMetadataCid] = useState<string>()
  const [uploadedNftData, setUploadedNftData] = useState<{
    rewardTierCids: string[]
    nftCollectionMetadataUri: string
  }>()
  const [standardProjectLaunchData, setStandardProjectLaunchData] = useState<{
    [k in JBChainId]?: ContractFunctionArgs<
      typeof jbControllerAbi,
      'nonpayable',
      'launchProjectFor'
    >
  }>()
  const [nftProjectLaunchData, setNftProjectLaunchData] = useState<{
    [k in JBChainId]?: ContractFunctionArgs<
      typeof jb721TiersHookProjectDeployerAbi,
      'nonpayable',
      'launchProjectFor'
    >
  }>()

  const [form] = Form.useForm<{ termsAccepted: boolean }>()
  const termsAccepted = Form.useWatch('termsAccepted', form)
  const nftRewardsAreSet = nftRewards && nftRewards?.length > 0

  const isNextEnabled = termsAccepted && !metadataLoading

  // Metadata upload function
  const uploadMetadata = useCallback(async () => {
    if (projectMetadataCid) {
      return { projectMetadataCid, uploadedNftData }
    }

    setMetadataLoading(true)
    try {
      const cid = (
        await uploadProjectMetadata({
          ...createData.projectMetadata,
          domain: 'juicebox',
        })
      ).Hash
      setProjectMetadataCid(cid)

      let nftData: typeof uploadedNftData
      if (isNftProject) {
        const result = await uploadNftRewards()
        if (!result?.rewardTiers || !result?.nfCollectionMetadata) {
          emitErrorNotification('Failed to upload NFT rewards')
          return null
        }
        nftData = {
          rewardTierCids: result.rewardTiers,
          nftCollectionMetadataUri: result.nfCollectionMetadata,
        }
        setUploadedNftData(nftData)
      }

      // Generate launch data for all selected chains
      const selectedChainIds = Object.entries(selectedRelayrChains)
        .filter(([_, selected]) => selected)
        .map(([chainId, _]) => parseInt(chainId) as JBChainId)

      if (isNftProject && nftData) {
        // Generate NFT project launch data for each chain
        const nftLaunchData = selectedChainIds.reduce(
          (acc, chainId) => {
            const { args } = getNftProjectLaunchData({
              projectMetadataCID: cid,
              chainId,
              rewardTierCids: nftData.rewardTierCids,
              nftCollectionMetadataUri: nftData.nftCollectionMetadataUri,
              withStartBuffer: true,
            })
            acc[chainId] = args
            return acc
          },
          {} as {
            [k in JBChainId]?: ContractFunctionArgs<
              typeof jb721TiersHookProjectDeployerAbi,
              'nonpayable',
              'launchProjectFor'
            >
          },
        )
        setNftProjectLaunchData(nftLaunchData)
      } else {
        // Generate standard project launch data for each chain
        const standardLaunchData = selectedChainIds.reduce(
          (acc, chainId) => {
            const { args } = getStandardProjectLaunchData({
              projectMetadataCID: cid,
              chainId,
              withStartBuffer: true,
            })
            acc[chainId] = args
            return acc
          },
          {} as {
            [k in JBChainId]?: ContractFunctionArgs<
              typeof jbControllerAbi,
              'nonpayable',
              'launchProjectFor'
            >
          },
        )
        setStandardProjectLaunchData(standardLaunchData)
      }

      return { projectMetadataCid: cid, uploadedNftData: nftData }
    } catch (error) {
      console.error('Failed to upload metadata:', error)
      emitErrorNotification('Failed to upload project metadata')
      return null
    } finally {
      setMetadataLoading(false)
    }
  }, [
    projectMetadataCid,
    uploadedNftData,
    createData.projectMetadata,
    isNftProject,
    uploadNftRewards,
    selectedRelayrChains,
    getNftProjectLaunchData,
    getStandardProjectLaunchData,
  ])

  // Safe queue success handler
  const handleSafeQueueSuccess = useCallback(async () => {
    const chainIds = Object.entries(selectedRelayrChains)
      .filter(([_, selected]) => selected)
      .map(([chainId, _]) => parseInt(chainId))

    await router.push(
      { query: { safeQueued: 'true', chains: chainIds.join(',') } },
      '/create',
      {
        shallow: true,
      },
    )

    dispatch(creatingV2ProjectActions.resetState())
    setShowSafeQueueModal(false)
  }, [router, selectedRelayrChains, dispatch])

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
    const isMultiChainSelected =
      Object.values(selectedRelayrChains).filter(Boolean).length > 1

    if (!isConnected || !chain) {
      await connect()
      return
    }

    if (!hasChainSelected) {
      setChainError('Please select at least one chain to deploy your project.')
      chainRef.current?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    // For Safe wallets with multiple chains, use the Safe queue flow
    // DISABLED FOR NOW, NOT COMPLETE
    if (isProjectOwnerSafe && isMultiChainSelected && false) {
      const uploadResult = await uploadMetadata()
      if (!uploadResult) {
        return
      }
      setShowSafeQueueModal(true)
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

    // else, use omnichain (for non-Safe multi-chain deployments)
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
    isProjectOwnerSafe,
    uploadMetadata,
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
              <Trans>Rulesets & Funds</Trans>
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
        <Callout.Warning className="mt-4">
          <Trans>
            JUICEBOX V5 IS BRAND NEW. We highly recommend you talk to
            JuiceboxDAO or Juiceworks before launching your project to help make
            sure things look good. If you know what you're doing, carry on.
          </Trans>
        </Callout.Warning>
        <Wizard.Page.ButtonControl
          isNextLoading={isDeploying || metadataLoading}
          isNextEnabled={isNextEnabled}
        />
      </Form>

      <div className="flex flex-col gap-4 pt-20 text-grey-400 dark:text-slate-200">
        <div>
          <Trans>
            Not ready? Your project will be saved as a 'draft' as long as you
            don't clear your browser's data. You can also save to a file below.
          </Trans>
        </div>
        <div className="flex items-center gap-2">
          <SaveCreateStateToFile />
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

      {/* Safe Queue Modal for multi-chain Safe launches */}
      {showSafeQueueModal &&
        projectMetadataCid &&
        projectOwner &&
        gnosisSafeData && (
          <QueueSafeLaunchProjectTxsModal
            open={showSafeQueueModal}
            onCancel={() => setShowSafeQueueModal(false)}
            onComplete={handleSafeQueueSuccess}
            launchData={{
              projectMetadataCID: projectMetadataCid,
              isNftProject: !!isNftProject,
              nftData: uploadedNftData
                ? {
                    rewardTierCids: uploadedNftData.rewardTierCids,
                    nftCollectionMetadataUri:
                      uploadedNftData.nftCollectionMetadataUri,
                  }
                : undefined,
              standardProjectData: standardProjectLaunchData,
              nftProjectData: nftProjectLaunchData,
            }}
            chains={Object.entries(selectedRelayrChains)
              .filter(([_, selected]) => selected)
              .map(([chainId, _]) => parseInt(chainId) as JBChainId)}
            safeAddress={projectOwner}
          />
        )}

      <TransactionModal
        open={deployTransactionPending}
        transactionPending={deployTransactionPending}
      />
    </>
  )
}
