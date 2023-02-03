import { formatPaused } from 'utils/format/formatBoolean'

export function PauseTransfersValue({
  pauseTransfers,
}: {
  pauseTransfers: boolean
}) {
  return <>{formatPaused(pauseTransfers)}</>
}
