import { formatEnabled } from 'utils/format/formatBoolean'

export function HoldFeesValue({ holdFees }: { holdFees: boolean }) {
  return <>{formatEnabled(holdFees)}</>
}
