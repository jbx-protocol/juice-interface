import { t, Trans } from '@lingui/macro'
import { useQuery } from '@tanstack/react-query'
import { Modal } from 'antd'
import axios from 'axios'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { PV_V4 } from 'constants/pv'
import {
  ParticipantSnapshotsQuery,
  useProjectQuery,
} from 'generated/v4/graphql'

import { useJBChainId, useJBContractContext } from 'juice-sdk-react'
import { bendystrawClient } from 'lib/apollo/bendystrawClient'
import { bendystrawUri } from 'lib/apollo/bendystrawUri'
import { useCallback, useEffect, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { fromWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

const nowSecs = () => Math.floor(Date.now().valueOf() / 1000)

export function DownloadTokenHoldersModal({
  tokenSymbol,
  open,
  onCancel,
}: {
  tokenSymbol: string | undefined
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  const { projectId } = useJBContractContext()
  const chainId = useJBChainId()

  const [timestamp, setTimestamp] = useState<number>()
  const [loading, setLoading] = useState<boolean>()

  const { data: project } = useProjectQuery({
    client: bendystrawClient,
    variables: {
      projectId: Number(projectId),
      chainId: Number(chainId),
      version: parseInt(PV_V4) // TODO dynamic pv (4/5)
    },
    skip: !projectId || !chainId,
  })

  const suckerGroupId = project?.project?.suckerGroupId

  const { data: snapshots } = useQuery({
    queryKey: [suckerGroupId, timestamp],
    queryFn: () =>
      axios.post<ParticipantSnapshotsQuery['participantSnapshots']['items']>(
        `${bendystrawUri()}/participants`,
        {
          timestamp,
          suckerGroupId,
        },
      ),
    enabled: !!suckerGroupId,
  })

  useEffect(() => {
    setTimestamp(nowSecs())
  }, [])

  const download = useCallback(async () => {
    if (!timestamp || !suckerGroupId) return

    const rows = [
      [
        'Wallet address',
        `Total ${tokenSymbolText({ tokenSymbol })} balance`,
        'Unclaimed balance',
        'Claimed balance',
        'Total ETH paid',
        'Chain ID',
      ], // CSV header row
    ]

    setLoading(true)
    try {
      if (!snapshots?.data) {
        emitErrorNotification(t`Error loading holders`)
        throw new Error('No data.')
      }

      snapshots.data.forEach(p => {
        rows.push([
          p.address ?? '--',
          fromWad(p.balance),
          fromWad(p.creditBalance),
          fromWad(p.erc20Balance),
          fromWad(p.volume),
          p.chainId.toString(),
        ])
      })

      downloadCsvFile(
        `@v4-project-${suckerGroupId}_holders-timestamp-${timestamp}.csv`,
        rows,
      )

      setLoading(false)
    } catch (e) {
      console.error('Error downloading participant snapshots', e)
      setLoading(false)
    }
  }, [timestamp, suckerGroupId, tokenSymbol, snapshots])

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
          <Trans>Timestamp (seconds)</Trans>
        </label>
        <FormattedNumberInput
          value={timestamp?.toString()}
          onChange={val => setTimestamp(val ? parseInt(val) : undefined)}
          accessory={
            <InputAccessoryButton
              content={t`Latest`}
              onClick={() => setTimestamp(nowSecs)}
            />
          }
        />
      </div>
    </Modal>
  )
}
