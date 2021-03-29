import { BigNumber } from '@ethersproject/bignumber'
import {
  Button,
  Collapse,
  Descriptions,
  DescriptionsProps,
  Input,
  Space,
} from 'antd'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'
import Modal from 'antd/lib/modal/Modal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { SECONDS_IN_DAY } from 'constants/seconds-in-day'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useExchangePrice } from 'hooks/ExchangePrice'
import { Budget } from 'models/budget'
import moment from 'moment'
import { useContext, useEffect, useMemo, useState } from 'react'
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

export default function BudgetDetail({
  budget,
  showDetail,
  isOwner,
}: {
  budget: Budget
  showDetail?: boolean
  isOwner: boolean
}) {
  const {
    transactor,
    onNeedProvider,
    contracts,
    userAddress,
    weth,
    adminFeePercent,
  } = useContext(UserContext)

  const ethPrice = useExchangePrice()

  const converter = useCurrencyConverter()

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const currency = budgetCurrencyName(budget.currency)

  const isRecurring = budget.discountRate.gt(0)

  const tappableAmount = useMemo(() => {
    const total = budget.total.mul(parseWad(ethPrice?.toString() ?? '0'))
    const available = budget.target.lt(total) ? budget.target : total

    return available
      .mul(1000)
      .div(1000 + (adminFeePercent ?? 0))
      .sub(budget.tappedTarget)
  }, [
    budget.total.toString(),
    budget.target.toString(),
    budget.tappedTarget.toString(),
    adminFeePercent,
  ])

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
    size: 'small',
  }

  const gutter = 25

  if (!budget) return null

  return (
    <div>
      <BudgetHeader budget={budget} gutter={gutter} />

      <Collapse
        style={{
          background: 'transparent',
          border: 'none',
          paddingLeft: 8,
          paddingRight: 8,
          margin: 0,
        }}
        defaultActiveKey={showDetail ? '0' : undefined}
        accordion
      >
        <CollapsePanel
          key={'0'}
          style={{ border: 'none', padding: 0 }}
          header={
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>Details</div>

              <div style={{ color: colors.textPrimary }}>
                {isRecurring ? (
                  isEnded ? (
                    <div>Ended</div>
                  ) : (
                    <div>{detailedTimeString(secondsLeft)} left</div>
                  )
                ) : null}
              </div>
            </div>
          }
        >
          <Descriptions {...descriptionsStyle} column={2}>
            <Descriptions.Item label="Start">
              {formattedStartTime}
            </Descriptions.Item>

            <Descriptions.Item label="End">
              {formattedEndTime}
            </Descriptions.Item>

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
                                onClick={() =>
                                  setTapAmount(fromWad(tappableAmount))
                                }
                              />
                            </div>
                          }
                          value={tapAmount}
                          max={fromWad(tappableAmount)}
                          onChange={e => setTapAmount(e.target.value)}
                        />
                        <div style={{ textAlign: 'right' }}>
                          {formatWad(converter.usdToWei(tapAmount))}{' '}
                          {weth?.symbol}
                        </div>
                      </Space>
                    </Modal>
                  </div>
                ) : null}
              </div>
            </Descriptions.Item>

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
          </Descriptions>
        </CollapsePanel>
      </Collapse>
    </div>
  )
}
