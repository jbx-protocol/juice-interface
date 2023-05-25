import { WarningOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Form } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { TokenAmount } from 'components/TokenAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useUnclaimedTokenBalance } from 'hooks/v2v3/contractReader/useUnclaimedTokenBalance'
import { useClaimTokensTx } from 'hooks/v2v3/transactor/useClaimTokensTx'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useWallet } from 'hooks/Wallet'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function V2V3ClaimTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol, tokenAddress } = useContext(V2V3ProjectContext)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [claimAmount, setClaimAmount] = useState<string>()

  const { userAddress } = useWallet()
  const claimTokensTx = useClaimTokensTx()
  const hasIssuedTokens = useProjectHasErc20()
  const { data: unclaimedBalance } = useUnclaimedTokenBalance({
    projectId,
    userAddress,
  })

  useLayoutEffect(() => {
    setClaimAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  const executeClaimTokensTx = async () => {
    if (
      !claimAmount ||
      parseWad(claimAmount).eq(0) // Disable claiming 0 tokens
    )
      return

    setLoading(true)

    const txSuccess = await claimTokensTx(
      { claimAmount: parseWad(claimAmount) },
      {
        onDone: () => {
          setTransactionPending(true)
          setLoading(false)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          onConfirmed?.()
        },
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const tokenTextLong = tokenSymbolText({
    tokenSymbol,
    plural: true,
    includeTokenWord: true,
  })

  const tokenTextShort = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  return (
    <TransactionModal
      title={t`Claim ${tokenTextShort} as ERC-20 tokens`}
      connectWalletText={t`Connect wallet to claim`}
      open={open}
      onOk={executeClaimTokensTx}
      okText={t`Claim ${tokenTextShort}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
      okButtonProps={{ disabled: parseWad(claimAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered
    >
      <div className="flex flex-col gap-6">
        {!hasIssuedTokens && (
          <div className="bg-smoke-100 p-2 dark:bg-slate-600">
            <WarningOutlined />{' '}
            <Trans>
              Tokens cannot be claimed because the project owner has not issued
              an ERC-20 for this project.
            </Trans>
          </div>
        )}

        <div>
          <p>
            <Trans>
              Claiming {tokenTextLong} will convert your {tokenTextShort}{' '}
              balance to ERC-20 tokens and mint them to your wallet.
            </Trans>
          </p>
          <p className="font-medium">
            <Trans>
              If you're not sure if you need to claim, you probably don't.
            </Trans>
          </p>
          <p>
            <Trans>
              You can redeem your {tokenTextLong} for ETH without claiming them.
              You can transfer your unclaimed {tokenTextLong} to another address
              from the Tools menu, which can be accessed from the wrench icon in
              the upper right-hand corner of this project.
            </Trans>
          </p>
        </div>

        <Descriptions size="small" layout="horizontal" column={1}>
          <Descriptions.Item
            label={<Trans>Your unclaimed {tokenTextLong}</Trans>}
          >
            <TokenAmount amountWad={unclaimedBalance ?? BigNumber.from(0)} />
          </Descriptions.Item>

          {hasIssuedTokens && tokenSymbol && (
            <Descriptions.Item
              label={<Trans>{tokenSymbol} ERC-20 address</Trans>}
            >
              <EthereumAddress address={tokenAddress} />
            </Descriptions.Item>
          )}
        </Descriptions>

        <Form layout="vertical">
          <Form.Item label={t`Amount of ERC-20 tokens to claim`}>
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(unclaimedBalance))}
              disabled={!hasIssuedTokens}
              placeholder="0"
              value={claimAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setClaimAmount(fromWad(unclaimedBalance))}
                />
              }
              onChange={val => setClaimAmount(val)}
            />
          </Form.Item>
        </Form>
      </div>
    </TransactionModal>
  )
}
