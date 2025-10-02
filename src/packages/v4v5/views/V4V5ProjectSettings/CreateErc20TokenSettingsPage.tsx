import { Button, Form, Input } from 'antd'
import { JBChainId, createSalt, jbControllerAbi } from 'juice-sdk-core'
import { RelayrPostBundleResponse, useGetRelayrTxBundle, useJBContractContext, useSendRelayrTx, useSuckers } from 'juice-sdk-react'
import { Trans, t } from '@lingui/macro'
import { mainnet, sepolia } from 'viem/chains'
import { useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ChainSelect } from 'packages/v4v5/components/ChainSelect'
import { ContractFunctionArgs } from 'viem'
import ETHAmount from 'components/currency/ETHAmount'
import { GasIcon } from 'packages/v4v5/components/Create/components/pages/ReviewDeploy/components/LaunchProjectModal/LaunchProjectModal'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'
import { IssueErc20TokenTxArgs } from 'components/buttons/IssueErc20TokenButton'
import TransactionModal from 'components/modals/TransactionModal'
import { V4V5OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { emitErrorNotification } from 'utils/notifications'
import { useDeployOmnichainErc20 } from 'packages/v4v5/hooks/useDeployOmnichainErc20'
import { useProjectHasErc20Token } from 'packages/v4v5/hooks/useProjectHasErc20Token'
import { useV4V5IssueErc20TokenTx } from 'packages/v4v5/hooks/useV4V5IssueErc20TokenTx'
import { useV4V5WalletHasPermission } from 'packages/v4v5/hooks/useV4V5WalletHasPermission'

export function CreateErc20TokenSettingsPage() {
  const [form] = Form.useForm<IssueErc20TokenTxArgs>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>()
  const [transactionModalOpen, setTransactionModalOpen] =
    useState<boolean>(false)
  const issueErc20TokenTx = useV4V5IssueErc20TokenTx()
  const projectHasErc20Token = useProjectHasErc20Token()
  const hasIssueTicketsPermission = useV4V5WalletHasPermission(
    V4V5OperatorPermission.DEPLOY_ERC20,
  )

  const canCreateErc20Token = !projectHasErc20Token && hasIssueTicketsPermission

  const { deployOmnichainErc20 } = useDeployOmnichainErc20()
  const [txQuoteResponse, setTxQuote] = useState<RelayrPostBundleResponse>()
  const [txQuoteLoading, setTxQuoteLoading] = useState<boolean>(false)
  const [selectedGasChain, setSelectedGasChain] = useState<JBChainId>(process.env.NEXT_PUBLIC_TESTNET === 'true' ? sepolia.id : mainnet.id)
  const relayrBundle = useGetRelayrTxBundle()
  const { sendRelayrTx } = useSendRelayrTx()
  const { projectId: _singleChainProjectId } = useJBContractContext() // still used for single-chain flow
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
      emitErrorNotification(t`No chains available for multi-chain deployment`)
      return
    }
    setTxQuoteLoading(true)
    try {
      const salt = createSalt()
      const values = form.getFieldsValue()
      const deployData = suckers.reduce(
        (
          acc: Record<
            JBChainId,
            ContractFunctionArgs<typeof jbControllerAbi, 'nonpayable', 'deployERC20For'>
          >,
          { peerChainId, projectId: remoteProjectId },
        ) => {
          acc[peerChainId as keyof typeof acc] = [
            remoteProjectId,
            values.name,
            values.symbol,
            salt,
          ] as ContractFunctionArgs<
            typeof jbControllerAbi,
            'nonpayable',
            'deployERC20For'
          >
          return acc
        },
        {} as Record<
          JBChainId,
          ContractFunctionArgs<typeof jbControllerAbi, 'nonpayable', 'deployERC20For'>
        >,
      )
      const quote = await deployOmnichainErc20(deployData, chainIds)
      setTxQuote(quote!)
    } catch (e) {
      emitErrorNotification((e as Error).message)
    } finally {
      setTxQuoteLoading(false)
    }
  }

  async function onLaunchMulti() {
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
      window.location.reload()
    }
  }, [relayrBundle.isComplete])

  async function onIssueErc20FormSaved(values: IssueErc20TokenTxArgs) {
    await form.validateFields()

    if (!issueErc20TokenTx) {
      emitErrorNotification(t`ERC20 transaction not ready. Try again.`)
      return
    }

    setConfirmLoading(true)

    issueErc20TokenTx(
      { name: values.name, symbol: values.symbol },
      {
        onTransactionPending: () => {
          setConfirmLoading(true)
          setTransactionModalOpen(true)
        },
        onTransactionConfirmed: () => {
          setConfirmLoading(false)
          setTransactionModalOpen(false)
          setConfirmLoading(false)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        },
        onTransactionError: (e: Error) => {
          setConfirmLoading(false)
          setTransactionModalOpen(false)
          setConfirmLoading(false)
          emitErrorNotification(e.message)
          emitErrorNotification(
            t`Failed to create ERC20 token: ${e.message}`,
          )
        },
      },
    )
  }

  if (!canCreateErc20Token) {
    return (
      <div>
        <p>
          Token is already created or you do not have permission to create it.
        </p>
      </div>
    )
  }

  const isMultiChain = suckers && suckers.length > 1
  const txQuote = txQuoteResponse?.payment_info.find(
    p => Number(p.chain) === Number(selectedGasChain),
  )?.amount
  return (
    <>
      {isMultiChain ? (
        <p>Create an ERC-20 token on each of your project's chains, and allow your supporters to claim your project's tokens as that ERC-20 on each. This makes your tokens compatible with tools like Uniswap.</p>
      ):
      <p>{ISSUE_ERC20_EXPLANATION}</p>}
      <Form
        className="mt-5 w-full md:max-w-sm"
        form={form}
        onFinish={onIssueErc20FormSaved}
      >
        <Form.Item
          name="name"
          label={t`Token name`}
          rules={[{ required: true, message: t`Token name is required` }]}
        >
          <Input placeholder={t`Project Token`} />
        </Form.Item>
        <Form.Item
          name="symbol"
          label={t`Token ticker`}
          rules={[{ required: true, message: t`Token ticker is required` }]}
        >
          <Input
            placeholder="PRJ"
            onChange={e =>
              form.setFieldsValue({ symbol: e.target.value.toUpperCase() })
            }
          />
        </Form.Item>
      </Form>

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
                      amount={BigNumber.from(txQuote
                      )}
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
          <Button type="primary" onClick={onLaunchMulti} loading={confirmLoading || txSigning || txQuoteLoading}>
            {txQuote ? <>{<Trans>Launch ERC-20</Trans>}</> : <Trans>Get quote</Trans>}
          </Button>
        </div>
      </div>

      <TransactionModal
        transactionPending={txSigning}
        title={isMultiChain ? t`Launch Multi-Chain ERC-20` : t`Create ERC-20 Token`}
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        onOk={() => setTransactionModalOpen(false)}
        confirmLoading={confirmLoading || txSigning}
        chainIds={chainIds}
        relayrResponse={relayrBundle.response}
        centered
      />
    </>
  )
}
