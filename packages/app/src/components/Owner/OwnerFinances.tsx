import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Input, Row, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { Budget } from 'models/budget'
import { useContext, useState } from 'react'
import { addressExists } from 'utils/addressExists'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { erc20Contract } from 'utils/erc20Contract'
import { formatBigNum } from 'utils/formatBigNum'
import { orEmpty } from 'utils/orEmpty'

import ApproveSpendModal from '../modals/ApproveSpendModal'
import ConfirmPayOwnerModal from '../modals/ConfirmPayOwnerModal'
import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import BudgetDetail from './BudgetDetail'
import BudgetsHistory from './BudgetsHistory'

export default function OwnerFinances({
  currentBudget,
  owner,
  ticketAddress,
}: {
  currentBudget?: Budget
  owner?: string
  ticketAddress?: string
}) {
  const { contracts, transactor, onNeedProvider, userAddress } = useContext(
    UserContext,
  )

  const [payerTickets, setPayerTickets] = useState<BigNumber>()
  const [ownerTickets, setOwnerTickets] = useState<BigNumber>()
  const [payAmount, setPayAmount] = useState<number>(0)
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)
  const [approveModalVisible, setApproveModalVisible] = useState<boolean>(false)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const wantTokenContract = erc20Contract(currentBudget?.want)

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
    updateOn: owner
      ? [
          {
            contract: ContractName.BudgetStore,
            eventName: 'Configure',
            topics: [[], owner],
          },
        ]
      : undefined,
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
              {currentBudget ? <BudgetDetail budget={currentBudget} /> : null}
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
              <BudgetDetail budget={queuedBudget} />
            ) : (
              <div style={{ padding: 25 }}>No upcoming budgets</div>
            )}
          </CardSection>
          {isOwner ? (
            <div style={{ marginTop: 40, textAlign: 'right' }}>
              <Button onClick={() => setReconfigureModalVisible(true)}>
                Reconfigure budget
              </Button>
              <ReconfigureBudgetModal
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
            <BudgetsHistory startId={currentBudget?.previous} />
          </CardSection>
        </Col>
      </Row>

      <ApproveSpendModal
        visible={approveModalVisible}
        wantTokenAddress={currentBudget?.want}
        wantTokenSymbol={wantTokenSymbol}
        initialAmount={BigNumber.from(payAmount)}
        allowance={allowance}
        onOk={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        budget={currentBudget}
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
