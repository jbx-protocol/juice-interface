import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import {
  jb721TiersHookProjectDeployerAbi,
  jbControllerAbi,
} from 'juice-sdk-core'
import {
  RelayrPostBundleResponse,
  useGetRelayrTxBundle,
  useSendRelayrTx,
} from 'juice-sdk-react'
import React, { useCallback, useEffect, useState } from 'react'
import { ContractFunctionArgs, hexToBigInt } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import { JuiceModal } from 'components/modals/JuiceModal'
import { NETWORKS } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useRouter } from 'next/router'
import { ChainLogo } from 'packages/v4v5/components/ChainLogo'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { useIsNftProject } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/NFT/useIsNftProject'
import { useNftProjectLaunchData } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/NFT/useNftProjectLaunchData'
import { useUploadNftRewards } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/NFT/useUploadNftRewards'
import { useDeployOmnichainProject } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/useDeployOmnichainProject'
import { useStandardProjectLaunchData } from 'packages/v4v5/components/Create/hooks/DeployProject/hooks/useStandardProjectLaunchData'
import { getProjectIdFromLaunchReceipt } from 'packages/v4v5/hooks/useLaunchProjectTx'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { twMerge } from 'tailwind-merge'
import { emitErrorNotification } from 'utils/notifications'
import { getTransactionReceipt } from 'viem/actions'
import { useConfig } from 'wagmi'
import { OmnichainTxLoadingContent } from './OmnichainTxLoadingContent'

const JUICEBOX_DOMAIN = 'juicebox'

export const LaunchProjectModal: React.FC<{
  className?: string
  open: boolean
  setOpen: (open: boolean) => void
}> = props => {
  const router = useRouter()
  const createData = useAppSelector(state => state.creatingV2Project)

  const getStandardProjectLaunchData = useStandardProjectLaunchData()
  const getNftProjectLaunchData = useNftProjectLaunchData()
  const { deployOmnichainProject, deployOmnichainNftProject } =
    useDeployOmnichainProject()
  const relayrBundle = useGetRelayrTxBundle()
  const { sendRelayrTx, data: txData } = useSendRelayrTx()

  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId>(
    process.env.NEXT_PUBLIC_TESTNET == 'true' ? sepolia.id : mainnet.id,
  )
  const [txQuote, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState(false)
  const [txSigning, setTxSigning] = useState(false)

  const isNftProject = useIsNftProject()
  const uploadNftRewards = useUploadNftRewards()
  const dispatch = useDispatch()
  const config = useConfig()

  const txQuoteCostHex = txQuote?.payment_info.find(
    p => Number(p.chain) === Number(selectedGasChain),
  )?.amount
  const txQuoteCost = txQuoteCostHex ? hexToBigInt(txQuoteCostHex) : null
  const selectedChains = React.useMemo(() => {
    return (
      Object.entries(createData.selectedRelayrChainIds)
        .filter(c => c[1])
        .map(c => Number(c[0])) as JBChainId[]
    ).map(c => ({
      chainId: c,
      label: NETWORKS[c].label,
    }))
  }, [createData.selectedRelayrChainIds])
  const chainIds = selectedChains.map(c => c.chainId)
  const txLoading = txData && !relayrBundle.isComplete
  // bongs. re-capture nft state so that the 'succes' page doesnt bong out upon reseting the form state
  const [nftProject, setNftProject] = useState(false)

  /**
   * Fetches a quote for the omnichain transaction.
   *
   * This is step 1 of the launch process.
   * The user then needs to accept the quote and actually execute the transaction.
   */
  const getTxQuote = useCallback(async () => {
    setTxQuoteLoading(true)

    try {
      // Upload project metadata
      const cid = (
        await uploadProjectMetadata({
          ...createData.projectMetadata,
          domain: JUICEBOX_DOMAIN,
        })
      ).Hash

      let uploadedNftData:
        | {
            rewardTierCids: string[]
            nftCollectionMetadataUri: string
          }
        | undefined

      if (isNftProject) {
        setNftProject(true)
        const result = await uploadNftRewards()
        if (!result?.rewardTiers || !result?.nfCollectionMetadata) {
          emitErrorNotification('Failed to upload NFT rewards')
          return
        }
        uploadedNftData = {
          rewardTierCids: result.rewardTiers,
          nftCollectionMetadataUri: result.nfCollectionMetadata,
        }
      }

      if (isNftProject && uploadedNftData) {
        const launchData = chainIds.reduce(
          (
            acc: {
              [k in JBChainId]?: ContractFunctionArgs<
                typeof jb721TiersHookProjectDeployerAbi,
                'nonpayable',
                'launchProjectFor'
              >
            },
            chainId,
          ) => {
            const { args } = getNftProjectLaunchData({
              projectMetadataCID: cid,
              chainId,
              rewardTierCids: uploadedNftData.rewardTierCids,
              nftCollectionMetadataUri:
                uploadedNftData.nftCollectionMetadataUri,
              withStartBuffer: true,
            })

            acc[chainId] = args
            return acc
          },
          {},
        )
        const _txQuote = await deployOmnichainNftProject(launchData, chainIds)
        setTxQuote(_txQuote)
      } else {
        const launchData = chainIds.reduce(
          (
            acc: {
              [k in JBChainId]?: ContractFunctionArgs<
                typeof jbControllerAbi,
                'nonpayable',
                'launchProjectFor'
              >
            },
            chainId,
          ) => {
            const { args } = getStandardProjectLaunchData({
              projectMetadataCID: cid,
              chainId,
              withStartBuffer: true,
            })

            acc[chainId] = args
            return acc
          },
          {},
        )

        const _txQuote = await deployOmnichainProject(launchData, chainIds)
        setTxQuote(_txQuote)
      }
    } catch (error) {
      console.error(error)
      return
    } finally {
      setTxQuoteLoading(false)
    }
  }, [
    createData.projectMetadata,
    isNftProject,
    chainIds,
    getNftProjectLaunchData,
    deployOmnichainNftProject,
    getStandardProjectLaunchData,
    deployOmnichainProject,
    uploadNftRewards,
  ])

  async function onClickLaunch() {
    if (!txQuote) {
      getTxQuote()
      return
    }

    setTxSigning(true)
    const data = txQuote?.payment_info.find(
      p => Number(p.chain) === Number(selectedGasChain),
    )
    if (!data) {
      setTxSigning(false)
      return
    }

    try {
      await sendRelayrTx?.(data)
      relayrBundle.startPolling(txQuote.bundle_uuid)
    } catch (e) {
      emitErrorNotification('Failed to launch project', {
        description: (e as Error).message,
      })
    } finally {
      setTxSigning(false)
    }
  }
  useEffect(() => {
    async function doit() {
      if (relayrBundle.isComplete) {
        const txs = await Promise.all(
          relayrBundle.response.transactions.map(tx => {
            return getTransactionReceipt(
              config.getClient({ chainId: tx.request.chain }),
              // @ts-ignore
              { hash: tx.status.data.hash },
            )
          }),
        )

        const projectIds = JSON.stringify(
          relayrBundle.response.transactions.map((tx, idx) => ({
            id: getProjectIdFromLaunchReceipt(txs[idx], {
              omnichain721: nftProject,
            }),
            c: tx.request.chain,
          })),
        )

        await router.push({ query: { projectIds } }, '/create', {
          shallow: true,
        })

        dispatch(creatingV2ProjectActions.resetState())
        props.setOpen(false)
      }
    }

    doit()
  }, [
    dispatch,
    nftProject,
    config,
    relayrBundle.isComplete,
    relayrBundle.response,
    props,
    router,
    chainIds,
  ])

  return (
    <>
      <JuiceModal
        className="max-w-lg"
        title={t`Launch project`}
        okText={!txQuote ? t`Get launch quote` : t`Launch project`}
        cancelText={t`Cancel`}
        onOk={onClickLaunch}
        okLoading={txSigning || txLoading || txQuoteLoading}
        {...props}
      >
        {txLoading ? (
          <OmnichainTxLoadingContent
            relayrResponse={relayrBundle.response}
            chainIds={chainIds}
          />
        ) : (
          <div className="flex flex-col divide-y divide-grey-200 dark:divide-grey-800">
            <div className="py-6">
              <span className="flex items-center gap-3">Chains to deploy</span>
              <div className="mt-6 flex flex-col gap-6">
                {selectedChains.map(chain => (
                  <ChainIdentifier
                    key={chain.chainId}
                    chainId={chain.chainId}
                    label={chain.label}
                    state="ready"
                  />
                ))}
              </div>
            </div>
            {!txQuote ? (
              <div className="rounded-lg py-4 text-sm">
                <Callout.Info>
                  <Trans>
                    You'll be prompted a wallet signature for each of this
                    project's chains before submitting the final transaction.
                  </Trans>
                </Callout.Info>
              </div>
            ) : null}
            {txQuoteLoading || txQuoteCost ? (
              <div className="py-6">
                <div className="flex items-start gap-4 pb-3">
                  <div className="flex-1">
                    <Trans>Gas quote</Trans>

                    <div className="mt-1 flex h-12 w-full items-center justify-between rounded-lg border border-grey-100 bg-grey-50 px-3 text-grey-600 dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <GasIcon className="h-5 w-5" />
                        <div className="text-base font-medium leading-none">
                          {txQuoteLoading || !txQuoteCost ? (
                            <span>--</span>
                          ) : (
                            <ETHAmount
                              amount={BigNumber.from(txQuoteCost?.toString())}
                            />
                          )}
                        </div>
                      </div>
                      <Button type="text" className="p-0" onClick={getTxQuote}>
                        {txQuoteLoading ? (
                          <Loading size="default" />
                        ) : (
                          <ArrowPathIcon className="h-6 w-6 " />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <Trans>Pay gas on</Trans>
                    <ChainSelect
                      className="mt-1 h-12"
                      showTitle
                      value={selectedGasChain}
                      onChange={c => {
                        setSelectedGasChain(c)
                      }}
                      chainIds={chainIds}
                    />
                  </div>
                </div>
                {txQuoteLoading && (
                  <div className="text-xs text-grey-500">
                    <Trans>This sometimes takes up to a minute</Trans>
                  </div>
                )}
                <span
                  role="button"
                  className="mb-4 text-xs underline hover:opacity-75"
                  onClick={getTxQuote}
                >
                  Retry launch quote
                </span>
              </div>
            ) : null}
            <div className="h-2"></div> {/* Spacer */}
          </div>
        )}
      </JuiceModal>
    </>
  )
}

const ChainIdentifier: React.FC<{
  chainId: JBChainId
  label: string
  state: 'ready' | 'waiting' | 'deploying' | 'success' | 'error'
}> = ({ chainId, label, state }) => {
  return (
    <div
      key={chainId}
      className={twMerge(
        'flex items-center justify-between gap-5',
        state === 'waiting' && 'opacity-40',
        state === 'error' && 'text-error-500',
      )}
    >
      <div className="flex items-center gap-2">
        <ChainLogo height={24} width={24} chainId={chainId} />
        <span className="font-medium">{label}</span>
      </div>
      {state === 'waiting' ? (
        <EllipsisHorizontalIcon className="h-5 w-5" />
      ) : state === 'deploying' ? (
        <LoadingIcon className="animate-spin" />
      ) : state === 'success' ? (
        <CheckCircleIcon className="h-5 w-5 text-bluebs-500" />
      ) : state === 'error' ? (
        <ExclamationCircleIcon className="h-5 w-5 text-error-500" />
      ) : null}
    </div>
  )
}

const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5"
      stroke="#5777EB"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export const GasIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_246_7385)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.5943 0.819553C12.907 0.52015 13.4035 0.530514 13.7033 0.8427L17.0345 4.31113C17.2492 4.49787 17.4298 4.72288 17.5654 4.97555C17.724 5.24738 17.8432 5.57356 17.8432 5.94855V14.0737C17.8432 15.2855 16.8593 16.2657 15.647 16.2657C14.4342 16.2657 13.4509 15.2839 13.4509 14.0728V12.2713C13.4509 11.8388 13.0999 11.4881 12.6667 11.4881H12.3529V17.049C12.3529 17.103 12.3502 17.1565 12.3448 17.2091C12.3149 17.5033 12.2035 17.7734 12.0335 17.9965C11.747 18.3726 11.294 18.6154 10.7843 18.6154H4.50979C3.96833 18.6154 3.49095 18.3414 3.20906 17.9248C3.03993 17.6748 2.94116 17.3734 2.94116 17.049V3.73436C2.94116 2.4367 3.99461 1.38474 5.2941 1.38474H9.99999C11.2995 1.38474 12.3529 2.4367 12.3529 3.73436V9.92172H12.6667C13.9661 9.92172 15.0196 10.9737 15.0196 12.2713V14.0728C15.0196 14.4188 15.3005 14.6994 15.647 14.6994C15.9942 14.6994 16.2745 14.4191 16.2745 14.0737V8.29991C16.0292 8.3865 15.7652 8.43361 15.4902 8.43361C14.1907 8.43361 13.1373 7.38165 13.1373 6.08398C13.1373 5.13522 13.7003 4.31778 14.511 3.94682L12.5712 1.92694C12.2714 1.61475 12.2818 1.11895 12.5943 0.819553ZM15.9685 5.46322C15.8361 5.36136 15.6702 5.30078 15.4902 5.30078C15.057 5.30078 14.7059 5.65143 14.7059 6.08398C14.7059 6.51654 15.057 6.8672 15.4902 6.8672C15.9234 6.8672 16.2745 6.51654 16.2745 6.08398C16.2745 5.95941 16.2454 5.84162 16.1935 5.73705C16.1414 5.65459 16.0666 5.56369 15.9685 5.46322ZM5.2941 11.5664C4.86094 11.5664 4.50979 11.9171 4.50979 12.3496C4.50979 12.7822 4.86094 13.1329 5.2941 13.1329H9.99999C10.4332 13.1329 10.7843 12.7822 10.7843 12.3496C10.7843 11.9171 10.4332 11.5664 9.99999 11.5664H5.2941ZM5.2941 14.6992C4.86094 14.6992 4.50979 15.0499 4.50979 15.4825C4.50979 15.9151 4.86094 16.2656 5.2941 16.2656H9.99999C10.4332 16.2656 10.7843 15.9151 10.7843 15.4825C10.7843 15.0499 10.4332 14.6992 9.99999 14.6992H5.2941Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_246_7385">
          <rect
            width="20"
            height="18.797"
            fill="white"
            transform="translate(0 0.601501)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
