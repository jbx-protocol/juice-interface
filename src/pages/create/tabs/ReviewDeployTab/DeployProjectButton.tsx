import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useLaunchProjectTx } from 'hooks/v2/transactor/LaunchProjectTx'
import { useCallback, useContext, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { TransactionReceipt } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import { BigNumber } from '@ethersproject/bignumber'
import { NetworkContext } from 'contexts/networkContext'

import TransactionModal from 'components/TransactionModal'

import { useAppDispatch } from 'hooks/AppDispatch'

import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { v2ProjectRoute } from 'utils/routes'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

const CREATE_EVENT_IDX = 0
const PROJECT_ID_TOPIC_IDX = 3

// TODO: prepare for Tank's multicall function
// type GasOfTx = {
//   loading: boolean,
//   value: BigNumber | undefined // gas in wei
// }

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
const getProjectIdFromReceipt = (txReceipt: TransactionReceipt): number => {
  const projectIdHex =
    txReceipt?.logs[CREATE_EVENT_IDX]?.topics?.[PROJECT_ID_TOPIC_IDX]
  const projectId = BigNumber.from(projectIdHex).toNumber()

  return projectId
}

export default function DeployProjectButton() {
  const launchProjectTx = useLaunchProjectTx()
  const router = useRouter()

  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const [deployLoading, setDeployLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  // TODO: prepare for Tank's multicall function
  // const [nftTxGas, setNftTxGas] = useState<GasOfTx>({loading: false, value: undefined})
  // const [launchTxGas, setLaunchTxGas] = useState<GasOfTx>({loading: false, value: undefined})

  const {
    projectMetadata,
    reservedTokensGroupedSplits,
    payoutGroupedSplits,
    nftRewardsCid,
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

    const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]
    if (nftRewardsCid) {
      // TODO: Set loading states true of nftTxGas and launchTxGas.
      // Call gas reader for gas of nft tx and launch tx within multicall.
      // Set value and loading states of nftTxGas and launchTxGas.
      // setGasReaderModalVisible(true)
    }
    const txSuccessful = await launchProjectTx(
      {
        projectMetadataCID: uploadedMetadata.IpfsHash,
        fundingCycleData,
        fundingCycleMetadata,
        fundAccessConstraints,
        groupedSplits,
      },
      {
        onDone() {
          console.info('Transaction executed. Awaiting confirmation...')
          setTransactionPending(true)
        },
        async onConfirmed(result) {
          const txHash = result?.transaction?.hash
          if (!txHash) {
            return // TODO error notififcation
          }

          const txReceipt = await findTransactionReceipt(txHash)
          if (!txReceipt) {
            return // TODO error notififcation
          }
          console.info('Found tx receipt.')

          const projectId = getProjectIdFromReceipt(txReceipt)
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
      },
    )

    if (!txSuccessful) {
      setDeployLoading(false)
      setTransactionPending(false)
    }
  }, [
    launchProjectTx,
    projectMetadata,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
    router,
    nftRewardsCid,
    dispatch,
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
