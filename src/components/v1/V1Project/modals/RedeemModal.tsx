import { t, Trans } from '@lingui/macro'
import { Form, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import ETHAmount from 'components/currency/ETHAmount'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { RedeemAMMPrices } from 'components/Project/RedeemAMMPrices'
import { TokenAmount } from 'components/TokenAmount'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import useClaimableOverflowOf from 'hooks/v1/contractReader/useClaimableOverflowOf'
import { useRedeemRate } from 'hooks/v1/contractReader/useRedeemRate'
import useTotalBalanceOf from 'hooks/v1/contractReader/useTotalBalanceOf'
import { useRedeemTokensTx } from 'hooks/v1/transactor/useRedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { formattedNum, fromWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

// This double as the 'Redeem' and 'Burn' modal depending on if project has overflow
export default function RedeemModal({
  open,
  onOk,
  onCancel,
}: {
  open?: boolean
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { tokenSymbol, tokenAddress, currentFC, terminal, overflow } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const redeemTokensTx = useRedeemTokensTx()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)
  const { userAddress } = useWallet()
  const totalBalance = useTotalBalanceOf(userAddress, projectId, terminal?.name)
  const maxClaimable = useClaimableOverflowOf()
  const rewardAmount = useRedeemRate({
    tokenAmount: redeemAmount,
    fundingCycle: currentFC,
  })

  // 0.5% slippage for USD-denominated projects
  const minAmount = currentFC?.currency.eq(V1_CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  async function redeem() {
    await form.validateFields()
    if (!minAmount) return

    setLoading(true)

    redeemTokensTx(
      {
        redeemAmount: parseWad(redeemAmount),
        minAmount,
        preferConverted: false,
      },
      {
        onConfirmed: () => setRedeemAmount(undefined),
        onDone: () => {
          setLoading(false)
          onOk?.()
        },
      },
    )
  }

  const tokensTextLong = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })
  const tokensTextShort = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  let modalTitle: string
  // Defining whole sentence for translations
  if (overflow?.gt(0)) {
    modalTitle = t`Redeem ${tokensTextLong} for ETH`
  } else {
    modalTitle = t`Burn ${tokensTextLong}`
  }

  let buttonText: string
  // Defining whole sentence for translations
  if (overflow?.gt(0)) {
    buttonText = t`Redeem ${formattedNum(redeemAmount, {
      precision: 2,
    })} ${tokensTextShort} for ETH`
  } else {
    buttonText = t`Burn ${formattedNum(redeemAmount, {
      precision: 2,
    })} ${tokensTextShort}`
  }

  const redeemBN = parseWad(redeemAmount ?? 0)

  const validateRedeemAmount = () => {
    if (redeemBN.eq(0)) {
      return Promise.reject(t`Required`)
    } else if (redeemBN.gt(totalBalance ?? 0)) {
      return Promise.reject(t`Balance exceeded`)
    }
    return Promise.resolve()
  }

  return (
    <Modal
      title={modalTitle}
      open={open}
      confirmLoading={loading}
      onOk={() => {
        redeem()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        if (onCancel) onCancel()
      }}
      okText={buttonText}
      okButtonProps={{
        disabled: !redeemAmount || parseInt(redeemAmount) === 0,
      }}
      width={540}
      centered
    >
      <Space direction="vertical" className="w-full">
        <div>
          <p className="flex items-baseline justify-between">
            <Trans>Redemption rate:</Trans>{' '}
            <span>
              {fcMetadata?.bondingCurveRate !== undefined
                ? fcMetadata.bondingCurveRate / 2
                : '--'}
              %
            </span>
          </p>
          <p className="flex items-baseline justify-between">
            {tokenSymbolText({ tokenSymbol, capitalize: true })} balance:{' '}
            <span>
              {totalBalance ? (
                <TokenAmount
                  amountWad={totalBalance}
                  tokenSymbol={tokenSymbol}
                />
              ) : null}
            </span>
          </p>
          <p className="flex items-baseline justify-between">
            <Trans>
              Currently worth:{' '}
              <span>
                <ETHAmount amount={maxClaimable} />
              </span>
            </Trans>
          </p>
        </div>
        <p>
          {overflow?.gt(0) ? (
            <Trans>
              Project tokens can be redeemed to reclaim a portion of the ETH not
              needed for this cycle's payouts. The amount of ETH returned
              depends on this cycle's redemption rate.
              <span className="font-medium text-warning-800 dark:text-warning-100">
                Tokens are burned when they are redeemed.
              </span>
            </Trans>
          ) : (
            <Trans>
              <span className="font-medium text-warning-800 dark:text-warning-100">
                You won't receive ETH because this project has no ETH, or is
                using all of its ETH for payouts .
              </span>
            </Trans>
          )}
        </p>
        <div>
          <Form
            form={form}
            onKeyDown={e => {
              if (e.key === 'Enter') redeem()
            }}
          >
            <Form.Item
              name="redeemAmount"
              rules={[{ validator: validateRedeemAmount }]}
            >
              <FormattedNumberInput
                min={0}
                step={0.001}
                placeholder="0"
                value={redeemAmount}
                accessory={
                  <InputAccessoryButton
                    content={t`MAX`}
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                }
                disabled={totalBalance?.eq(0)}
                onChange={val => setRedeemAmount(val)}
              />
              {tokenSymbol && tokenAddress ? (
                <RedeemAMMPrices
                  className="text-xs"
                  tokenSymbol={tokenSymbol}
                  tokenAddress={tokenAddress}
                />
              ) : null}
            </Form.Item>
          </Form>
          {overflow?.gt(0) ? (
            <div className="mt-5 font-medium">
              <Trans>
                You will receive{' '}
                {currentFC?.currency.eq(V1_CURRENCY_USD) ? 'minimum ' : ' '}
                <ETHAmount amount={rewardAmount} />
              </Trans>
            </div>
          ) : null}
        </div>
      </Space>
    </Modal>
  )
}
