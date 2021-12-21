export default function UntrackedErc20Notice({
  tokenSymbol,
}: {
  tokenSymbol: string
}) {
  return (
    <p>
      <b>Notice:</b> {tokenSymbol} ERC20 tokens have not been indexed by
      Juicebox, meaning that the balances reflected below will be inaccurate for
      users who have unstaked and transferred their tokens. This will be solved
      with the release of{' '}
      <a
        href="https://app.gitbook.com/@jbx/s/juicebox/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Juicebox V2
      </a>
      . If this is a big issue for your project, let us know in the{' '}
      <a
        href="https://discord.gg/6jXrJSyDFf"
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord
      </a>
      .
    </p>
  )
}
