import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import Loading from 'components/shared/Loading'
import { ThemeContext } from 'contexts/themeContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'
import { useCallback, useContext, useState } from 'react'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'
import { formatWad } from 'utils/formatNumber'

import FundingCycleDetails from './FundingCycleDetails'

export default function FundingHistory({
  startId,
}: {
  startId: BigNumber | undefined
}) {
  const [fundingCycles, setFundingCycles] = useState<FundingCycle[]>([])
  const [cycleNumbers, setCycleNumbers] = useState<BigNumber[]>([])
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
        fundingCycles.map((cycle, i) => (
          <div
            key={cycle.id.toString()}
            style={
              i < fundingCycles.length - 1
                ? {
                    paddingBottom: 20,
                    borderBottom: '1px solid ' + colors.stroke.tertiary,
                  }
                : {}
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <h3>#{cycle.number.toString()}</h3>
              <div>
                <span style={{ fontSize: '.8rem' }}>
                  <CurrencySymbol currency={cycle.currency} />
                  {formatWad(cycle.tapped)}/{formatWad(cycle.target)}
                </span>{' '}
                withdrawn
              </div>
            </div>

            <FundingCycleDetails fundingCycle={cycle} />
          </div>
        ))
      ) : (
        <div>No previous funding cycles</div>
      )}
    </Space>
  )

  return (
    <div>
      {fundingCycleElems}

      {allCyclesLoaded ? null : <Loading />}
    </div>
  )
}
