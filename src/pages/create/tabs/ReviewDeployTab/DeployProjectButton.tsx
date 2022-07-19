import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useLaunchProjectTx } from 'hooks/v2/transactor/LaunchProjectTx'
import {
  TxNftArg,
  useLaunchProjectWithNftsTx,
} from 'hooks/v2/transactor/LaunchProjectWithNftsTx'
import { useCallback, useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { TransactionReceipt } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import { BigNumber } from '@ethersproject/bignumber'
import { NetworkContext } from 'contexts/networkContext'
import { emitErrorNotification } from 'utils/notifications'

import TransactionModal from 'components/TransactionModal'

import { useAppDispatch } from 'hooks/AppDispatch'

import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { v2ProjectRoute } from 'utils/routes'
import { TransactionEvent } from 'bnc-notify'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

const CREATE_EVENT_IDX = 0
const PROJECT_ID_TOPIC_IDX = 3

const NFT_CREATE_EVENT_IDX = 2
const NFT_PROJECT_ID_TOPIC_IDX = 1

const findTransactionReceipt = async (txHash: string) => {
  let retries = 5
  let receipt
  while (retries > 0 && !receipt) {
    receipt = await readProvider.getTransactionReceipt(txHash)
    if (receipt) break

    retries -= 1
    // wait 2s
    await new Promise(r => setTimeout(r, 2000))
    console.info('Retrying tx receipt lookup...')
  }

  return receipt
}

/**
 * Return the project ID created from a `launchProjectFor` transaction.
 * @param txReceipt receipt of `launchProjectFor` transaction
 */
const getProjectIdFromLaunchReceipt = (
  txReceipt: TransactionReceipt,
): number => {
  const projectIdHex =
    txReceipt?.logs[CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  const projectId = BigNumber.from(projectIdHex).toNumber()

  return projectId
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

export default function DeployProjectButton() {
  const launchProjectTx = useLaunchProjectTx()
  const launchProjectWithNftsTx = useLaunchProjectWithNftsTx()
  const router = useRouter()

  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const {
    projectMetadata: { name: projectName },
  } = useAppSelector(state => state.editingV2Project)

  const [deployLoading, setDeployLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const {
    projectMetadata,
    reservedTokensGroupedSplits,
    payoutGroupedSplits,
    nftRewardsCIDs,
    nftRewardTiers,
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2FundAccessConstraintsSelector()
  const dispatch = useAppDispatch()

  const deployProject = useCallback(async () => {
    setDeployLoading(true)
    if (
      !(
        projectMetadata?.name &&
        fundingCycleData &&
        fundingCycleMetadata &&
        fundAccessConstraints
      )
    ) {
      setDeployLoading(false)
      throw new Error('Error deploying project.')
    }

    // Upload project metadata
    const uploadedMetadata = await uploadProjectMetadata(projectMetadata)

    if (!uploadedMetadata.IpfsHash) {
      console.error('Failed to upload project metadata.')
      setDeployLoading(false)
      return
    }

    const hasNfts = nftRewardsCIDs && nftRewardsCIDs.length

    const txOpts = {
      onDone() {
        console.info('Transaction executed. Awaiting confirmation...')
        setTransactionPending(true)
      },
      async onConfirmed(result: TransactionEvent | undefined) {
        const txHash = result?.transaction?.hash
        if (!txHash) {
          return // TODO error notififcation
        }

        const txReceipt = await findTransactionReceipt(txHash)
        if (!txReceipt) {
          return // TODO error notififcation
        }
        console.info('Found tx receipt.')

        const projectId = hasNfts
          ? getProjectIdFromNftLaunchReceipt(txReceipt)
          : getProjectIdFromLaunchReceipt(txReceipt)
        if (projectId === undefined) {
          return // TODO error notififcation
        }

        // Reset Redux state/localstorage after deploying
        dispatch(editingV2ProjectActions.resetState())

        router.push(`${v2ProjectRoute({ projectId })}?newDeploy=true`)
      },
      onCancelled() {
        setDeployLoading(false)
        setTransactionPending(false)
      },
    }

    const handleProjectLaunchFailed = (error: string) => {
      emitErrorNotification(`Failure: ${error}`)
      setDeployLoading(false)
      setTransactionPending(false)
    }

    const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]

    let txSuccessful: boolean

    try {
      if (hasNfts && projectName) {
        // create mapping from cids -> contributionFloor
        const nftRewardsArg: TxNftArg = {}

        nftRewardsCIDs.map((cid, index) => {
          nftRewardsArg[cid] = nftRewardTiers[index].contributionFloor
        })

        txSuccessful = await launchProjectWithNftsTx(
          {
            projectName,
            projectMetadataCID: uploadedMetadata.IpfsHash,
            fundingCycleData,
            fundingCycleMetadata,
            fundAccessConstraints,
            groupedSplits,
            nftRewards: nftRewardsArg,
          },
          txOpts,
        )
      } else {
        txSuccessful = await launchProjectTx(
          {
            projectMetadataCID: uploadedMetadata.IpfsHash,
            fundingCycleData,
            fundingCycleMetadata,
            fundAccessConstraints,
            groupedSplits,
          },
          txOpts,
        )
      }
      if (!txSuccessful) {
        setDeployLoading(false)
        setTransactionPending(false)
      }
    } catch (error) {
      handleProjectLaunchFailed(error as string)
    }
  }, [
    projectName,
    launchProjectTx,
    launchProjectWithNftsTx,
    projectMetadata,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    nftRewardsCIDs,
    nftRewardTiers,
    dispatch,
    router,
  ])

  return (
    <>
      <Button
        onClick={userAddress ? deployProject : onSelectWallet}
        type="primary"
        htmlType="submit"
        size="large"
        disabled={!projectMetadata?.name}
        loading={deployLoading}
      >
        <span>
          {userAddress ? (
            <Trans>Deploy project to {readNetwork.name}</Trans>
          ) : (
            <Trans>Connect wallet to deploy</Trans>
          )}
        </span>
      </Button>
      <TransactionModal
        transactionPending={transactionPending}
        visible={transactionPending}
      />
      {/* TODO: Inside GasReaderModal, call multicall contract onConfirm */}
      {/* <GasReaderModal 
        nftTxGas={nftTxGas}
        launchTxGas={launchTxGas}
        nftRewardsCid={nftRewardsCid}
      />   */}
    </>
  )
}
