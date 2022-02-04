import { t, Trans } from '@lingui/macro'
import { Modal, Space } from 'antd'
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

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'

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
  const minAmount = currentFC?.currency.eq(CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  function redeem() {
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

  return (
    <Modal
      title={`Burn ${tokenSymbol ? tokenSymbol + ' tokens' : 'tokens'} for ETH`}
      visible={visible}
      confirmLoading={loading}
      onOk={() => {
        redeem()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        if (onCancel) onCancel()
      }}
      okText={`Burn ${formattedNum(redeemAmount, {
        precision: 2,
      })} ${tokenSymbol ?? 'tokens'} for ETH`}
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
            {tokenSymbol ?? 'Token'} balance:{' '}
            <span>
              {formatWad(totalBalance ?? 0, { precision: 0 })}{' '}
              {tokenSymbol ?? 'tokens'}
            </span>
          </p>
          <p style={statsStyle}>
            <Trans>
              Currently worth:{' '}
              <span>
                <CurrencySymbol currency={CURRENCY_ETH} />
                {formatWad(maxClaimable, { precision: 4 })}
              </span>
            </Trans>
          </p>
        </div>
        <p>
          <Trans>
            Tokens can be redeemed for a portion of this project's ETH overflow,
            according to the bonding curve rate of the current funding cycle.
          </Trans>{' '}
          <span style={{ fontWeight: 500, color: colors.text.warn }}>
            {overflow?.eq(0) ? (
              <Trans>
                This project has no overflow, and you will receive no ETH for
                burning tokens.
              </Trans>
            ) : (
              <Trans>Tokens are burned when they are redeemed.</Trans>
            )}
          </span>
        </p>
        <div>
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
            onChange={val => setRedeemAmount(val)}
          />
          <div style={{ fontWeight: 500, marginTop: 20 }}>
            <Trans>
              You will receive{' '}
              {currentFC?.currency.eq(CURRENCY_USD) ? 'minimum ' : ' '}
              {formatWad(minAmount, { precision: 8 }) || '--'} ETH
            </Trans>
          </div>
        </div>
      </Space>
    </Modal>
  )
}
