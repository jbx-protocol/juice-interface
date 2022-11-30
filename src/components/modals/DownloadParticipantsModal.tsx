import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { emitErrorNotification } from 'utils/notifications'

import { useCallback, useContext, useEffect, useState } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { GraphQueryOpts, querySubgraphExhaustive } from 'utils/graph'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { PV_V1, PV_V1_1 } from 'constants/pv'
import { readProvider } from 'constants/readProvider'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { Participant } from 'models/subgraph-entities/vX/participant'
import { downloadCsvFile } from 'utils/csv'

export function DownloadParticipantsModal({
  tokenSymbol,
  open,
  onCancel,
}: {
  tokenSymbol: string | undefined
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId, projectMetadata, pv } = useContext(ProjectMetadataContext)

  const [latestBlockNumber, setLatestBlockNumber] = useState<number>()
  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    readProvider.getBlockNumber().then(val => {
      setLatestBlockNumber(val)
      setBlockNumber(val)
    })
  }, [])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId || !pv) return

    // Projects that migrate between 1 & 1.1 may change their PV without the PV of their participants being updated. This should be fixed by better subgraph infrastructure, but this fix will make sure the UI works for now.
    const pvOpt: GraphQueryOpts<'participant', keyof Participant>['where'] =
      pv === PV_V1 || pv === PV_V1_1
        ? {
            key: 'pv',
            operator: 'in',
            value: [PV_V1, PV_V1_1],
          }
        : {
            key: 'pv',
            value: pv,
          }

    const rows = [
      [
        'Wallet address',
        `Total ${tokenSymbolText({ tokenSymbol })} balance`,
        'Unclaimed balance',
        'Claimed balance',
        'Total ETH paid',
        'Last paid timestamp',
      ], // CSV header row
    ]

    setLoading(true)
    try {
      const participants = await querySubgraphExhaustive({
        entity: 'participant',
        keys: [
          'wallet',
          'totalPaid',
          'balance',
          'stakedBalance',
          'unstakedBalance',
          'lastPaidTimestamp',
        ],
        orderBy: 'balance',
        orderDirection: 'desc',
        block: {
          number: blockNumber,
        },
        where: [
          {
            key: 'projectId',
            value: projectId,
          },
          pvOpt,
        ],
      })

      if (!participants) {
        emitErrorNotification(t`Error loading holders`)
        throw new Error('No data.')
      }

      participants.forEach(p => {
        let date = new Date((p.lastPaidTimestamp ?? 0) * 1000).toUTCString()

        if (date.includes(',')) date = date.split(',')[1]

        rows.push([
          p.wallet ?? '--',
          fromWad(p.balance),
          fromWad(p.stakedBalance),
          fromWad(p.unstakedBalance),
          fromWad(p.totalPaid),
          date,
        ])
      })

      downloadCsvFile(
        `@${projectMetadata?.name}_holders-block${blockNumber}.csv`,
        rows,
      )

      setLoading(false)
    } catch (e) {
      console.error('Error downloading participants', e)
      setLoading(false)
    }
  }, [blockNumber, projectId, tokenSymbol, projectMetadata, pv])

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={download}
      okText={t`Download CSV`}
      okButtonProps={{ type: 'primary' }}
      cancelText={t`Close`}
      confirmLoading={loading}
      centered
    >
      <div>
        <h4>
          <Trans>
            Download CSV of {tokenSymbolText({ tokenSymbol })} holders
          </Trans>
        </h4>

        <label style={{ display: 'block', marginTop: 20, marginBottom: 5 }}>
          <Trans>Block number</Trans>
        </label>
        <FormattedNumberInput
          value={blockNumber?.toString()}
          onChange={val => setBlockNumber(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content={t`Latest`}
              onClick={() => setBlockNumber(latestBlockNumber)}
              disabled={blockNumber === latestBlockNumber}
            />
          }
        />
      </div>
    </Modal>
  )
}
