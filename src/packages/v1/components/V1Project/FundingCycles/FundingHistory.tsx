import { CaretRightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'

import { BigNumber } from '@ethersproject/bignumber'
import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import Loading from 'components/Loading'
import useContractReader from 'packages/v1/hooks/contractReader/useContractReader'
import { V1ContractName } from 'packages/v1/models/contracts'
import { V1CurrencyOption } from 'packages/v1/models/currencyOption'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { deepEqFundingCycles } from 'packages/v1/utils/deepEqFundingCycles'
import { hasFundingTarget } from 'packages/v1/utils/fundingCycle'
import { useCallback, useState } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { formatWad } from 'utils/format/formatNumber'

import FundingCycleDetails from 'packages/v1/components/shared/FundingCycle/FundingCycleDetails'
import { V1CurrencyName } from 'packages/v1/utils/currency'
import { classNames } from 'utils/classNames'

export default function FundingHistory({
  startId,
}: {
  startId: BigNumber | undefined
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const [fundingCycles, setFundingCycles] = useState<V1FundingCycle[]>([])
  const [cycleIds, setCycleIds] = useState<BigNumber[]>([])

  //startId = currentFC.basedOn
  if (startId?.gt(0) && !cycleIds.length) setCycleIds([startId])

  const allCyclesLoaded = fundingCycles.length >= cycleIds.length
  const cycleNumber = allCyclesLoaded
    ? undefined
    : cycleIds[cycleIds.length - 1]
  const selectedFC =
    selectedIndex !== undefined ? fundingCycles[selectedIndex] : undefined

  useContractReader<V1FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'get',
    args: cycleNumber ? [cycleNumber] : null,
    valueDidChange: useCallback(
      (a: V1FundingCycle | undefined, b: V1FundingCycle | undefined) =>
        !deepEqFundingCycles(a, b),
      [],
    ),
    callback: useCallback(
      (cycle: V1FundingCycle | undefined) => {
        if (
          !cycle ||
          !cycleNumber ||
          cycleIds.includes(cycle.basedOn) ||
          cycle.id.eq(0)
        )
          return

        setFundingCycles([...fundingCycles, cycle])
        setCycleIds([
          ...cycleIds,
          ...(cycle.basedOn.toNumber() > 0 ? [cycle.basedOn] : []),
        ])
      },
      [cycleNumber, cycleIds, fundingCycles],
    ),
  })

  const fundingCycleElems = (
    <Space direction="vertical" size="large" className="w-full">
      {fundingCycles.length ? (
        fundingCycles.map((cycle, i) => (
          <div
            className={classNames(
              'flex cursor-pointer items-baseline justify-between',
              i < fundingCycles.length - 1
                ? 'border-b border-grey-400 pb-5 dark:border-slate-200'
                : '',
            )}
            key={cycle.id.toString()}
            onClick={() => setSelectedIndex(i)}
          >
            <Space align="baseline">
              <h3>#{cycle.number.toString()}</h3>

              <div className="ml-2 text-sm">
                <CurrencySymbol
                  currency={V1CurrencyName(
                    cycle.currency.toNumber() as V1CurrencyOption,
                  )}
                />
                {hasFundingTarget(cycle) ? (
                  <>
                    <Trans>
                      {formatWad(cycle.tapped, { precision: 2 })}/
                      {formatWad(cycle.target, { precision: 2 })} withdrawn
                    </Trans>
                  </>
                ) : (
                  <>
                    <Trans>
                      {formatWad(cycle.tapped, { precision: 2 })} withdrawn
                    </Trans>
                  </>
                )}
              </div>
            </Space>

            <div className="flex-1"></div>

            <Space className="text-sm" align="baseline">
              {formatHistoricalDate(
                cycle.start.add(cycle.duration.mul(86400)).mul(1000).toNumber(),
              )}
              <CaretRightOutlined />
            </Space>
          </div>
        ))
      ) : (
        <div>
          <Trans>No past cycles</Trans>
        </div>
      )}
    </Space>
  )

  return (
    <div>
      {fundingCycleElems}

      {allCyclesLoaded ? null : <Loading />}

      {selectedFC && (
        <Modal
          open={!!selectedFC}
          width={600}
          title={`Cycle #${selectedFC.number.toString()}`}
          onCancel={() => setSelectedIndex(undefined)}
          onOk={() => setSelectedIndex(undefined)}
          cancelButtonProps={{ hidden: true }}
          okText={t`Done`}
        >
          <FundingCycleDetails fundingCycle={selectedFC} />
        </Modal>
      )}
    </div>
  )
}
