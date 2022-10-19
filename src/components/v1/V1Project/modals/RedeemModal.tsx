import { t, Trans } from '@lingui/macro'
import { Form, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ETHAmount from 'components/currency/ETHAmount'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { RedeemAMMPrices } from 'components/Project/RedeemAMMPrices'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useClaimableOverflowOf from 'hooks/v1/contractReader/ClaimableOverflowOf'
import { useRedeemRate } from 'hooks/v1/contractReader/RedeemRate'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useRedeemTokensTx } from 'hooks/v1/transactor/RedeemTokensTx'
import { useWallet } from 'hooks/Wallet'
import { CSSProperties, useContext, useState } from 'react'
import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from 'utils/format/formatNumber'
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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
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
        preferConverted: false, // TODO support in UI
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

  const statsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <p style={statsStyle}>
            <Trans>Redemption rate:</Trans>{' '}
            <span>
              {fcMetadata?.bondingCurveRate !== undefined
                ? fcMetadata.bondingCurveRate / 2
                : '--'}
              %
            </span>
          </p>
          <p style={statsStyle}>
            {tokenSymbolText({ tokenSymbol, capitalize: true })} balance:{' '}
            <span>
              {formatWad(totalBalance ?? 0, { precision: 0 })} {tokensTextShort}
            </span>
          </p>
          <p style={statsStyle}>
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
              Tokens can be redeemed for a portion of this project's overflow,
              according to the redemption rate of the current funding cycle.{' '}
              <span style={{ fontWeight: 500, color: colors.text.warn }}>
                Tokens are burned when they are redeemed.
              </span>
            </Trans>
          ) : (
            <Trans>
              <span style={{ fontWeight: 500, color: colors.text.warn }}>
                <strong>This project has no overflow</strong>, so you will not
                receive any ETH for burning tokens.
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
                  tokenSymbol={tokenSymbol}
                  tokenAddress={tokenAddress}
                  style={{ fontSize: '.65rem' }}
                />
              ) : null}
            </Form.Item>
          </Form>
          {overflow?.gt(0) ? (
            <div style={{ fontWeight: 500, marginTop: 20 }}>
              <Trans>
                You will receive{' '}
                {currentFC?.currency.eq(V1_CURRENCY_USD) ? 'minimum ' : ' '}
                {formatWad(minAmount, { precision: 8 }) || '--'} ETH
              </Trans>
            </div>
          ) : null}
        </div>
      </Space>
    </Modal>
  )
}
