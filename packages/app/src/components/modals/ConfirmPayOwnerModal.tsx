import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Modal } from 'antd'
import React from 'react'

import { Budget } from '../../models/budget'
import { Contracts } from '../../models/contracts'
import { Transactor } from '../../models/transactor'

export default function ConfirmPayOwnerModal({
  visible,
  budget,
  transactor,
  contracts,
  amount,
  receivedTickets,
  ownerTickets,
  wantTokenSymbol,
  ticketSymbol,
  userAddress,
  onOk,
  onCancel,
}: {
  visible?: boolean
  budget?: Budget
  transactor?: Transactor
  contracts?: Contracts
  userAddress?: string
  wantTokenSymbol?: string
  ticketSymbol?: string
  amount?: BigNumber
  receivedTickets?: BigNumber
  ownerTickets?: BigNumber
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
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
          {amount?.toString()} {wantTokenSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for you">
          {receivedTickets?.toString()} {ticketSymbol}
        </Descriptions.Item>
        <Descriptions.Item label="Tickets for owner">
          {ownerTickets?.toString()} {ticketSymbol}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
