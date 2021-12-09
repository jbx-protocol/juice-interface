import { BigNumber } from '@ethersproject/bignumber'
import { Button, Space, Tooltip } from 'antd'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/modals/PayWarningModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { parseEther } from 'ethers/lib/utils'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { BallotState } from 'models/funding-cycle'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { currencyName } from 'utils/currency'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { decodeFCMetadata } from 'utils/fundingCycle'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'
import { ThemeContext } from 'contexts/themeContext'

type TabOption = 'pay' | 'redeem'

export default function Pay({
  totalOverflow,
}: {
  totalOverflow: BigNumber | undefined
}) {
  const [activeTab, setActiveTab] = useState<TabOption>()
  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [payIn, setPayIn] = useState<CurrencyOption>(0)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const {
    projectId,
    currentFC,
    metadata,
    tokenSymbol,
    isArchived,
    tokenAddress,
  } = useContext(ProjectContext)
  const { userAddress } = useContext(NetworkContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const converter = useCurrencyConverter()

  const fcMetadata = decodeFCMetadata(currentFC?.metadata)

  const payDisabled = fcMetadata?.reservedRate === 200

  const weiPayAmt =
    payIn === 1 ? converter.usdToWei(payAmount) : parseEther(payAmount ?? '0')

  useEffect(() => {
    setActiveTab(payDisabled ? 'redeem' : 'pay')
  }, [payDisabled])

  function pay() {
    setPayWarningModalVisible(true)
  }

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet && projectId?.eq(36)

  const payButton = useMemo(() => {
    if (!metadata || !currentFC) return null

    const payButtonText = metadata.payButton?.length
      ? metadata.payButton
      : 'Pay'

    if (isArchived) {
      return (
        <Tooltip
          title="This project has been archived and cannot be paid."
          className="block"
        >
          <Button style={{ width: '100%' }} type="primary" disabled>
            {payButtonText}
          </Button>
        </Tooltip>
      )
    } else if (payDisabled || isConstitutionDAO) {
      return (
        <Tooltip
          title="Paying this project is currently disabled"
          className="block"
        >
          <Button style={{ width: '100%' }} type="primary" disabled>
            {payButtonText}
          </Button>
        </Tooltip>
      )
    } else {
      return (
        <Button
          style={{ width: '100%' }}
          type="primary"
          disabled={currentFC.configured.eq(0) || isArchived}
          onClick={weiPayAmt ? pay : undefined}
        >
          {payButtonText}
        </Button>
      )
    }
  }, [
    metadata,
    currentFC,
    isArchived,
    isConstitutionDAO,
    weiPayAmt,
    payDisabled,
  ])

  const currentBallotState = useContractReader<BallotState>({
    contract: ContractName.FundingCycles,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })

  const currentOverflow = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'currentOverflowOf',
    args: projectId ? [projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.TerminalV1,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TerminalV1,
        eventName: 'PrintPreminedTickets',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Redeem',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Convert',
        topics:
          userAddress && projectId
            ? [userAddress, projectId.toHexString()]
            : undefined,
      },
    ],
    [projectId, userAddress],
  )

  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: ticketContract && userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const totalBalance = iouBalance?.add(ticketsBalance ?? 0)

  const reservedTicketBalance = useContractReader<BigNumber>({
    contract: ContractName.TerminalV1,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && fcMetadata?.reservedRate
        ? [projectId, fcMetadata.reservedRate]
        : null,
    valueDidChange: bigNumbersDiff,
  })
  const totalSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'totalSupplyOf',
    args: projectId ? [projectId?.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })?.add(reservedTicketBalance ? reservedTicketBalance : BigNumber.from(0))

  const rewardAmount = useMemo(() => {
    const bondingCurveRate =
      currentBallotState === BallotState.Active
        ? fcMetadata?.reconfigurationBondingCurveRate
        : fcMetadata?.bondingCurveRate

    const base =
      totalSupply && redeemAmount && currentOverflow
        ? currentOverflow?.mul(parseWad(redeemAmount)).div(totalSupply)
        : BigNumber.from(0)

    if (
      !bondingCurveRate ||
      !totalSupply ||
      !base ||
      !redeemAmount ||
      !currentOverflow
    )
      return undefined

    if (totalSupply.sub(parseWad(redeemAmount)).isNegative()) {
      return currentOverflow
    }

    const number = base
    const numerator = parseWad(bondingCurveRate).add(
      parseWad(redeemAmount)
        .mul(parseWad(200).sub(parseWad(bondingCurveRate)))
        .div(totalSupply),
    )
    const denominator = parseWad(200)

    return number.mul(numerator).div(denominator)
  }, [
    redeemAmount,
    currentBallotState,
    totalSupply,
    currentOverflow,
    fcMetadata?.reconfigurationBondingCurveRate,
    fcMetadata?.bondingCurveRate,
  ])

  const redeemElem = useMemo(() => {
    // 0.5% slippage
    const minAmount = rewardAmount?.mul(1000).div(1005)

    const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

    return (
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
        <div style={{ fontSize: '.7rem' }}>
          Receive minimum {formatWad(minAmount, { decimals: 8 }) || '--'} ETH
        </div>
      </div>
    )
  }, [totalOverflow, redeemAmount, rewardAmount, totalBalance])

  const payElem = useMemo(() => {
    if (!currentFC) return null

    const formatReceivedTickets = (wei: BigNumber) =>
      formatWad(weightedRate(currentFC, wei, 'payer'), { decimals: 0 })

    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <FormattedNumberInput
            placeholder="0"
            disabled={currentFC.configured.eq(0)}
            onChange={val => setPayAmount(val)}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyName(payIn)}
                onClick={() => setPayIn(payIn === 0 ? 1 : 0)}
              />
            }
          />

          <div style={{ fontSize: '.7rem' }}>
            Receive{' '}
            {weiPayAmt?.gt(0) ? (
              formatReceivedTickets(weiPayAmt) + ' ' + (tokenSymbol ?? 'tokens')
            ) : (
              <span>
                {formatReceivedTickets(
                  (payIn === 0 ? parseEther('1') : converter.usdToWei('1')) ??
                    BigNumber.from(0),
                )}{' '}
                {tokenSymbol ?? 'tokens'}/
                <CurrencySymbol currency={payIn} />
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          {payButton}
          {payIn === 1 && (
            <div style={{ fontSize: '.7rem' }}>
              Paid as <CurrencySymbol currency={0} />
              {formatWad(weiPayAmt) || '0'}
            </div>
          )}
        </div>
      </div>
    )
  }, [
    weiPayAmt,
    payButton,
    payIn,
    tokenSymbol,
    converter,
    currentFC,
    payAmount,
  ])

  const content = useMemo(() => {
    switch (activeTab) {
      case 'pay':
        return payElem
      case 'redeem':
        return redeemElem
    }
  }, [activeTab, payElem, redeemElem])

  const tab = (tab: TabOption) => {
    const selected = tab === activeTab

    let text: string
    switch (tab) {
      case 'pay':
        text = 'Pay'
        break
      case 'redeem':
        text = 'Redeem'
        break
    }

    return (
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          fontWeight: selected ? 600 : 400,
          color: selected ? colors.text.secondary : colors.text.tertiary,
          cursor: 'pointer',
        }}
        onClick={() => {
          setActiveTab(tab)
        }}
      >
        {text}
      </div>
    )
  }

  if (!currentFC || !projectId || !metadata) return null

  return (
    <div>
      <div>
        <div>
          <Space direction="horizontal" size="middle">
            {tab('pay')}
            {tab('redeem')}
          </Space>
        </div>
        <div>{content}</div>
      </div>

      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </div>
  )
}
