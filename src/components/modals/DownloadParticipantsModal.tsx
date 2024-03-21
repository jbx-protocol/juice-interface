import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import {
  ParticipantsDownloadDocument,
  ParticipantsDownloadQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { useBlockNumber } from 'hooks/useBlockNumber'
import { client } from 'lib/apollo/client'
import { paginateDepleteQuery } from 'lib/apollo/paginateDepleteQuery'
import { useCallback, useContext, useEffect, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
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
  const { data: latestBlockNumber } = useBlockNumber({ behindChainHeight: 5 })

  useEffect(() => {
    setBlockNumber(latestBlockNumber)
  }, [latestBlockNumber])

  const download = useCallback(async () => {
    if (blockNumber === undefined || !projectId || !pv) return

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
      const participants = await paginateDepleteQuery<
        ParticipantsDownloadQuery,
        QueryParticipantsArgs
      >({
        client,
        document: ParticipantsDownloadDocument,
        variables: {
          where: {
            projectId,
            pv,
          },
          block: {
            number: blockNumber,
          },
        },
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
