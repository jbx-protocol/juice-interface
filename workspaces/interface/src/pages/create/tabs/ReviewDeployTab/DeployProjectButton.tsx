import { BigNumber } from '@ethersproject/bignumber'
import { TransactionReceipt } from '@ethersproject/providers'
import { Button, FormInstance } from 'antd'
import { DeployButtonText } from 'components/DeployProjectButtonText'
import {
  useAppSelector,
  useEditingV2FundAccessConstraintsSelector,
  useEditingV2FundingCycleDataSelector,
  useEditingV2FundingCycleMetadataSelector,
} from 'hooks/AppSelector'
import { useLaunchProjectTx } from 'hooks/v2/transactor/LaunchProjectTx'
import { useWallet } from 'hooks/Wallet'
import { useCallback, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { emitErrorNotification } from 'utils/notifications'

import TransactionModal from 'components/TransactionModal'

import { useAppDispatch } from 'hooks/AppDispatch'

import { useRouter } from 'next/router'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { v2ProjectRoute } from 'utils/routes'

import { findTransactionReceipt } from './utils'

const CREATE_EVENT_IDX = 0
const PROJECT_ID_TOPIC_IDX = 3

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

export function DeployProjectButton({ form }: { form: FormInstance }) {
  const launchProjectTx = useLaunchProjectTx()
  const router = useRouter()

  const { changeNetworks, chainUnsupported, isConnected, connect } = useWallet()

  const [deployLoading, setDeployLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const { projectMetadata, reservedTokensGroupedSplits, payoutGroupedSplits } =
    useAppSelector(state => state.editingV2Project)
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

    try {
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
    } catch (error) {
      emitErrorNotification(`Failure: ${error}`)
      setDeployLoading(false)
      setTransactionPending(false)
    }
  }, [
    projectMetadata,
    fundingCycleData,
    fundingCycleMetadata,
    fundAccessConstraints,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    launchProjectTx,
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
          <DeployButtonText />
        </span>
      </Button>
      <TransactionModal
        transactionPending={transactionPending}
        visible={transactionPending}
      />
    </>
  )
}
