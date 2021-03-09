import { BigNumber } from '@ethersproject/bignumber'
import { Button, Col, Input, Row, Space } from 'antd'
import { ContractName } from 'constants/contract-name'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { Budget } from 'models/budget'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { CurrencyUtils, formatWad } from 'utils/formatCurrency'

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
    usdPerEth,
  } = useContext(UserContext)

  const currencyUtils = new CurrencyUtils(usdPerEth)

  const [payAmount, setPayAmount] = useState<string>()
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

  const weiPayAmt = currencyUtils.usdToWei(payAmount)

  function pay() {
    if (!transactor || !contracts || !currentBudget) return onNeedProvider()
    if (!allowance || !weiPayAmt) return

    if (allowance.lt(weiPayAmt)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
  }

  const payAmountInWeth = useMemo((): string => {
    const empty = '--'

    try {
      const amt = formatWad(weiPayAmt)?.split('.')
      if (amt && amt[1]) {
        // Always 4 decimal places
        amt[1] = amt[1].substr(0, 4)
        return amt.join('.')
      }
    } catch (e) {
      console.log(e)
    }

    return empty
  }, [payAmount])

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
                    suffix="USD"
                    type="number"
                    onChange={e => setPayAmount(e.target.value)}
                  />

                  <div>
                    Paid as {payAmountInWeth} {weth?.symbol}
                  </div>
                </div>

                <Button type="primary" onClick={pay} disabled={!weiPayAmt}>
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
        initialWeiAmt={weiPayAmt}
        allowance={allowance}
        onOk={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onOk={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        ticketSymbol={ticketSymbol}
        weiAmount={weiPayAmt}
      />
    </Space>
  )
}
