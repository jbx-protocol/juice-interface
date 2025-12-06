import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Button, Form, Input, Modal } from 'antd'
import { JBChainId, createSalt, jbControllerAbi } from 'juice-sdk-core'
import { RelayrPostBundleResponse, useGetRelayrTxBundle, useJBChainId, useJBContractContext, useJBProjectId, useSendRelayrTx, useSuckers } from 'juice-sdk-react'
import { Trans, t } from '@lingui/macro'
import { useRouter } from 'next/router'
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
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useV4V5WalletHasPermission } from 'packages/v4v5/hooks/useV4V5WalletHasPermission'
import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import useV4V5ProjectOwnerOf from 'packages/v4v5/hooks/useV4V5ProjectOwnerOf'
import QueueSafeDeployErc20TxsModal from './components/QueueSafeDeployErc20TxsModal'

export function CreateErc20TokenSettingsPage() {
  const [form] = Form.useForm<IssueErc20TokenTxArgs>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>()
  const [transactionModalOpen, setTransactionModalOpen] =
    useState<boolean>(false)
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false)
  const [safeModalOpen, setSafeModalOpen] = useState<boolean>(false)

  const router = useRouter()
  const chainId = useJBChainId()
  const { projectId } = useJBProjectId(chainId)
  const { version } = useV4V5Version()

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

  // Safe detection
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const { data: gnosisSafeData } = useGnosisSafe(projectOwnerAddress, Number(chainId))
  const isProjectOwnerGnosisSafe = Boolean(gnosisSafeData)

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
    // Validate form first
    try {
      await form.validateFields()
    } catch {
      return
    }

    // Check if project owner is Safe - route to Safe modal
    if (isProjectOwnerGnosisSafe) {
      setSafeModalOpen(true)
      return
    }

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
      // close modal on complete then show success
      setConfirmLoading(false)
      setTransactionModalOpen(false)
      setSuccessModalOpen(true)
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
          setSuccessModalOpen(true)
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
            {isProjectOwnerGnosisSafe ? <Trans>Launch ERC-20</Trans> : txQuote ? <Trans>Launch ERC-20</Trans> : <Trans>Get quote</Trans>}
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

      <Modal
        open={successModalOpen}
        onCancel={() => {
          setSuccessModalOpen(false)
          if (projectId && chainId) {
            router.push(`/v${version}/${router.query.jbUrn}?tabid=tokens`)
          }
        }}
        footer={null}
      >
        <div className="flex w-full flex-col items-center gap-4 pt-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-melon-100 dark:bg-melon-950">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-melon-200 dark:bg-melon-900">
              <CheckCircleIcon className="h-10 w-10 text-melon-700 dark:text-melon-500" />
            </div>
          </div>
          <div className="w-80 pt-1 text-2xl font-medium">
            <Trans>Congrats! Your ERC-20 token has been created</Trans>
          </div>
          <div className="text-secondary pb-6">
            <Trans>
              Token holders can now claim their tokens as ERC-20.
            </Trans>
          </div>
          <Button
            type="primary"
            className="w-[185px] h-12"
            onClick={() => {
              setSuccessModalOpen(false)
              if (projectId && chainId) {
                router.push(`/v${version}/${router.query.jbUrn}?tabid=tokens`)
              }
            }}
          >
            <Trans>Back to project</Trans>
          </Button>
        </div>
      </Modal>

      <QueueSafeDeployErc20TxsModal
        open={safeModalOpen}
        onCancel={() => setSafeModalOpen(false)}
        onSuccess={() => {
          setSafeModalOpen(false)
          setSuccessModalOpen(true)
        }}
        form={form}
      />
    </>
  )
}
