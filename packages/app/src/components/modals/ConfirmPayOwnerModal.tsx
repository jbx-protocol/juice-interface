import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Descriptions, Modal } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useMemo } from 'react'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import { formatBigNum } from 'utils/formatBigNum'
import { CurrencyUtils, parseWad } from 'utils/formatCurrency'

export default function ConfirmPayOwnerModal({
  visible,
  currency,
  weiAmount,
  ticketSymbol,
  onOk,
  onCancel,
}: {
  visible?: boolean
  currency?: BudgetCurrency
  weiAmount?: BigNumber
  ticketSymbol?: string
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const {
    contracts,
    transactor,
    userAddress,
    currentBudget,
    weth,
    usdPerEth,
  } = useContext(UserContext)

  const currencyUtils = new CurrencyUtils(usdPerEth)

  function pay() {
    if (!contracts || !currentBudget || !transactor) return

    // TODO add note input

    transactor(contracts.Juicer, 'pay', [
      currentBudget.project,
      weiAmount?.toHexString(),
      userAddress,
      '',
    ])

    if (onOk) onOk()
  }

  const payerPercentage = currentBudget
    ? BigNumber.from(100)
        .sub(currentBudget.p)
        .toHexString()
    : undefined

  const budgetId = currentBudget?.id.gt(0)
    ? currentBudget.id.toHexString()
    : currentBudget?.previous.toHexString()

  const currencyAmount =
    formatBudgetCurrency(currency) === 'USD'
      ? parseWad(currencyUtils.weiToUsd(weiAmount)?.toString())
      : weiAmount

  const receivedTickets = useContractReader<BigNumber>({
    contract: ContractName.BudgetStore,
    functionName: 'getWeightedRate',
    args: useMemo(
      () => [budgetId, currencyAmount?.toHexString(), payerPercentage],
      [weiAmount, payerPercentage],
    ),
  })

  const ownerTickets = useContractReader<BigNumber>({
    contract: ContractName.BudgetStore,
    functionName: 'getWeightedRate',
    args: useMemo(
      () => [
        budgetId,
        currencyAmount?.toHexString(),
        currentBudget?.p.toHexString(),
      ],
      [weiAmount, currentBudget?.p],
    ),
  })

  return (
    <Modal
      title={'Pay ' + currentBudget?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Project">
          {currentBudget?.project}
        </Descriptions.Item>
        <Descriptions.Item label="Pay amount">
          {formatEther(weiAmount ?? 0)} {weth?.symbol}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for you">
          {formatBigNum(receivedTickets)} {ticketSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for owner">
          {formatBigNum(ownerTickets)} {ticketSymbol}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
