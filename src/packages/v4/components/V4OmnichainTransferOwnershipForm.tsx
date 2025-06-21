import { Trans, t } from '@lingui/macro'
import { Button, Form, Statistic } from 'antd'
import { RelayrPostBundleResponse, useGetRelayrTxBundle, useJBContractContext, useSendRelayrTx, useSuckers } from 'juice-sdk-react'
import { useEffect, useMemo, useState } from 'react'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'
import { mainnet, sepolia } from 'viem/chains'

import { BigNumber } from '@ethersproject/bignumber'
import ETHAmount from 'components/currency/ETHAmount'
import EthereumAddress from 'components/EthereumAddress'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import TransactionModal from 'components/modals/TransactionModal'
import { JBChainId } from 'juice-sdk-core'
import { ChainSelect } from 'packages/v4/components/ChainSelect'
import { GasIcon } from 'packages/v4/components/Create/components/pages/ReviewDeploy/components/LaunchProjectModal/LaunchProjectModal'
import { useTransferOmnichainProjectOwnership } from 'packages/v4/hooks/useTransferOmnichainProjectOwnership'
import { useTransferProjectOwnershipTx } from 'packages/v4/hooks/useTransferProjectOwnershipTx'
import { Address } from 'viem'

export function V4OmnichainTransferOwnershipForm({
  ownerAddress,
}: {
  ownerAddress: string | undefined
}) {
  const [form] = Form.useForm<{ to: string }>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>()
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false)
  const [loadingTransferOwnership, setLoadingTransferOwnership] = useState<boolean>()
  
  // Single chain transfer
  const transferProjectOwnershipTx = useTransferProjectOwnershipTx()
  
  // Multi-chain transfer
  const { transferOmnichainProjectOwnership } = useTransferOmnichainProjectOwnership()
  const [txQuoteResponse, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState<boolean>(false)
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId>(process.env.NEXT_PUBLIC_TESTNET === 'true' ? sepolia.id : mainnet.id)
  const relayrBundle = useGetRelayrTxBundle()
  const { sendRelayrTx } = useSendRelayrTx()
  const { projectId } = useJBContractContext()
  const { data: suckers } = useSuckers()

  const chainIds = useMemo(
    () => suckers?.map(s => s.peerChainId) ?? [],
    [suckers]
  )

  // Add txSigning state based on relayr bundle
  const txSigning = Boolean(relayrBundle.uuid) && !relayrBundle.isComplete

  useEffect(() => {
    if (chainIds.length) setSelectedGasChain(chainIds[0])
  }, [chainIds])

  async function getMultiChainQuote() {

    if (!suckers || !suckers.length) {
      emitErrorNotification(t`No chains available for multi-chain transfer`)
      return
    }
    if (!ownerAddress || !projectId) {
      emitErrorNotification(t`Missing project owner or project ID`)
      return
    }
    
    const newOwnerAddress = form.getFieldValue('to')
    if (!newOwnerAddress) {
      emitErrorNotification(t`Please enter a recipient address`)
      return
    }

    setTxQuoteLoading(true)
    try {
      const transferData = suckers.reduce(
        (
          acc: Record<JBChainId, { from: Address, to: Address, tokenId: bigint }>,
          { peerChainId, projectId: remoteProjectId },
        ) => {
          acc[peerChainId as keyof typeof acc] = {
            from: ownerAddress as Address,
            to: newOwnerAddress as Address,
            tokenId: remoteProjectId,
          }
          return acc
        },
        {} as Record<JBChainId, { from: Address, to: Address, tokenId: bigint }>,
      )

      const quote = await transferOmnichainProjectOwnership(transferData, chainIds)
      setTxQuote(quote!)
    } catch (e) {
      console.error('❌ Error getting quote:', e)
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }

  async function onTransferMulti() {
    if (!txQuoteResponse) {
      // get quote first
      await getMultiChainQuote()
      return
    }
    
    // open pending modal
    setConfirmLoading(true)
    const payment = txQuoteResponse.payment_info.find(
      p => Number(p.chain) === Number(selectedGasChain)
    )
    if (!payment) {
      emitErrorNotification(t`No payment info for selected chain`)
      setConfirmLoading(false)
      return
    }
    try {
      await sendRelayrTx?.(payment)
      setTransactionModalOpen(true)
      relayrBundle.startPolling(txQuoteResponse.bundle_uuid)
    } catch (e) {
      console.error('❌ Error sending relayr tx:', e)
      emitErrorNotification((e as Error).message)
      setConfirmLoading(false)
      setTransactionModalOpen(false)
    }
  }

  useEffect(() => {
    if (relayrBundle.isComplete) {
      // close modal on complete then reload
      setConfirmLoading(false)
      setTransactionModalOpen(false)
      form.resetFields()
      emitInfoNotification('Project ownership transferred successfully on all chains!')
      window.location.reload()
    }
  }, [relayrBundle.isComplete, form])

  async function transferOwnership() {
    const newOwnerAddress = form.getFieldValue('to')
    if (!newOwnerAddress) {
      emitErrorNotification('Please enter a recipient address')
      return
    }

    setLoadingTransferOwnership(true)

    await transferProjectOwnershipTx(
      { newOwnerAddress },
      {
        onTransactionPending: () => {
          setTransactionModalOpen(true)
        },
        onTransactionConfirmed: () => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          form.resetFields()
          emitInfoNotification('Project ownership transferred successfully!')
        },
        onTransactionError: (error: Error) => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          emitErrorNotification(error.message)
        },
        onError: (error: Error) => {
          setLoadingTransferOwnership(false)
          setTransactionModalOpen(false)
          emitErrorNotification(error.message)
        },
        onDone: () => {
          setLoadingTransferOwnership(false)
        },
      }
    )
  }

  const isMultiChain = suckers && suckers.length > 1
  const txQuote = txQuoteResponse?.payment_info.find(
    p => Number(p.chain) === Number(selectedGasChain),
  )?.amount

  return (
    <>
      <Form form={form} layout="vertical">
        <div className="flex flex-col gap-6">
          <Statistic
            title={<Trans>Current owner</Trans>}
            valueRender={() => (
              <span>
                <EthereumAddress address={ownerAddress} />
              </span>
            )}
          />
          <div>
            <Form.Item 
              name="to" 
              label={t`Recipient address`}
              rules={[{ required: true, message: t`Recipient address is required` }]}
            >
              <EthAddressInput />
            </Form.Item>
          </div>
        </div>
      </Form>

      {isMultiChain ? (
        <>
          <p className="mt-4">
            <Trans>Transfer ownership of this project on all chains where it exists. This action will transfer ownership on each of your project's chains simultaneously.</Trans>
          </p>
          <div className="mt-8">
            <div className="mt-4 space-y-4">
              <div>
                {txQuoteLoading || txQuoteResponse ? (
                  <>
                    <span><Trans>Gas quote</Trans></span>
                    <div className="mt-2 flex items-center justify-start gap-4">
                      <div className="flex items-center gap-2">
                        <GasIcon className="h-5 w-5" />
                        {txQuote ?
                          <ETHAmount
                            amount={BigNumber.from(txQuote)}
                          />
                        : '--'}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              {txQuoteResponse ? (
                <span
                  role="button"
                  className="mb-4 text-xs underline hover:opacity-75"
                  onClick={getMultiChainQuote}
                >
                  Retry quote
                </span>
              ) : null}
              {txQuoteResponse ? (
                <div>
                  <span><Trans>Pay gas on</Trans></span>
                  <ChainSelect
                    className="mt-1 max-w-sm"
                    showTitle
                    value={selectedGasChain}
                    onChange={setSelectedGasChain}
                    chainIds={chainIds}
                  />
                </div>
              ): null}
              <Button 
                type="primary" 
                onClick={() => {
                  onTransferMulti()
                }} 
                loading={confirmLoading || txSigning || txQuoteLoading}
              >
                {txQuote ? <Trans>Transfer ownership</Trans> : <Trans>Get quote</Trans>}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <Button
            onClick={transferOwnership}
            loading={loadingTransferOwnership}
            type="primary"
          >
            <Trans>Transfer ownership</Trans>
          </Button>
        </div>
      )}

      <TransactionModal
        transactionPending={txSigning || loadingTransferOwnership}
        title={isMultiChain ? t`Transfer Multi-Chain Ownership` : t`Transfer Project Ownership`}
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        onOk={() => setTransactionModalOpen(false)}
        confirmLoading={confirmLoading || txSigning || loadingTransferOwnership}
        chainIds={chainIds}
        relayrResponse={relayrBundle.response}
        centered
      />
    </>
  )
}
