import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Input, Row, Space } from 'antd'
import React, { useState } from 'react'

import BudgetDetail from '../components/BudgetDetail'
import BudgetsHistory from '../components/BudgetsHistory'
import { CardSection } from '../components/CardSection'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'
import ReconfigureBudget from './ReconfigureBudget'

export default function OwnerFinances({
  currentBudget,
  userAddress,
  contracts,
  transactor,
  owner,
  onNeedProvider,
  ticketAddress,
}: {
  currentBudget?: Budget
  userAddress?: string
  contracts?: Contracts
  transactor?: Transactor
  owner?: string
  ticketAddress?: string
  onNeedProvider: () => Promise<void>
}) {
  const [payerTickets, setPayerTickets] = useState<BigNumber>()
  const [ownerTickets, setOwnerTickets] = useState<BigNumber>()
  const [loadingPay, setLoadingPay] = useState<boolean>()
  const [payAmount, setPayAmount] = useState<number>(0)
  const [showReconfigureModal, setShowReconfigureModal] = useState<boolean>()

  const wantTokenSymbol = useContractReader<string>({
    contract: erc20Contract(currentBudget?.want),
    functionName: 'symbol',
  })

  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'symbol',
  })

  const queuedBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getQueuedBudget',
    args: [owner],
    updateOn: [
      {
        contract: contracts?.BudgetStore,
        eventName: 'Configure',
        topics: owner ? [[], owner] : undefined,
      },
    ],
  })

  const isOwner = owner === userAddress

  function updatePayAmount(amount: number) {
    if (!currentBudget) return

    const _amount = amount || 0

    const ticketsRatio = (percentage: BigNumber) =>
      percentage &&
      currentBudget.weight
        .mul(percentage)
        .div(currentBudget.target)
        .div(100)

    setPayAmount(_amount)

    setOwnerTickets(
      _amount ? ticketsRatio(currentBudget.p).mul(_amount) : undefined,
    )
    setPayerTickets(
      _amount
        ? ticketsRatio(
            BigNumber.from(100)
              .sub(currentBudget.p ?? 0)
              .mul(_amount),
          )
        : undefined,
    )
  }

  function pay() {
    if (!transactor || !contracts || !currentBudget) return onNeedProvider()

    setLoadingPay(true)

    transactor(
      contracts.Juicer,
      'pay',
      [currentBudget.project, BigNumber.from(payAmount ?? 0), userAddress],
      {
        onDone: () => setLoadingPay(false),
        onConfirmed: () => setPayAmount(0),
      },
    )
  }

  const spacing = 30

  return (
    <Space size={spacing} direction="vertical">
      <Row gutter={spacing}>
        <Col span={12}>
          {
            <CardSection header="Active Budget">
              {currentBudget ? (
                <BudgetDetail
                  budget={currentBudget}
                  userAddress={userAddress}
                  contracts={contracts}
                  transactor={transactor}
                  onNeedProvider={onNeedProvider}
                />
              ) : null}
              <Space
                style={{
                  width: '100%',
                  justifyContent: 'flex-end',
                  padding: 25,
                }}
              >
                <Input
                  name="sustain"
                  placeholder="0"
                  suffix={wantTokenSymbol}
                  type="number"
                  onChange={e => updatePayAmount(parseFloat(e.target.value))}
                />
                <Button
                  type="primary"
                  onClick={pay}
                  loading={loadingPay}
                  disabled={!payAmount}
                >
                  Pay owner
                </Button>
              </Space>
              {addressExists(ticketAddress) ? (
                <div
                  style={{
                    padding: 25,
                    paddingTop: 0,
                    textAlign: 'right',
                  }}
                >
                  <div>
                    {orEmpty(ownerTickets?.toString())} {ticketSymbol} for owner
                  </div>
                  <div>
                    {orEmpty(payerTickets?.toString())} {ticketSymbol} for you
                  </div>
                </div>
              ) : null}
            </CardSection>
          }
        </Col>

        <Col span={12}>
          <CardSection header="Next Budget">
            {queuedBudget ? (
              <BudgetDetail
                userAddress={userAddress}
                budget={queuedBudget}
                contracts={contracts}
                transactor={transactor}
                onNeedProvider={onNeedProvider}
              />
            ) : (
              <div style={{ padding: 25 }}>No upcoming budgets</div>
            )}
          </CardSection>
          {isOwner ? (
            <div style={{ marginTop: 40, textAlign: 'right' }}>
              <Button onClick={() => setShowReconfigureModal(true)}>
                Reconfigure budget
              </Button>
              <ReconfigureBudget
                transactor={transactor}
                contracts={contracts}
                currentValue={currentBudget}
                visible={showReconfigureModal}
                onCancel={() => setShowReconfigureModal(false)}
              />
            </div>
          ) : null}
        </Col>
      </Row>

      <Row gutter={spacing}>
        <Col span={12}>
          <CardSection header="Budget History">
            <BudgetsHistory
              startId={currentBudget?.previous}
              contracts={contracts}
              transactor={transactor}
              userAddress={userAddress}
              onNeedProvider={onNeedProvider}
            />
          </CardSection>
        </Col>
      </Row>
    </Space>
  )
}
