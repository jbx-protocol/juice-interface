import { t } from '@lingui/macro'
import { usePayEventsQuery, useProjectQuery } from 'generated/v4/graphql'
import { Ether } from 'juice-sdk-core'
import { useJBChainId } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import { useCallback, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { emitErrorNotification } from 'utils/notifications'

export const useDownloadPayments = (blockNumber: number, projectId: number) => {
  const [isLoading, setIsLoading] = useState(false)
  const chainId = useJBChainId()
  const { version } = useV4V5Version()

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      chainId: Number(chainId),
      projectId,
      version: version
    },
    skip: !chainId,
  })

  const { data: payEventsData } = usePayEventsQuery({
    client: bendystrawClient,
    variables: {
      orderBy: 'timestamp',
      orderDirection: 'desc',
      where: {
        suckerGroupId: project?.project?.suckerGroupId,
      },
    },
    skip: !project?.project?.suckerGroupId,
  })

  const downloadPayments = useCallback(async () => {
    if (blockNumber === undefined || !projectId) return

    setIsLoading(true)

    const rows = [
      [
        t`Date`,
        t`ETH paid`,
        // t`USD value of ETH paid`, //TODO: not working for V4 (check subgraph
        t`Payer`,
        t`Transaction hash`,
        t`Chain id`,
      ], // CSV header row
    ]

    try {
      const payEvents = payEventsData?.payEvents.items

      if (!payEvents) {
        emitErrorNotification(t`Error loading payouts`)
        throw new Error('No data.')
      }

      // Interpolate distributions into payouts.
      let x = 0
      payEvents.forEach(p => {
        let date = new Date((p.timestamp ?? 0) * 1000).toUTCString()

        if (date.includes(', ')) date = date.split(', ')[1]

        rows.push([
          date,
          new Ether(p.amount).format(),
          // p.amountUSD ? p.amountUSD.format() : 'n/a', TODO: not working for V4 (check subgraph)
          p.beneficiary,
          p.txHash,
          p.chainId.toString(),
        ])
      })

      downloadCsvFile(`payments_v4_p${projectId}_block-${blockNumber}`, rows)
    } catch (e) {
      console.error('Error downloading payouts', e)
      emitErrorNotification(t`Error downloading payouts, try again.`)
    } finally {
      setIsLoading(false)
    }
  }, [blockNumber, projectId, payEventsData])

  return { downloadPayments, isLoading }
}
