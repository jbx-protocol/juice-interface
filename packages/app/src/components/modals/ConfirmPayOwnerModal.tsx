import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { Budget } from 'models/budget'
import { useContext } from 'react'
import { formatBigNum } from 'utils/formatBigNum'

export default function ConfirmPayOwnerModal({
  visible,
  budget,
  amount,
  receivedTickets,
  ownerTickets,
  wantTokenSymbol,
  ticketSymbol,
  onOk,
  onCancel,
}: {
  visible?: boolean
  budget?: Budget
  wantTokenSymbol?: string
  ticketSymbol?: string
  amount?: BigNumber
  receivedTickets?: BigNumber
  ownerTickets?: BigNumber
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { contracts, transactor, userAddress } = useContext(UserContext)

  function pay() {
    if (!contracts || !budget || !transactor) return

    transactor(contracts.Juicer, 'pay', [budget.project, amount, userAddress])

    if (onOk) onOk()
  }

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
          {formatBigNum(amount)} {wantTokenSymbol}
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
