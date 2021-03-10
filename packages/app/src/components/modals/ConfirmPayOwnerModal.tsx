import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useMemo } from 'react'
import { formatBudgetCurrency } from 'utils/budgetCurrency'
import { formatWad, parseWad } from 'utils/formatCurrency'

import { useCurrencyConverter } from '../../hooks/CurrencyConverter'

export default function ConfirmPayOwnerModal({
  visible,
  currency,
  usdAmount,
  ticketSymbol,
  onOk,
  onCancel,
}: {
  visible?: boolean
  currency: BudgetCurrency | undefined
  usdAmount: number | undefined
  ticketSymbol: string | undefined
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const {
    contracts,
    transactor,
    userAddress,
    currentBudget,
    weth,
  } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const weiAmount = converter.usdToWei(usdAmount)

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
      ? parseWad(converter.weiToUsd(weiAmount)?.toString())
      : weiAmount

  const receivedTickets = useContractReader<BigNumber>({
    contract: ContractName.BudgetStore,
    functionName: 'getWeightedRate',
    args: useMemo(
      () => [budgetId, currencyAmount?.toHexString(), payerPercentage],
      [payerPercentage, budgetId, currencyAmount],
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
      [budgetId, currencyAmount, currentBudget?.p],
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
          {usdAmount} USD ({formatWad(weiAmount)} {weth?.symbol})
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for you">
          {formatWad(receivedTickets)} {ticketSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for owner">
          {formatWad(ownerTickets)} {ticketSymbol}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
