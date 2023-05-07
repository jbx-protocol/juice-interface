import { t, Trans } from '@lingui/macro'
import { Form, Modal, Space } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { TokenAmount } from 'components/TokenAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useV1UnclaimedBalance } from 'hooks/v1/contractReader/useV1UnclaimedBalance'
import { useUnstakeTokensTx } from 'hooks/v1/transactor/useUnstakeTokensTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function ConfirmUnstakeTokensModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol, tokenAddress } = useContext(V1ProjectContext)

  const [loading, setLoading] = useState<boolean>()
  const [unstakeAmount, setUnstakeAmount] = useState<string>()

  const { userAddress } = useWallet()
  const unclaimedBalance = useV1UnclaimedBalance({
    projectId,
    userAddress,
  })
  const unstakeTokensTx = useUnstakeTokensTx()

  useEffect(() => {
    setUnstakeAmount(fromWad(unclaimedBalance))
  }, [unclaimedBalance])

  function unstake() {
    if (
      !unstakeAmount ||
      parseWad(unstakeAmount).eq(0) // Disable claiming 0 tokens
    )
      return

    setLoading(true)

    unstakeTokensTx(
      { unstakeAmount: parseWad(unstakeAmount) },
      {
        onDone: () => setLoading(false),
        onConfirmed,
      },
    )
  }

  const ticketsIssued = Boolean(tokenAddress && !isZeroAddress(tokenAddress))

  const tokenTextPlural = tokenSymbolText({ tokenSymbol, plural: true })

  return (
    <Modal
      title={t`Claim ${tokenTextPlural} as ERC-20 tokens`}
      open={open}
      onOk={unstake}
      okText={t`Claim ${tokenTextPlural}`}
      confirmLoading={loading}
      okButtonProps={{ disabled: parseWad(unstakeAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered
    >
      <Space direction="vertical" size="large">
        {!ticketsIssued && (
          <div className="bg-smoke-100 p-2 dark:bg-slate-600">
            <Trans>
              Tokens cannot be claimed because the project owner has not issued
              an ERC-20 for this project.
            </Trans>
          </div>
        )}

        <div>
          <p>
            <Trans>
              Claiming {tokenSymbol} tokens will convert your {tokenSymbol}{' '}
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
              You can redeem your {tokenSymbol} for ETH without claiming them.
              You can transfer your unclaimed {tokenSymbol} to another address
              from the Tools menu, which can be accessed from the wrench icon in
              the upper right-hand corner of this project.
            </Trans>
          </p>
        </div>

        <div>
          <div>
            <Trans>
              <label>Your unclaimed {tokenSymbol} tokens:</label>{' '}
              {unclaimedBalance ? (
                <TokenAmount
                  amountWad={unclaimedBalance}
                  tokenSymbol={tokenSymbol}
                />
              ) : null}
            </Trans>
          </div>
          {ticketsIssued && (
            <div>
              <Trans>
                <label>{tokenSymbol} ERC-20 address:</label>{' '}
                <EthereumAddress address={tokenAddress} />
              </Trans>
            </div>
          )}
        </div>

        <Form layout="vertical">
          <Form.Item label={t`Amount of ERC-20 tokens to claim`}>
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(unclaimedBalance))}
              disabled={!ticketsIssued}
              placeholder="0"
              value={unstakeAmount}
              accessory={
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setUnstakeAmount(fromWad(unclaimedBalance))}
                />
              }
              onChange={val => setUnstakeAmount(val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
