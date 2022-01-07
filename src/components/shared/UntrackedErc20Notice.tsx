import { Trans } from '@lingui/macro'

export default function UntrackedErc20Notice({
  tokenSymbol,
}: {
  tokenSymbol: string
}) {
  return (
    <div>
      <Trans>
        <b>Notice:</b> These balances will not reflect transfers of claimed
        tokens because the {tokenSymbol} ERC-20 token has not yet been indexed
        by Juicebox.
      </Trans>
    </div>
  )
}
