import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import { formatBigNum } from 'utils/formatBigNum'

export default function ConfirmPayOwnerModal({
  visible,
  amount,
  receivedTickets,
  ownerTickets,
  ticketSymbol,
  onOk,
  onCancel,
}: {
  visible?: boolean
  ticketSymbol?: string
  amount?: BigNumber
  receivedTickets?: BigNumber
  ownerTickets?: BigNumber
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { contracts, transactor, userAddress, currentBudget } = useContext(
    UserContext,
  )

  function pay() {
    if (!contracts || !currentBudget || !transactor) return

    // TODO add note input

    transactor(contracts.Juicer, 'pay', [
      currentBudget.project,
      amount,
      userAddress,
    ])

    if (onOk) onOk()
  }

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
          {formatBigNum(amount)} ETH
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
