import { formatPaused } from 'utils/format/formatBoolean'

export function PausePayValue({ pausePay }: { pausePay: boolean }) {
  return <>{formatPaused(pausePay)}</>
}
