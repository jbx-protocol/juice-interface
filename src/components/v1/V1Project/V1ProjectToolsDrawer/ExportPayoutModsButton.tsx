import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { PayoutMod } from 'models/mods'
import { useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { permyriadToPercent } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { getProjectOwnerRemainderPayoutMod } from 'utils/v1/mods'

const CSV_HEADER: (keyof PayoutMod)[] = [
  'beneficiary',
  'percent',
  'preferUnstaked',
  'lockedUntil',
  'projectId',
  'allocator',
]

const payoutModToCsvRow = (mod: PayoutMod) => {
  return [
    mod.beneficiary,
    `${parseFloat(permyriadToPercent(`${mod.percent}`)) / 100}`,
    `${mod.preferUnstaked}`,
    `${mod.lockedUntil}`,
    mod.projectId?.toString(),
    mod.allocator,
  ]
}

const preparePayoutModsCsv = (
  mods: PayoutMod[],
  projectOwnerAddress: string,
): (string | undefined)[][] => {
  const csvContent = mods.map(payoutModToCsvRow)
  const rows = [CSV_HEADER, ...csvContent]

  const projectOwnerMod = getProjectOwnerRemainderPayoutMod(
    projectOwnerAddress,
    mods,
  )
  if (projectOwnerMod.percent > 0) {
    rows.push(payoutModToCsvRow(projectOwnerMod))
  }

  return rows
}

export function ExportPayoutModsButton() {
  const { handle, currentFC, currentPayoutMods, owner } =
    useContext(V1ProjectContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!currentFC || !currentPayoutMods || !owner) {
      emitErrorNotification(
        t`CSV data wasn't ready for export. Wait a few seconds and try again.`,
      )
      return
    }

    setLoading(true)

    try {
      const csvContent = preparePayoutModsCsv(currentPayoutMods, owner)
      const filename = `@${handle}_payouts_fc-${currentFC.number}`

      downloadCsvFile(filename, csvContent)
    } catch (e) {
      console.error(e)
      emitErrorNotification(t`CSV download failed.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      icon={<DownloadOutlined />}
      size="small"
      onClick={onExportSplitsButtonClick}
      loading={loading}
    >
      <span>
        <Trans>Export payouts CSV</Trans>
      </span>
    </Button>
  )
}
