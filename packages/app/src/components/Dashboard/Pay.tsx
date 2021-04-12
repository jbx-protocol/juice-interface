import { BigNumber } from '@ethersproject/bignumber'
import { Button } from 'antd'
import ApproveSpendModal from 'components/modals/ApproveSpendModal'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React, { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { budgetCurrencyName } from 'utils/budgetCurrency'
import { formatWad, parsePerMille, parseWad } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'

export default function Pay({
  budget,
  project,
  projectId,
}: {
  budget: Budget | undefined
  project: ProjectIdentifier | undefined
  projectId: BigNumber | undefined
}) {
  const [payAs, setPayAs] = useState<BudgetCurrency>('1')
  const [payAmount, setPayAmount] = useState<string>()
  const [approveModalVisible, setApproveModalVisible] = useState<boolean>(false)
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)

  const {
    userAddress,
    weth,
    contracts,
    transactor,
    onNeedProvider,
  } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const allowance = useContractReader<BigNumber>({
    contract: weth?.contract,
    functionName: 'allowance',
    args:
      userAddress && contracts?.Juicer
        ? [userAddress, contracts?.Juicer?.address]
        : null,
    valueDidChange: bigNumbersDiff,
  })

  const weiPayAmt =
    payAs === '1' ? converter.usdToWei(payAmount) : parseWad(payAmount)

  function pay() {
    if (!transactor || !contracts) return onNeedProvider()
    if (!allowance || !weiPayAmt) return

    if (allowance.lt(weiPayAmt)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
  }

  const formatReceivedTickets = (amount: BigNumber) =>
    formatWad(
      budget
        ? weightedRate(
            budget,
            amount,
            parsePerMille('100').sub(budget.reserved),
          )
        : undefined,
    )

  if (!budget || !projectId || !project) return null

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            width: '100%',
          }}
        >
          <div style={{ flex: 1, marginRight: 10 }}>
            <FormattedNumberInput
              placeholder="0"
              disabled={budget?.configured.eq(0)}
              onChange={val => setPayAmount(val)}
              value={payAmount}
              min={0}
              accessory={
                <InputAccessoryButton
                  withArrow={true}
                  content={budgetCurrencyName(payAs)}
                  onClick={() => setPayAs(payAs === '0' ? '1' : '0')}
                />
              }
            />

            <div>
              Receive{' '}
              {payAmount && weiPayAmt?.gt(0) ? (
                formatReceivedTickets(
                  budgetCurrencyName(budget.currency) === 'USD'
                    ? weiPayAmt
                    : parseWad(payAmount),
                ) + ' Tickets'
              ) : (
                <span>
                  {formatReceivedTickets(
                    (payAs === '0' ? parseWad('1') : converter.usdToWei('1')) ??
                      BigNumber.from(0),
                  )}{' '}
                  tickets/
                  <CurrencySymbol currency={payAs} />
                </span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', minWidth: 150 }}>
            <Button
              style={{ width: '100%' }}
              type="primary"
              onClick={weiPayAmt ? pay : undefined}
            >
              Pay project
            </Button>
            {payAs === '1' ? (
              <div>
                Paid as <CurrencySymbol currency="0" />
                {formatWad(weiPayAmt) || '0'}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ApproveSpendModal
        visible={approveModalVisible}
        onSuccess={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        budget={budget}
        project={project}
        projectId={projectId}
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        usdAmount={parseFloat(payAmount ?? '0')}
      />
    </div>
  )
}
