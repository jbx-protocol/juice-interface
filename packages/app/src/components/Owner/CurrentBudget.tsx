import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Space } from 'antd'
import ApproveSpendModal from 'components/modals/ApproveSpendModal'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { useContext, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad } from 'utils/formatCurrency'

import BudgetDetail from './BudgetDetail'

export default function CurrentBudget({
  budget,
  ticketSymbol,
}: {
  budget: Budget | undefined | null
  ticketSymbol: string | undefined
}) {
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

  const weiPayAmt = converter.usdToWei(payAmount)

  function pay() {
    if (!transactor || !contracts || !budget) return onNeedProvider()
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
      const amt = fromWad(weiPayAmt)?.split('.')
      if (amt && amt[1]) {
        // Always 4 decimal places
        amt[1] = amt[1].substr(0, 4)
        return amt.join('.')
      }
    } catch (e) {
      console.log(e)
    }

    return empty
  }, [weiPayAmt])

  return (
    <div>
      {budget ? <BudgetDetail budget={budget} /> : null}
      <Space
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: 25,
          display: 'flex',
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <Input
            name="sustain"
            placeholder="0"
            suffix="USD"
            type="number"
            disabled={budget?.configured.eq(0)}
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

      <ApproveSpendModal
        visible={approveModalVisible}
        initialWeiAmt={weiPayAmt}
        allowance={allowance}
        onOk={() => setApproveModalVisible(false)}
        onCancel={() => setApproveModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        budget={budget}
        visible={payModalVisible}
        onOk={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        ticketSymbol={ticketSymbol}
        currency={budget?.currency.toString() as BudgetCurrency}
        usdAmount={parseFloat(payAmount ?? '0')}
      />
    </div>
  )
}
