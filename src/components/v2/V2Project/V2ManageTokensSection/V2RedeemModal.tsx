import { t, Trans } from '@lingui/macro'
import { Modal, Form, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { CSSProperties, useContext, useState } from 'react'
import { formattedNum, formatWad, fromWad, parseWad } from 'utils/formatNumber'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import useTotalBalanceOf from 'hooks/v2/contractReader/TotalBalanceOf'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'
import { formatRedemptionRate } from 'utils/v2/math'
import useReclaimableOverflowOf from 'hooks/v2/contractReader/ReclaimableOverflowOf'
import CurrencySymbol from 'components/shared/CurrencySymbol'

// This double as the 'Redeem' and 'Burn' modal depending on if project has overflow
export default function V2RedeemModal({
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
  // const redeemTokensTx = useRedeemTokensTx()

  const [form] = useForm<{
    redeemAmount: string
  }>()

  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, fundingCycle, overflow, projectId } =
    useContext(V2ProjectContext)

  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const { data: maxClaimable } = useReclaimableOverflowOf()

  if (!fundingCycle) return null

  const fcMetadata = decodeV2FundingCycleMetadata(fundingCycle.metadata)

  // const rewardAmount = useRedeemRate({
  //   tokenAmount: redeemAmount,
  //   fundingCycle: fundingCycle,
  // })

  // 0.5% slippage for USD-denominated projects
  // const minAmount = currentFC?.currency.eq(V1_CURRENCY_USD)
  //   ? rewardAmount?.mul(1000).div(1005)
  //   : rewardAmount

  async function redeem() {
    await form.validateFields()
    // if (!minAmount) return

    setLoading(true)

    // redeemV2TokensTx(
    //   {
    //     redeemAmount: parseWad(redeemAmount),
    //     minAmount,
    //     preferConverted: false, // TODO support in UI
    //   },
    //   {
    //     onConfirmed: () => setRedeemAmount(undefined),
    //     onDone: () => {
    //       setLoading(false)
    //       onOk?.()
    //     },
    //   },
    // )
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
            <Trans>Redemption rate:</Trans>{' '}
            <span>{formatRedemptionRate(fcMetadata?.redemptionRate)}%</span>
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
                <CurrencySymbol currency="ETH" />
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
              {/* <Trans>
                You will receive{' '}
                {fundingCycle?.currency.eq(V1_CURRENCY_USD) ? 'minimum ' : ' '}
                {formatWad(minAmount, { precision: 8 }) || '--'} ETH
              </Trans> */}
            </div>
          ) : null}
        </div>
      </Space>
    </Modal>
  )
}
