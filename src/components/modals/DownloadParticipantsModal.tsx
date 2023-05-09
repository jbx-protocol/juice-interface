import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useBlockNumber } from 'hooks/useBlockNumber'
import { SGQueryOpts } from 'models/graph'
import { Participant } from 'models/subgraph-entities/vX/participant'
import { useCallback, useContext, useEffect, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
import { querySubgraphExhaustive } from 'utils/graph'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

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

  const [blockNumber, setBlockNumber] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  // Use block number 5 blocks behind chain head to allow for subgraph being a bit behind on indexing.
  const latestBlockNumber = useBlockNumber({ behindChainHeight: 5 })

  useEffect(() => {
    setBlockNumber(latestBlockNumber)
  }, [latestBlockNumber])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId || !pv) return

    // Projects that migrate between 1 & 1.1 may change their PV without the PV of their participants being updated. This should be fixed by better subgraph infrastructure, but this fix will make sure the UI works for now.
    const pvOpt: SGQueryOpts<'participant', keyof Participant>['where'] = {
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
          'wallet { id }',
          'volume',
          'balance',
          'stakedBalance',
          'erc20Balance',
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
          p.wallet.id ?? '--',
          fromWad(p.balance),
          fromWad(p.stakedBalance),
          fromWad(p.erc20Balance),
          fromWad(p.volume),
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

        <label className="mt-5 mb-1 block">
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
