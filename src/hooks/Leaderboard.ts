import { daysToMillis } from 'components/VolumeChart/daysToMillis'
import { BigNumber } from 'ethers'
import { PayEvent } from 'generated/graphql'
import { useEffect, useMemo, useState } from 'react'
import { querySubgraphExhaustive } from 'utils/graph'

export function useLeaderboard({
  count,
  windowDays,
}: {
  count: number
  windowDays: number | null
}) {
  const [payEvents, setPayEvents] =
    useState<Pick<PayEvent, 'amount' | 'from'>[]>()

  console.log('asdf windowDays', windowDays)

  useEffect(() => {
    // Get all payments within window
    async function loadPayEvents() {
      if (windowDays === null) return

      const _payEvents = await querySubgraphExhaustive({
        entity: 'payEvent',
        orderBy: 'timestamp',
        orderDirection: 'desc',
        keys: ['amount', 'from'],
        where: [
          {
            key: 'timestamp',
            operator: 'gte',
            value: Math.round(
              (new Date().valueOf() - daysToMillis(windowDays)) / 1000,
            ),
          },
        ],
      })

      setPayEvents(_payEvents)
    }

    loadPayEvents()
  }, [windowDays])

  const walletScores = useMemo(
    () =>
      payEvents?.reduce<Record<string, BigNumber>>(
        (acc, curr) => ({
          ...acc,
          [curr.from]: (acc[curr.from] ?? BigNumber.from(0)).add(curr.amount),
        }),
        {},
      ),
    [payEvents],
  )

  console.log('asdf', { payEvents, walletScores })

  return useMemo(() => {
    if (!walletScores) return []

    return Object.entries(walletScores)
      .sort(([, totalPaidA], [, totalPaidB]) =>
        totalPaidA.lt(totalPaidB) ? 1 : -1,
      )
      .map(([id, totalPaid]) => ({ id, totalPaid }))
      .slice(0, count)
  }, [count, walletScores])
}
