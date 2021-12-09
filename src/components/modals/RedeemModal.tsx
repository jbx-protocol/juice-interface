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
import { BallotState } from 'models/ballot-state'
import { ContractName } from 'models/contract-name'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formattedNum, formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

export default function RedeemModal({
  visible,
  redeemDisabled,
  onOk,
  onCancel,
  totalSupply,
  totalBalance,
}: {
  visible?: boolean
  redeemDisabled?: boolean
  onOk: VoidFunction | undefined
  onCancel: VoidFunction | undefined
  totalSupply: BigNumber | undefined
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

  const currentOverflow = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1_1,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  const maxClaimable = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1_1,
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
                contract: ContractName.TerminalV1_1,
                eventName: 'Pay',
                topics: [[], projectId.toHexString(), userAddress],
              },
              {
                contract: ContractName.TerminalV1_1,
                eventName: 'Redeem',
                topics: [projectId.toHexString(), userAddress],
              },
            ]
          : undefined,
      [projectId, userAddress],
    ),
  })

  const currentBallotState = useContractReader<BallotState>({
    contract: ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const rewardAmount = useMemo(() => {
    const metadata = decodeFundingCycleMetadata(currentFC?.metadata)

    const bondingCurveRate =
      currentBallotState === BallotState.Active
        ? metadata?.reconfigurationBondingCurveRate
        : metadata?.bondingCurveRate

    const base =
      totalSupply && redeemAmount && currentOverflow
        ? currentOverflow.mul(parseWad(redeemAmount)).div(totalSupply)
        : BigNumber.from(0)

    if (
      !bondingCurveRate ||
      !totalSupply ||
      !base ||
      !redeemAmount ||
      !currentOverflow
    ) {
      return undefined
    }

    if (totalSupply.sub(parseWad(redeemAmount)).isNegative()) {
      return currentOverflow
    }

    const numerator = BigNumber.from(bondingCurveRate).add(
      parseWad(redeemAmount)
        .mul(200 - bondingCurveRate)
        .div(totalSupply),
    )
    const denominator = 200

    // Formula: https://www.desmos.com/calculator/sp9ru6zbpk
    return base.mul(numerator).div(denominator)
  }, [
    redeemAmount,
    totalSupply,
    currentOverflow,
    currentBallotState,
    currentFC,
  ])

  // 0.5% slippage for USD-denominated projects
  const minAmount = currentFC?.currency.eq(1)
    ? rewardAmount?.mul(1000).div(1005)
    : rewardAmount

  function redeem() {
    if (!transactor || !contracts || !rewardAmount) return

    setLoading(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad || !projectId) return

    transactor(
      contracts.TerminalV1_1,
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
          Balance: {formatWad(totalBalance ?? 0, { decimals: 0 })}{' '}
          {tokenSymbol ?? 'tokens'}
        </div>
        <p>
          Currently worth: <CurrencySymbol currency={0} />
          {formatWad(maxClaimable, { decimals: 4 })}
        </p>
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
              You will receive {currentFC?.currency.eq(1) ? 'minimum ' : ' '}
              {formatWad(minAmount, { decimals: 8 }) || '--'} ETH
            </div>
          </div>
        )}
      </Space>
    </Modal>
  )
}
