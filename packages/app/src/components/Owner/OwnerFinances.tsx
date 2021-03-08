import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { Button, Col, Input, Row, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { Budget } from 'models/budget'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formattedBudgetCurrency } from 'utils/budgetCurrency'

import ApproveSpendModal from '../modals/ApproveSpendModal'
import ConfirmPayOwnerModal from '../modals/ConfirmPayOwnerModal'
import ReconfigureBudgetModal from '../modals/ReconfigureBudgetModal'
import { CardSection } from '../shared/CardSection'
import BudgetDetail from './BudgetDetail'
import BudgetsHistory from './BudgetsHistory'

export default function OwnerFinances({
  owner,
  ticketAddress,
}: {
  owner?: string
  ticketAddress?: string
}) {
  const {
    weth,
    contracts,
    transactor,
    onNeedProvider,
    userAddress,
    currentBudget,
    ethInCents,
  } = useContext(UserContext)

  const [currencyAmount, setCurrencyAmount] = useState<BigNumber>()
  const [weiPayAmount, setWeiPayAmount] = useState<BigNumber>(BigNumber.from(0))
  const [reconfigureModalVisible, setReconfigureModalVisible] = useState<
    boolean
  >(false)
  const [approveModalVisible, setApproveModalVisible] = useState<boolean>(false)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const ticketContract = useErc20Contract(ticketAddress)

  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })

  const queuedBudget = useContractReader<Budget>({
    contract: ContractName.BudgetStore,
    functionName: 'getQueuedBudget',
    args: owner ? [owner] : null,
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
    contract: weth?.contract,
    functionName: 'allowance',
    args:
      userAddress && contracts?.Juicer
        ? [userAddress, contracts?.Juicer?.address]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const isOwner = owner === userAddress

  function updatePayAmount(inputAmount?: string) {
    if (!currentBudget || !ethInCents) return

    if (currentBudget.currency.eq(0)) {
      const wei = parseEther(inputAmount || '0')
      setWeiPayAmount(wei)
      setCurrencyAmount(wei)
      return
    }

    setCurrencyAmount(
      BigNumber.from(Math.round(parseFloat(inputAmount || '0') * 100)),
    )

    if (!inputAmount) {
      setWeiPayAmount(BigNumber.from(0))
      return
    }

    const ethAmount = (
      ((parseFloat(inputAmount) ?? 0) / ethInCents.toNumber()) *
      100
    ).toPrecision(12)

    const weiAmount = parseEther(ethAmount?.toString() ?? 0)

    setWeiPayAmount(weiAmount)
  }

  function pay() {
    if (!transactor || !contracts || !currentBudget) return onNeedProvider()
    if (!allowance || !weiPayAmount) return

    if (allowance.lt(weiPayAmount)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
  }

  const spacing = 30

  const payAmountInUSD = useMemo((): string => {
    if (!ethInCents) return '--'

    try {
      const amt = formatEther(weiPayAmount.toString()).split('.')
      if (amt[1]) amt[1] = amt[1].substr(0, 4)
      return amt.join('.')
    } catch (e) {
      console.log(e)
      return '--'
    }
  }, [weiPayAmount, ethInCents])

  return (
    <Space size={spacing} direction="vertical">
      <Row gutter={spacing}>
        <Col span={12}>
          {
            <CardSection header="Active Budget">
              {currentBudget ? <BudgetDetail budget={currentBudget} /> : null}
              <Space
                style={{
                  flex: 1,
                  width: '100%',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  padding: 25,
                }}
              >
                <div style={{ textAlign: 'right', width: 300 }}>
                  <Input
                    name="sustain"
                    placeholder="0"
                    suffix={formattedBudgetCurrency(currentBudget?.currency)}
                    type="number"
                    onChange={e => updatePayAmount(e.target.value)}
                  />

                  {currentBudget?.currency.eq(1) ? (
                    <div>
                      Paid as {payAmountInUSD} {weth?.symbol}
                    </div>
                  ) : null}
                </div>

                <Button type="primary" onClick={pay} disabled={!weiPayAmount}>
                  Pay project
                </Button>
              </Space>
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
              <ReconfigureBudgetModal visible={reconfigureModalVisible} />
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
        initialAmount={weiPayAmount}
        allowance={allowance}
        onOk={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onOk={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        ticketSymbol={ticketSymbol}
        currencyAmount={currencyAmount}
        weiAmount={weiPayAmount}
      />
    </Space>
  )
}
