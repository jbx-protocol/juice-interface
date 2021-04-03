import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input } from 'antd'
import ApproveSpendModal from 'components/modals/ApproveSpendModal'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { Budget } from 'models/budget'
import { BudgetCurrency } from 'models/budget-currency'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React, { useContext, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad } from 'utils/formatCurrency'

export default function Pay({
  budget,
  project,
  projectId,
}: {
  budget: Budget | undefined
  project: ProjectIdentifier | undefined
  projectId: BigNumber | undefined
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

  const payAmountInWeth = (): string => {
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

    return '--'
  }

  function pay() {
    if (!transactor || !contracts) return onNeedProvider()
    if (!allowance || !weiPayAmt) return

    if (allowance.lt(weiPayAmt)) {
      setApproveModalVisible(true)
      return
    }

    setPayModalVisible(true)
  }

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
          <div style={{ textAlign: 'right', flex: 1, marginRight: 10 }}>
            <Input
              style={{ width: '100%' }}
              name="sustain"
              placeholder="0"
              suffix="USD"
              type="number"
              disabled={budget?.configured.eq(0)}
              onChange={e => setPayAmount(e.target.value)}
            />

            <div>
              Paid as {payAmountInWeth()} {weth?.symbol}
            </div>
          </div>

          <Button type="primary" onClick={weiPayAmt ? pay : undefined}>
            Pay project
          </Button>
        </div>
      </div>

      <ApproveSpendModal
        visible={approveModalVisible}
        initialWeiAmt={weiPayAmt}
        allowance={allowance}
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
        currency={budget?.currency.toString() as BudgetCurrency}
        usdAmount={parseFloat(payAmount ?? '0')}
      />
    </div>
  )
}
