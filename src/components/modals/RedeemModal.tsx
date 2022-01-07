import { Modal, Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formattedNum, formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'

import { useRedeemRate } from '../../hooks/RedeemRate'

export default function RedeemModal({
  visible,
  redeemDisabled,
  onOk,
  onCancel,
  totalBalance,
}: {
  visible?: boolean
  redeemDisabled?: boolean
  onOk: VoidFunction | undefined
  onCancel: VoidFunction | undefined
  totalBalance: BigNumber | undefined
}) {
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>()

  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress } = useContext(NetworkContext)
  const { contracts, transactor } = useContext(UserContext)
  const { projectId, tokenSymbol, currentFC } = useContext(ProjectContext)

  const fcMetadata = decodeFCMetadata(currentFC?.metadata)

  const maxClaimable = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && projectId
        ? [userAddress, projectId.toHexString(), totalBalance?.toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId && userAddress
          ? [
              {
                contract: ContractName.TerminalV1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.TerminalV1,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId, userAddress],
    ),
  })

  const rewardAmount = useRedeemRate({
    tokenAmount: redeemAmount,
    fundingCycle: currentFC,
  })

  // 0.5% slippage for USD-denominated projects
  const minAmount = currentFC?.currency.eq(CURRENCY_USD)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  function redeem() {
    if (!transactor || !contracts || !rewardAmount) return

    setLoading(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    transactor(
      contracts.TerminalV1,
      'redeem',
      [
        userAddress,
        projectId.toHexString(),
        redeemWad.toHexString(),
        minAmount,
        userAddress,
        false, // TODO preferconverted
      ],
      {
        onConfirmed: () => setRedeemAmount(undefined),
        onDone: () => setLoading(false),
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

        if (onOk) onOk()
      }}
      onCancel={() => {
        setRedeemAmount(undefined)

        if (onCancel) onCancel()
      }}
      okText={`Burn ${formattedNum(redeemAmount, {
        decimals: 2,
      })} ${tokenSymbol ?? 'tokens'} for ETH`}
      okButtonProps={{
        disabled:
          redeemDisabled || !redeemAmount || parseInt(redeemAmount) === 0,
      }}
      width={540}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <p style={statsStyle}>
            Bonding curve:{' '}
            <span>
              {fcMetadata?.bondingCurveRate !== undefined
                ? fcMetadata.bondingCurveRate / 2
                : '--'}
              %
            </span>
          </p>
          {/* <p style={statsStyle}>
            Burn rate:{' '}
            <span>
              {redeemRate && !redeemRate.isZero()
                ? formattedNum(parseWad(1).div(redeemRate))
                : '--'}{' '}
              {tokenSymbol ?? 'tokens'}/ETH
            </span>
          </p> */}
          <p style={statsStyle}>
            {tokenSymbol ?? 'Token'} balance:{' '}
            <span>
              {formatWad(totalBalance ?? 0, { decimals: 0 })}{' '}
              {tokenSymbol ?? 'tokens'}
            </span>
          </p>
          <p style={statsStyle}>
            Currently worth:{' '}
            <span>
              <CurrencySymbol currency={CURRENCY_ETH} />
              {formatWad(maxClaimable, { decimals: 4 })}
            </span>
          </p>
        </div>
        <p>
          Tokens can be redeemed for a portion of this project's ETH overflow,
          according to the bonding curve rate of the current funding cycle.{' '}
          <span style={{ fontWeight: 500, color: colors.text.warn }}>
            Tokens are burned when they are redeemed.
          </span>
        </p>
        {redeemDisabled && (
          <div style={{ color: colors.text.secondary, fontWeight: 500 }}>
            You can redeem tokens once this project has overflow.
          </div>
        )}
        {!redeemDisabled && (
          <div>
            <FormattedNumberInput
              min={0}
              step={0.001}
              placeholder="0"
              value={redeemAmount}
              disabled={redeemDisabled}
              accessory={
                <InputAccessoryButton
                  content="MAX"
                  onClick={() => setRedeemAmount(fromWad(totalBalance))}
                />
              }
              onChange={val => setRedeemAmount(val)}
            />
            <div style={{ fontWeight: 500, marginTop: 20 }}>
              You will receive{' '}
              {currentFC?.currency.eq(CURRENCY_USD) ? 'minimum ' : ' '}
              {formatWad(minAmount, { decimals: 8 }) || '--'} ETH
            </div>
          </div>
        )}
      </Space>
    </Modal>
  )
}
