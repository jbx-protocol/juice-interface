import { formatAllowed } from 'utils/format/formatBoolean'

export function AllowedValue({ value }: { value: boolean | undefined }) {
  return <>{formatAllowed(value)}</>
}
