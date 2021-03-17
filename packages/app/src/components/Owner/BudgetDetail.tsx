import { BigNumber } from '@ethersproject/bignumber'
import { Button, Descriptions, DescriptionsProps, Input, Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import moment from 'moment'
import { useContext, useEffect, useMemo, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { budgetCurrencyName } from 'utils/budgetCurrency'
import {
  formattedNum,
  formatWad,
  fromPerMille,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'

import TooltipLabel from '../shared/TooltipLabel'
import BudgetHeader from './BudgetHeader'

export default function BudgetDetail({ budget }: { budget: Budget }) {
  const {
    transactor,
    onNeedProvider,
    contracts,
    userAddress,
    weth,
  } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const currency = budgetCurrencyName(budget.currency)

  const tappableAmount = useContractReader<BigNumber>({
    contract: ContractName.BudgetStore,
    functionName: 'getTappableAmount',
    args: [budget.id.toHexString()],
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        budget.id
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [budget.id.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [budget.id.toHexString()],
              },
            ]
          : undefined,
      [budget.id],
    ),
  })

  useEffect(() => setTapAmount(fromWad(tappableAmount)), [tappableAmount])

  const formattedTappedTotal = useMemo(
    () =>
      currency === 'USD'
        ? formattedNum(converter.weiToUsd(budget.tappedTotal))
        : formatWad(budget.tappedTotal),
    [budget.tappedTotal, converter, currency],
  )

  const now = BigNumber.from(Math.round(new Date().valueOf() / 1000))

  // TODO recalculate every second
  const secondsLeft = budget?.start.add(budget.duration).sub(now)

  const formatDate = (dateMillis: number) =>
    moment(dateMillis).format('M-DD-YYYY h:mma')

  const formattedStartTime = formatDate(budget.start.mul(1000).toNumber())

  const formattedEndTime = formatDate(
    budget.start
      .add(budget.duration)
      .mul(1000)
      .toNumber(),
  )

  const isEnded = secondsLeft.lte(0)

  const isUpcoming = useMemo(() => budget.start.gt(now), [budget.start, now])

  const isOwner = budget?.project === userAddress

  function detailedTimeString(secs: BigNumber) {
    if (!secs || secs.lte(0)) return 0

    const days = parseFloat((secs.toNumber() / SECONDS_IN_DAY).toString())
    const hours = days && (days % 1) * 24
    const minutes = hours && (hours % 1) * 60
    const seconds = minutes && (minutes % 1) * 60

    return (
      `${days && days > 1 ? Math.floor(days).toString() + 'd ' : ''}${
        hours && hours >= 1 ? Math.floor(hours) + 'h ' : ''
      }
        ${minutes && minutes >= 1 ? Math.floor(minutes) + 'm ' : ''}
        ${seconds && seconds >= 1 ? Math.floor(seconds) + 's' : ''}`.trim() ||
      '--'
    )
  }

  function tap() {
    if (!transactor || !contracts?.Juicer) return onNeedProvider()

    setLoadingWithdraw(true)

    const id = budget.id.toHexString()

    if (!tapAmount) {
      setLoadingWithdraw(false)
      return
    }

    const amount = parseWad(tapAmount)

    if (!amount) return

    // Arbitrary discrete value (wei) subtracted
    const minAmount = (currency === 'USD'
      ? converter.usdToWei(tapAmount)
      : parseWad(tapAmount)
    )?.sub(1e12)

    transactor(
      contracts.Juicer,
      'tap',
      [id, amount.toHexString(), budget.currency, userAddress, minAmount],
      {
        onDone: () => setLoadingWithdraw(false),
      },
    )
  }

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
  }

  const gutter = 25

  const tappedDescriptionItem = (
    <Descriptions.Item
      label={
        <TooltipLabel
          label="Tapped"
          tip="The amount that the project owner has tapped from this budget. The owner can tap up to the specified target."
        />
      }
    >
      {formattedTappedTotal} {currency}
    </Descriptions.Item>
  )

  const tappableDescriptionItem = (
    <Descriptions.Item
      label={
        <TooltipLabel
          label="Tappable"
          tip="The amount that the project owner can still tap from this budget."
        />
      }
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {formatWad(tappableAmount)} {currency}
        {isOwner && tappableAmount?.gt(0) ? (
          <div>
            <Button
              loading={loadingWithdraw}
              onClick={() => setWithdrawModalVisible(true)}
            >
              Withdraw
            </Button>
            <Modal
              title="Withdraw funds"
              visible={withdrawModalVisible}
              onOk={() => {
                tap()
                setWithdrawModalVisible(false)
              }}
              onCancel={() => {
                setTapAmount(undefined)
                setWithdrawModalVisible(false)
              }}
              okText="Withdraw"
              width={540}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  name="withdrawable"
                  placeholder="0"
                  suffix={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {currency}
                      <InputAccessoryButton
                        content="MAX"
                        onClick={() => setTapAmount(fromWad(tappableAmount))}
                      />
                    </div>
                  }
                  value={tapAmount}
                  max={fromWad(tappableAmount)}
                  onChange={e => setTapAmount(e.target.value)}
                />
                <div style={{ textAlign: 'right' }}>
                  {formatWad(converter.usdToWei(tapAmount))} {weth?.symbol}
                </div>
              </Space>
            </Modal>
          </div>
        ) : null}
      </div>
    </Descriptions.Item>
  )

  const upcomingDescriptions = (
    <Descriptions {...descriptionsStyle} column={2} bordered>
      <Descriptions.Item label="Starts">{formattedStartTime}</Descriptions.Item>

      <Descriptions.Item label="Duration">
        {detailedTimeString(budget?.duration)}
      </Descriptions.Item>
    </Descriptions>
  )

  const activeDescriptions = (
    <Descriptions {...descriptionsStyle} column={1} bordered>
      <Descriptions.Item label="Started">
        {formattedStartTime}
      </Descriptions.Item>

      <Descriptions.Item label="Time left">
        {detailedTimeString(secondsLeft)}
      </Descriptions.Item>

      {tappedDescriptionItem}

      {tappableDescriptionItem}
    </Descriptions>
  )

  const endedDescriptions = (
    <Descriptions {...descriptionsStyle} column={1} bordered>
      <Descriptions.Item span={1} label="Period">
        {formattedStartTime} - {formattedEndTime}
      </Descriptions.Item>

      {tappedDescriptionItem}

      {tappableDescriptionItem}
    </Descriptions>
  )

  if (!budget) return null

  return (
    <div>
      <BudgetHeader budget={budget} gutter={gutter} />

      {isUpcoming ? upcomingDescriptions : null}
      {isEnded ? endedDescriptions : null}
      {!isUpcoming && !isEnded ? activeDescriptions : null}

      {budget?.link ? (
        <div
          style={{
            display: 'block',
            margin: gutter,
          }}
        >
          <a href={budget.link} target="_blank" rel="noopener noreferrer">
            {budget.link}
          </a>
        </div>
      ) : null}

      <div style={{ margin: gutter }}>
        <Descriptions {...descriptionsStyle} size="small" column={2}>
          <Descriptions.Item
            label={
              <TooltipLabel
                label="Discount Rate"
                tip="The rate at which payments to future
                budgeting time frames are valued compared to payments to the current one. For example, if this is set to 97%, then someone who pays 100 towards the next budgeting time frame will only receive 97% the amount of tickets received by someone who paid 100 towards this budgeting time frame."
              />
            }
          >
            {fromPerMille(budget.discountRate)} %
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <TooltipLabel
                label="Reserved"
                tip="This project's owner can mint tickets for themselves to share in the overflow with all contributors. For example, if this is set to 5% and 95 tickets were given out over the course of this budget, then the owner will be able to mint 5 tickets for themselves once the budget expires."
              />
            }
          >
            {fromPerMille(budget.reserved)}%
          </Descriptions.Item>

          {!addressExists(budget.donationRecipient) ? null : (
            <Descriptions.Item
              label={
                <TooltipLabel
                  label="Reserved donation amount"
                  tip="A percentage of this budget's overflow can be reserved for the specified address. For example, if this is set to 5% and there is 1000 DAI of overflow, the donation address will be able to claim 50 DAI once this budget expires."
                />
              }
            >
              {fromPerMille(budget.donationAmount)}%
            </Descriptions.Item>
          )}

          {!addressExists(budget.donationRecipient) ? null : (
            <Descriptions.Item label="Beneficiary address" span={2}>
              {budget.donationRecipient}
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </div>
  )
}
