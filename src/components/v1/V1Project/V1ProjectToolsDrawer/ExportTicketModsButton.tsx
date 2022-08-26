import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { TicketMod } from 'models/mods'
import { useContext, useState } from 'react'
import { downloadCsvFile } from 'utils/csv'
import { permyriadToPercent } from 'utils/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { getProjectOwnerRemainderTicketMod } from 'utils/v1/mods'

const CSV_HEADER: (keyof TicketMod)[] = [
  'beneficiary',
  'percent',
  'preferUnstaked',
  'lockedUntil',
]

const ticketModToCsvRow = (mod: TicketMod) => {
  return [
    mod.beneficiary,
    `${parseFloat(permyriadToPercent(`${mod.percent}`)) / 100}`,
    `${mod.preferUnstaked}`,
    `${mod.lockedUntil}`,
  ]
}

const prepareTicketModsCsv = (
  mods: TicketMod[],
  projectOwnerAddress: string,
): (string | undefined)[][] => {
  const csvContent = mods.map(ticketModToCsvRow)
  const rows = [CSV_HEADER, ...csvContent]

  const projectOwnerMod = getProjectOwnerRemainderTicketMod(
    projectOwnerAddress,
    mods,
  )
  if (projectOwnerMod.percent > 0) {
    rows.push(ticketModToCsvRow(projectOwnerMod))
  }

  return rows
}

export function ExportTicketModsButton() {
  const { handle, currentFC, currentTicketMods, owner } =
    useContext(V1ProjectContext)
  const [loading, setLoading] = useState<boolean>(false)

  const onExportSplitsButtonClick = () => {
    if (!currentFC || !currentTicketMods || !owner) {
      emitErrorNotification(
        t`CSV data wasn't ready for export. Wait a few seconds and try again.`,
      )
      return
    }

    setLoading(true)

    try {
      const csvContent = prepareTicketModsCsv(currentTicketMods, owner)
      const filename = `@${handle}_reserved-tokens_fc-${currentFC.number}`

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
        <Trans>Export token allocation CSV</Trans>
      </span>
    </Button>
  )
}
