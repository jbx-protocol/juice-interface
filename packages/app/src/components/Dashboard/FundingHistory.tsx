import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { useCallback, useState } from 'react'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { formatWad } from 'utils/formatCurrency'

import { CardSection } from '../shared/CardSection'
import FundingCycleDetails from './FundingCycleDetails'

export default function FundingHistory({
  startId,
}: {
  startId: BigNumber | undefined
}) {
  const [fundingCycles, setFundingCycles] = useState<FundingCycle[]>([])
  const [cycleNumbers, setCycleNumbers] = useState<BigNumber[]>([])

  if (startId?.gt(0) && !cycleNumbers.length) setCycleNumbers([startId])

  const allCyclesLoaded = fundingCycles.length >= cycleNumbers.length
  const cycleNumber = allCyclesLoaded
    ? undefined
    : cycleNumbers[cycleNumbers.length - 1]

  useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'get',
    args: cycleNumber ? [cycleNumber] : null,
    valueDidChange: (a, b) => !deepEqFundingCycles(a, b),
    callback: useCallback(
      cycle => {
        if (
          !cycle ||
          !cycleNumber ||
          cycleNumbers.includes(cycle.previous) ||
          cycle.id.eq(0)
        )
          return

        setFundingCycles([...fundingCycles, cycle])
        setCycleNumbers([
          ...cycleNumbers,
          ...(cycle.previous.toNumber() > 0 ? [cycle.previous] : []),
        ])
      },
      [cycleNumber, cycleNumbers, fundingCycles],
    ),
  })

  const fundingCycleElems = (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {fundingCycles.length ? (
        fundingCycles.map(cycle => (
          <div key={cycle.id.toString()} style={{ padding: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <h2>#{cycle.number.toString()}</h2>
              <div>
                <span style={{ fontSize: '1rem' }}>
                  <CurrencySymbol currency={cycle.currency} />
                  {formatWad(cycle.tapped)}
                </span>{' '}
                withdrawn
              </div>
            </div>
            <FundingCycleDetails fundingCycle={cycle} />
          </div>
        ))
      ) : (
        <div style={{ padding: 25 }}>No previous funding cycles</div>
      )}
    </Space>
  )

  return (
    <CardSection>
      {fundingCycleElems}

      {allCyclesLoaded ? null : <div style={{ padding: 25 }}>Loading...</div>}
    </CardSection>
  )
}
