import { BigNumber } from '@ethersproject/bignumber'
import { TransactionReceipt } from '@ethersproject/providers'
import { Trans } from '@lingui/macro'
import { Button, FormInstance } from 'antd'
import TransactionModal from 'components/TransactionModal'
import { NEW_DEPLOY_QUERY_PARAM } from 'components/v2v3/V2V3Project/modals/NewDeployModal'
import { readNetwork } from 'constants/networks'
import { useAppDispatch } from 'hooks/AppDispatch'
import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import {
  TxNftArg,
  useLaunchProjectWithNftsTx,
} from 'hooks/v2v3/transactor/LaunchProjectWithNftsTx'
import { useWallet } from 'hooks/Wallet'
import { TransactionOptions } from 'models/transaction'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { uploadProjectMetadata } from 'utils/ipfs'
import { buildNftTxArg } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'
import { v2v3ProjectRoute } from 'utils/routes'
import { findTransactionReceipt } from './utils'

const NFT_CREATE_EVENT_IDX = 2
const NFT_PROJECT_ID_TOPIC_IDX = 1

// Projects with NFT rewards need useDataSourceForPay to be true for NFT rewards to work
export const NFT_FUNDING_CYCLE_METADATA_OVERRIDES = {
  useDataSourceForPay: true,
}

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
const getProjectIdFromNftLaunchReceipt = (
  txReceipt: TransactionReceipt,
): number => {
  const projectIdHex =
    txReceipt?.logs[NFT_CREATE_EVENT_IDX]?.topics?.[NFT_PROJECT_ID_TOPIC_IDX]
  const projectId = BigNumber.from(projectIdHex).toNumber()

  return projectId
}

export function DeployProjectWithNftsButton({ form }: { form: FormInstance }) {
  const [deployLoading, setDeployLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const router = useRouter()
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()

  const {
    projectMetadata: { name: projectName },
  } = useAppSelector(state => state.editingV2Project)
  const {
    projectMetadata,
    reservedTokensGroupedSplits,
    payoutGroupedSplits,
    nftRewards: {
      CIDs,
      rewardTiers,
      collectionMetadata: {
        name: collectionName,
        symbol: collectionSymbol,
        CID: collectionCID,
      },
      postPayModal,
    },
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()
  const dispatch = useAppDispatch()

  const launchProjectWithNftsTx = useLaunchProjectWithNftsTx()

  const deployProject = useCallback(async () => {
    if (
      !(
        projectMetadata?.name &&
        fundingCycleData &&
        fundingCycleMetadata &&
        fundAccessConstraints
      )
    ) {
      throw new Error('Error deploying project.')
    }

    setDeployLoading(true)

    // Upload project metadata
    const uploadedMetadata = await uploadProjectMetadata({
      nftPaymentSuccessModal: postPayModal,
      ...projectMetadata,
    })

    if (!uploadedMetadata.IpfsHash) {
      console.error('Failed to upload project metadata.')
      setDeployLoading(false)
      return
    }

    const txOpts: TransactionOptions = {
      onDone() {
        console.info('Transaction executed. Awaiting confirmation...')
        setTransactionPending(true)
      },
      async onConfirmed(result) {
        const txHash = result?.hash
        if (!txHash) {
          return // TODO error notififcation
        }

        const txReceipt = await findTransactionReceipt(txHash)
        if (!txReceipt) {
          return // TODO error notififcation
        }
        console.info('Found tx receipt.')

        const projectId = getProjectIdFromNftLaunchReceipt(txReceipt)

        if (projectId === undefined) {
          return // TODO error notififcation
        }

        // Reset Redux state/localstorage after deploying
        dispatch(editingV2ProjectActions.resetState())

        router.push(
          `${v2v3ProjectRoute({ projectId })}?${NEW_DEPLOY_QUERY_PARAM}=1`,
        )
      },
      onCancelled() {
        setDeployLoading(false)
        setTransactionPending(false)
      },
    }

    try {
      if (!(projectName && CIDs)) {
        throw new Error('Data missing.')
      }

      // create mapping from cids -> contributionFloor
      const nftRewardsArg: TxNftArg = buildNftTxArg({ cids: CIDs, rewardTiers })

      const txSuccessful = await launchProjectWithNftsTx(
        {
          collectionCID: collectionCID ?? '',
          collectionName: collectionName ?? projectName,
          collectionSymbol: collectionSymbol ?? '',
          projectMetadataCID: uploadedMetadata.IpfsHash,
          fundingCycleData,
          fundingCycleMetadata: {
            ...fundingCycleMetadata,
            ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
          },
          fundAccessConstraints,
          groupedSplits: [payoutGroupedSplits, reservedTokensGroupedSplits],
          nftRewards: nftRewardsArg,
        },
        txOpts,
      )

      if (!txSuccessful) {
        throw new Error('Transaction failed.')
      }
    } catch (error) {
      emitErrorNotification(`Failed to launch project: ${error}`)
      setDeployLoading(false)
      setTransactionPending(false)
    }
  }, [
    postPayModal,
    projectName,
    launchProjectWithNftsTx,
    projectMetadata,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    CIDs,
    rewardTiers,
    collectionName,
    collectionSymbol,
    collectionCID,
    dispatch,
    router,
  ])

  const onButtonClick = async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }

    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    return deployProject()
  }

  return (
    <>
      <Button
        onClick={onButtonClick}
        type="primary"
        htmlType="submit"
        size="large"
        disabled={!projectMetadata?.name}
        loading={deployLoading}
      >
        <span>
          {isConnected ? (
            <Trans>Deploy project to {readNetwork.name}</Trans>
          ) : (
            <Trans>Connect wallet to deploy</Trans>
          )}
        </span>
      </Button>
      <TransactionModal
        transactionPending={transactionPending}
        open={transactionPending}
      />
    </>
  )
}
