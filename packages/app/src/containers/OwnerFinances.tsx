import { Button, Col, Divider, Input, Row, Space } from 'antd'
import React, { useState } from 'react'
import Web3 from 'web3'

import BudgetDetail from '../components/BudgetDetail'
import BudgetsHistory from '../components/BudgetsHistory'
import { CardSection } from '../components/CardSection'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import ReconfigureBudget from './ReconfigureBudget'

export default function OwnerFinances({
  currentBudget,
  userAddress,
  contracts,
  transactor,
  owner,
  onNeedProvider,
}: {
  currentBudget?: Budget
  userAddress?: string
  contracts?: Contracts
  transactor?: Transactor
  owner?: string
  onNeedProvider: () => Promise<void>
}) {
  const [loadingPayOwner, setLoadingPayOwner] = useState<boolean>()
  const [sustainAmount, setSustainAmount] = useState<number>(0)
  const [showReconfigureModal, setShowReconfigureModal] = useState<boolean>()

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(currentBudget?.want),
    functionName: 'name',
  })

  const queuedBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getQueuedBudget',
    args: [owner],
  })

  function payOwner() {
    if (!transactor || !contracts || !currentBudget) return onNeedProvider()

    setLoadingPayOwner(true)

    const eth = new Web3(Web3.givenProvider).eth

    const amount =
      sustainAmount !== undefined
        ? eth.abi.encodeParameter('uint256', sustainAmount)
        : undefined

    console.log('🧃 Calling Juicer.sustain(owner, amount, userAddress)', {
      owner: currentBudget.owner,
      amount,
      userAddress,
    })

    transactor(
      contracts.Juicer.payOwner(currentBudget.owner, amount, userAddress),
      () => {
        setSustainAmount(0)
        setLoadingPayOwner(false)
      },
      () => {
        setLoadingPayOwner(false)
      },
    )
  }

  const spacing = 30

  const isOwner = owner === userAddress

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
              <Divider style={{ margin: 0 }} />
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
                  suffix={wantTokenName}
                  type="number"
                  onChange={e => setSustainAmount(parseFloat(e.target.value))}
                />
                <Button
                  type="primary"
                  onClick={payOwner}
                  loading={loadingPayOwner}
                >
                  Pay owner
                </Button>
              </Space>
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
