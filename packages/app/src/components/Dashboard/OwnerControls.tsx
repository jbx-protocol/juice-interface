import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Modal, Progress, Space, Statistic } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import { ContractName } from 'constants/contract-name'
import { colors } from 'constants/styles/colors'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import React, { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { budgetCurrencyName, budgetCurrencySymbol } from 'utils/budgetCurrency'
import {
  formattedNum,
  formatWad,
  fracDiv,
  fromWad,
  parseWad,
} from 'utils/formatCurrency'
import { detailedTimeString } from 'utils/formatTime'

export default function OwnerControls({
  projectId,
  budget,
}: {
  projectId: BigNumber
  budget: Budget | undefined
}) {
  const {
    weth,
    transactor,
    contracts,
    onNeedProvider,
    userAddress,
  } = useContext(UserContext)

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const converter = useCurrencyConverter()

  const balance = useContractReader<BigNumber>({
    contract: ContractName.Juicer,
    functionName: 'balanceOf',
    args: projectId ? [projectId.toHexString(), true] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: ContractName.Juicer,
                eventName: 'Pay',
                topics: [[], projectId.toHexString()],
              },
              {
                contract: ContractName.Juicer,
                eventName: 'Tap',
                topics: [[], projectId.toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })

  function tap() {
    if (!transactor || !contracts?.Juicer || !budget) return onNeedProvider()

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

  const totalPaid = balance?.add(budget?.tappedTotal ?? 0)

  const currency = budgetCurrencyName(budget?.currency)

  const percentPaid = useMemo(() => {
    if (!totalPaid || !budget?.target) return 0

    const total =
      currency === 'USD'
        ? parseWad(converter.weiToUsd(totalPaid)?.toString())
        : totalPaid

    if (!total) return 0

    return fracDiv(total.toString(), budget.target.toString()) * 100
  }, [budget?.target, totalPaid, currency, converter])

  const formattedPaid = useMemo(() => {
    if (!totalPaid) return '0'

    const amount =
      currency === 'USD'
        ? formattedNum(converter.weiToUsd(totalPaid))
        : formatWad(totalPaid)

    return amount ?? '0'
  }, [currency, totalPaid, converter])

  if (!budget) return null

  const isRecurring = budget?.discountRate.gt(0)

  const now = BigNumber.from(Math.round(new Date().valueOf() / 1000))
  const secondsLeft = budget.start.add(budget.duration).sub(now)
  const isEnded = secondsLeft.lte(0)

  return (
    <div>
      <div>
        <h3
          style={{
            fontWeight: 600,
            marginBottom: 0,
            marginRight: 20,
          }}
        >
          {percentPaid}% Juiced in term {budget.number.toString()}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <Progress
          style={{ marginRight: 20 }}
          percent={percentPaid}
          showInfo={false}
          strokeColor={colors.juiceOrange}
        />
        <div>
          {budgetCurrencySymbol(budget.currency)}
          <span style={{ fontWeight: 600 }}>{formattedPaid}</span>/
          <span>{formatWad(budget.target)}</span>
        </div>
      </div>

      <div style={{ opacity: 0.5 }}>
        {isRecurring && !isEnded ? (
          <div>Next term in {detailedTimeString(secondsLeft)}</div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 20,
        }}
      >
        <div>
          <Statistic
            title="Available balance"
            valueRender={() => (
              <div>
                {budgetCurrencySymbol(budget.currency)}
                {formatWad(balance) || '0'}
              </div>
            )}
          />
        </div>
        <div>
          <Button
            loading={loadingWithdraw}
            onClick={() => setWithdrawModalVisible(true)}
          >
            Collect
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
                      onClick={() => setTapAmount(fromWad(balance))}
                    />
                  </div>
                }
                value={tapAmount}
                max={fromWad(balance)}
                onChange={e => setTapAmount(e.target.value)}
              />
              <div style={{ textAlign: 'right' }}>
                {formatWad(converter.usdToWei(tapAmount))} {weth?.symbol}
              </div>
            </Space>
          </Modal>
        </div>
      </div>
    </div>
  )
}
