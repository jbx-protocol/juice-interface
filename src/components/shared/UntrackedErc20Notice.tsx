export default function UntrackedErc20Notice({
  tokenSymbol,
}: {
  tokenSymbol: string
}) {
  return (
    <div>
      <b>Notice:</b> These balances will not reflect transfers of claimed tokens
      because the {tokenSymbol} ERC-20 token has not yet been indexed by
      Juicebox.
    </div>
  )
}
