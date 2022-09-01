import { primaryContentFontSize } from 'components/activityEventElems/styles'

export function DeployedERC20EventSubject({
  symbol,
}: {
  symbol: string | undefined
}) {
  if (symbol) {
    return <div style={{ fontSize: primaryContentFontSize }}>{symbol}</div>
  }
  return null
}
