import { t, Trans } from '@lingui/macro'
import { Modal, Space, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import useClaimableOverflowOf from 'hooks/v1/contractReader/ClaimableOverflowOf'
import { useRedeemRate } from 'hooks/v1/contractReader/RedeemRate'
import useTotalBalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useRedeemTokensTx } from 'hooks/v1/transactor/RedeemTokensTx'
import { CSSProperties, useContext, useState } from 'react'
import { formattedNum, formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

// This double as the 'Redeem' and 'Burn' modal depending on if project has overflow
export default function RedeemModal({
  visible,
  onOk,
  onCancel,
}: {
  visible?: boolean
  onOk: VoidFunction | undefined
  onCancel: VoidFunction | undefined
}) {
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const redeemTokensTx = useRedeemTokensTx()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, tokenSymbol, currentFC, terminal, overflow } =
    useContext(V1ProjectContext)

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

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
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })
  const tokensTextShort = tokenSymbolText({
    tokenSymbol: tokenSymbol,
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
      visible={visible}
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
            <Trans>Bonding curve:</Trans>{' '}
            <span>
              {fcMetadata?.bondingCurveRate !== undefined
                ? fcMetadata.bondingCurveRate / 2
                : '--'}
              %
            </span>
          </p>
          <p style={statsStyle}>
            {tokenSymbolText({ tokenSymbol: tokenSymbol, capitalize: true })}{' '}
            balance:{' '}
            <span>
              {formatWad(totalBalance ?? 0, { precision: 0 })} {tokensTextShort}
            </span>
          </p>
          <p style={statsStyle}>
            <Trans>
              Currently worth:{' '}
              <span>
                <CurrencySymbol currency={V1_CURRENCY_ETH} />
                {formatWad(maxClaimable, { precision: 4 })}
              </span>
            </Trans>
          </p>
        </div>
        <p>
          {overflow?.gt(0) ? (
            <Trans>
              Tokens can be redeemed for a portion of this project's ETH
              overflow, according to the bonding curve rate of the current
              funding cycle.{' '}
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
              formItemProps={{
                rules: [{ validator: validateRedeemAmount }],
              }}
              disabled={totalBalance?.eq(0)}
              onChange={val => setRedeemAmount(val)}
            />
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
