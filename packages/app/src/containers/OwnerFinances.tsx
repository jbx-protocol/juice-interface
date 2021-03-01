import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Col, Input, Row, Space } from 'antd'
import React, { useState } from 'react'

import BudgetDetail from '../components/BudgetDetail'
import BudgetsHistory from '../components/BudgetsHistory'
import { CardSection } from '../components/CardSection'
import ApproveSpend from '../components/modals/ApproveSpendModal'
import ConfirmPayOwnerModal from '../components/modals/ConfirmPayOwnerModal'
import { ContractName } from '../constants/contract-name'
import useContractReader from '../hooks/ContractReader'
import { useProviderAddress } from '../hooks/ProviderAddress'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { bigNumbersDiff } from '../utils/bigNumbersDiff'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'
import ReconfigureBudget from './ReconfigureBudget'
import { formatBigNum } from '../utils/formatBigNum'

export default function OwnerFinances({
  currentBudget,
  contracts,
  transactor,
  owner,
  onNeedProvider,
  userProvider,
  ticketAddress,
}: {
  currentBudget?: Budget
  contracts?: Contracts
  transactor?: Transactor
  owner?: string
  ticketAddress?: string
  userProvider?: JsonRpcProvider
  onNeedProvider: () => Promise<void>
}) {
  const [payerTickets, setPayerTickets] = useState<BigNumber>()
  const [ownerTickets, setOwnerTickets] = useState<BigNumber>()
  const [payAmount, setPayAmount] = useState<number>(0)
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)
  const [approveModalVisible, setApproveModalVisible] = useState<boolean>(false)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const wantTokenContract = erc20Contract(currentBudget?.want)
  const userAddress = useProviderAddress(userProvider)

  const wantTokenSymbol = useContractReader<string>({
    contract: wantTokenContract,
    functionName: 'symbol',
  })

  const ticketSymbol = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'symbol',
  })

  const queuedBudget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
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

  const allowance = useContractReader<BigNumber>({
    contract: wantTokenContract,
    functionName: 'allowance',
    args: [userAddress, contracts?.Juicer?.address],
    valueDidChange: bigNumbersDiff,
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
    if (!allowance || !payAmount) return

    if (allowance.lt(payAmount)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
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
                <Button type="primary" onClick={pay} disabled={!payAmount}>
                  Pay project
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
                    {orEmpty(formatBigNum(ownerTickets))} {ticketSymbol} for
                    owner
                  </div>
                  <div>
                    {orEmpty(formatBigNum(payerTickets))} {ticketSymbol} for you
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
              <Button onClick={() => setReconfigureModalVisible(true)}>
                Reconfigure budget
              </Button>
              <ReconfigureBudget
                transactor={transactor}
                contracts={contracts}
                currentValue={currentBudget}
                visible={reconfigureModalVisible}
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

      <ApproveSpend
        visible={approveModalVisible}
        contracts={contracts}
        transactor={transactor}
        userProvider={userProvider}
        wantTokenAddress={currentBudget?.want}
        wantTokenSymbol={wantTokenSymbol}
        initialAmount={BigNumber.from(payAmount)}
        allowance={allowance}
        onOk={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        contracts={contracts}
        transactor={transactor}
        budget={currentBudget}
        userAddress={userAddress}
        onOk={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        ticketSymbol={ticketSymbol}
        wantTokenSymbol={wantTokenSymbol}
        amount={BigNumber.from(payAmount)}
        receivedTickets={payerTickets}
        ownerTickets={ownerTickets}
      />
    </Space>
  )
}
