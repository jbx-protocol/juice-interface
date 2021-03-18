import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useMemo } from 'react'
import { budgetCurrencyName } from 'utils/budgetCurrency'
import { formatWad, parsePerMille, parseWad } from 'utils/formatCurrency'

export default function ConfirmPayOwnerModal({
  budget,
  visible,
  currency,
  usdAmount,
  ticketSymbol,
  onOk,
  onCancel,
}: {
  budget: Budget | undefined | null
  visible?: boolean
  currency: BudgetCurrency | undefined
  usdAmount: number | undefined
  ticketSymbol: string | undefined
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { contracts, transactor, userAddress, weth } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const weiAmount = converter.usdToWei(usdAmount)

  function pay() {
    if (!contracts || !budget || !transactor) return

    // TODO add note input

    transactor(contracts.Juicer, 'pay', [
      budget.project,
      weiAmount?.toHexString(),
      userAddress,
      '',
    ])

    if (onOk) onOk()
  }

  const payerPercentage = budget
    ? parsePerMille('100')
        .sub(budget.reserved)
        .toHexString()
    : undefined

  const budgetId = budget?.id.gt(0)
    ? budget.id.toHexString()
    : budget?.previous.toHexString()

  const currencyAmount =
    budgetCurrencyName(currency) === 'USD'
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
        budget?.reserved.toHexString(),
      ],
      [budgetId, currencyAmount, budget?.reserved],
    ),
  })

  return (
    <Modal
      title={'Pay ' + budget?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Project">{budget?.project}</Descriptions.Item>
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
