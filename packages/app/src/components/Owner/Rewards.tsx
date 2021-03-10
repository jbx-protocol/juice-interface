import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Button, Input, Space, Statistic, Tag, Tooltip } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import {
  formattedNum,
  formatWad,
  fromWad,
  parseWad,
} from '../../utils/formatCurrency'
import TooltipLabel from '../shared/TooltipLabel'
import { useCurrencyConverter } from '../../hooks/CurrencyConverter'

export default function Rewards({
  ticketAddress,
  isOwner,
}: {
  ticketAddress?: string
  isOwner?: boolean
}) {
  const {
    currentBudget,
    weth,
    contracts,
    transactor,
    userAddress,
    onNeedProvider,
  } = useContext(UserContext)

  const [redeemAmount, setRedeemAmount] = useState<string>()
  const [loadingRedeem, setLoadingRedeem] = useState<boolean>()
  const [loadingClaimIou, setLoadingClaimIou] = useState<boolean>()

  const converter = useCurrencyConverter()

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: currentBudget?.id
          ? [currentBudget.id.toHexString()]
          : undefined,
      },
      {
        contract: ContractName.Juicer,
        eventName: 'Redeem',
        topics: currentBudget?.project
          ? [[], currentBudget.project]
          : undefined,
      },
    ],
    [currentBudget?.id, currentBudget?.project],
  )

  const bondingCurveRate = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'bondingCurveRate',
    valueDidChange: bigNumbersDiff,
  })
  const ticketContract = useErc20Contract(ticketAddress)
  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })
  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const ticketSupply = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'totalSupply',
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })
  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'iOweYous',
    args:
      userAddress && currentBudget
        ? [currentBudget?.project, userAddress]
        : null,
    valueDidChange: bigNumbersDiff,
    formatter: useCallback(
      (value?: BigNumber) => value ?? BigNumber.from(0),
      [],
    ),
    updateOn: [
      ...ticketsUpdateOn,
      {
        contract: contracts?.TicketStore,
        eventName: 'Issue',
        topics: currentBudget ? [currentBudget.project] : undefined,
      },
    ],
  })
  const iouSupply = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'totalIOweYous',
    args: currentBudget ? [currentBudget?.project] : null,
    valueDidChange: bigNumbersDiff,
    formatter: useCallback(
      (value?: BigNumber) => value ?? BigNumber.from(0),
      [],
    ),
    updateOn: ticketsUpdateOn,
  })
  const totalOverflow = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'getOverflow',
    args: currentBudget ? [currentBudget?.project] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: [
      {
        contract: ContractName.Juicer,
        eventName: 'Pay',
        topics: currentBudget ? [currentBudget.id.toHexString()] : undefined,
      },
      {
        contract: ContractName.Juicer,
        eventName: 'Tap',
        topics: currentBudget ? [currentBudget.id.toHexString()] : undefined,
      },
    ],
  })
  //TEMP
  const totalClaimable = useContractReader<BigNumber>({
    contract: ContractName.TicketStore,
    functionName: 'getClaimableAmount',
    args: useMemo(() => 
    currentBudget?.project && redeemAmount && bondingCurveRate && addressExists(userAddress) ? [
      userAddress,
      parseWad(redeemAmount)?.toHexString(),
      currentBudget.project,
      bondingCurveRate.toHexString()
    ] : null
  , [currentBudget?.project, redeemAmount, bondingCurveRate, userAddress]),
    valueDidChange: bigNumbersDiff,
    formatter: useCallback(
      (value?: BigNumber) => value ?? BigNumber.from(0),
      [])
  })

  console.log("ASDFASDFASDFASFAS: ", {totalClaimable, bondingCurveRate, userAddress, redeem: parseWad(redeemAmount)?.toHexString(), proj: currentBudget?.project });
  const totalBalance = BigNumber.from(ticketsBalance ?? 0).add(iouBalance || 0)
  const combinedSupply = BigNumber.from(ticketSupply ?? 0).add(iouSupply || 0)

  useEffect(() => {
    if (totalBalance?.gt(0) && !redeemAmount) {
      setRedeemAmount(fromWad(totalBalance))
    }
  }, [totalBalance])

  if (!currentBudget) return null

  const share = combinedSupply?.gt(0)
    ? totalBalance
        ?.mul(100)
        .div(combinedSupply)
        .toString()
    : '0'

  function redeem() {
    if (!transactor || !contracts) return onNeedProvider()

    if (!bondingCurveRate || !totalOverflow || combinedSupply.eq(0)) return

    setLoadingRedeem(true)

    const redeemWad = parseWad(redeemAmount)

    if (!redeemWad) return

    const minReturn = redeemWad
      .mul(totalOverflow)
      .mul(bondingCurveRate)
      .div(1000)
      .div(combinedSupply)

    transactor(
      contracts.Juicer,
      'redeem',
      [
        currentBudget?.project,
        redeemWad?.toHexString(),
        minReturn.toHexString(),
        userAddress,
      ],
      {
        onDone: () => setLoadingRedeem(false),
        onConfirmed: () => setRedeemAmount('0'),
      },
    )
  }

  function claimIou() {
    if (!transactor || !contracts) return onNeedProvider()

    setLoadingClaimIou(true)

    transactor(contracts.TicketStore, 'convert', [currentBudget?.project], {
      onDone: () => setLoadingClaimIou(false),
    })
  }

  const subText = (text: string) => (
    <div
      style={{
        fontSize: '.75rem',
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  )

  const awaitingIssueTicketsTag = (
    <Tag
      style={{
        background: 'transparent',
        borderColor: colors.grape,
        color: colors.grape,
      }}
    >
      ERC-20 tickets not minted yet
    </Tag>
  )

  const iouSymbol = 'tickets'

  const redeemDisabled = !totalOverflow || totalOverflow.eq(0)

  return (
    <Space direction="vertical" size="large" align="start">
      <Statistic
        title={
          <TooltipLabel
            label="Unclaimed overflow"
            tip="You'll receive this project's tickets in return for making payments
          towards the active budget."
            placement="bottom"
          />
        }
        valueRender={() => (
          <div>
            {formatWad(totalOverflow ?? 0)} {weth?.symbol}
            <div>{formattedNum(converter.weiToUsd(totalOverflow))} USD</div>
          </div>
        )}
      />

      {iouBalance?.gt(0) || !addressExists(ticketAddress) ? (
        <Statistic
          title={
            <TooltipLabel
              label="Your wallet"
              tip="Tickets can be redeemed for your contract's overflow on a bonding
            curve – a ticket is redeemable for 38.2% of its proportional
            overflowed tokens. Meaning, if there are 100 overflow tokens available
            and 100 of your tickets in circulation, 10 tickets could be redeemed
            for 3.82 of the overflow tokens. The rest is left to share between the
            remaining ticket hodlers."
              placement="bottom"
            />
          }
          valueRender={() => (
            <div>
              <div>
                {formatWad(iouBalance ?? 0)} {iouSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatWad(combinedSupply) ??
                  0} ${iouSymbol} in circulation`,
              )}
              {!addressExists(ticketAddress) ? (
                isOwner ? (
                  <Tooltip
                    title="Issue tickets in the back office"
                    placement="right"
                  >
                    {awaitingIssueTicketsTag}
                  </Tooltip>
                ) : (
                  awaitingIssueTicketsTag
                )
              ) : null}
              {!addressExists(ticketAddress) ? null : (
                <Button loading={loadingClaimIou} onClick={claimIou}>
                  Convert tickets
                </Button>
              )}
            </div>
          )}
        ></Statistic>
      ) : null}

      {addressExists(ticketAddress) && iouSupply?.eq(0) ? (
        <Statistic
          title={
            <TooltipLabel
              label="Your wallet"
              tip="If this project has minted ERC-20 tokens to track tickets, you'll see
            yours in your wallet once you contribute a payment."
              placement="bottom"
            />
          }
          valueRender={() => (
            <div>
              <div>
                {formatWad(ticketsBalance)} {ticketSymbol}
              </div>
              {subText(
                `${share ?? 0}% of ${formatWad(
                  ticketSupply?.toString(),
                )} ${ticketSymbol} in circulation`,
              )}
              {!addressExists(ticketAddress) ? (
                isOwner ? (
                  <Tooltip
                    title="Issue tickets in the back office"
                    placement="right"
                  >
                    {awaitingIssueTicketsTag}
                  </Tooltip>
                ) : (
                  awaitingIssueTicketsTag
                )
              ) : null}
            </div>
          )}
        />
      ) : null}

      <Statistic
        title={
          redeemDisabled ? (
            <TooltipLabel
              label="Redeem tickets"
              tip="Tickets can be redeemed once this project has overflow."
            />
          ) : (
            'Redeem tickets'
          )
        }
        valueRender={() => (
          <Space>
            <Input
              type="number"
              disabled={redeemDisabled}
              placeholder="0"
              value={redeemAmount}
              suffix={
                redeemDisabled ? null : (
                  <InputAccessoryButton
                    text="MAX"
                    onClick={() => setRedeemAmount(fromWad(totalBalance))}
                  />
                )
              }
              max={fromWad(totalBalance)}
              onChange={e => setRedeemAmount(e.target.value)}
            />
            <Button
              type="primary"
              onClick={redeem}
              loading={loadingRedeem}
              disabled={redeemDisabled}
            >
              Redeem
            </Button>
          </Space>
        )}
      />
    </Space>
  )
}
