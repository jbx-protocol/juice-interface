import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { ProjectIdentifier } from 'models/projectIdentifier'
import { useContext } from 'react'
import { budgetCurrencyName } from 'utils/budgetCurrency'
import { formatWad, parsePerMille, parseWad } from 'utils/formatCurrency'

export default function ConfirmPayOwnerModal({
  projectId,
  project,
  budget,
  visible,
  currency,
  usdAmount,
  onSuccess,
  onCancel,
}: {
  projectId: BigNumber
  project: ProjectIdentifier
  budget: Budget | null | undefined
  visible?: boolean
  currency: BudgetCurrency | undefined
  usdAmount: number | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { contracts, transactor, userAddress, weth } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const weiAmount = converter.usdToWei(usdAmount)

  function pay() {
    if (!contracts || !projectId || !transactor) return

    // TODO add note input

    transactor(
      contracts.Juicer,
      'pay',
      [projectId.toHexString(), weiAmount?.toHexString(), userAddress, ''],
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  const weightedRate = (
    budget: Budget | null | undefined,
    amount: BigNumber | undefined,
    percentage: BigNumber | undefined,
  ) => {
    return budget && amount && percentage
      ? budget.weight
          .div(budget.target)
          .mul(amount)
          .mul(percentage)
          .div(100)
      : undefined
  }

  const payerPercentage = budget
    ? parsePerMille('100').sub(budget.reserved)
    : undefined

  const currencyAmount =
    budgetCurrencyName(currency) === 'USD'
      ? parseWad(converter.weiToUsd(weiAmount)?.toString())
      : weiAmount

  const receivedTickets = weightedRate(budget, currencyAmount, payerPercentage)

  const ownerTickets = weightedRate(budget, currencyAmount, budget?.reserved)

  return (
    <Modal
      title={'Pay ' + project?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Project id">
          {projectId.toString()}
        </Descriptions.Item>
        <Descriptions.Item label="Pay amount">
          {usdAmount} USD ({formatWad(weiAmount)} {weth?.symbol})
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for you">
          {formatWad(receivedTickets)}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for owner">
          {formatWad(ownerTickets)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
