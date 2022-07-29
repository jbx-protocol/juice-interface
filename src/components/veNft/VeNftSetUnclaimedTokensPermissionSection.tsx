import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useUnclaimedTokensPermissionTx } from 'hooks/veNft/transactor/VeNftUnclaimedTokenPermissions'
import { useContext, useState } from 'react'

const VeNftSetUnclaimedTokensPermissionSection = () => {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const [loading, setLoading] = useState(false)
  const unclaimedTokensPermissionTx = useUnclaimedTokensPermissionTx()

  async function unclaimedTokensPermission() {
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    setLoading(true)

    const txSuccess = await unclaimedTokensPermissionTx(undefined, {
      onConfirmed: () => {
        setLoading(false)
      },
    })

    if (!txSuccess) {
      setLoading(false)
    }
  }
  return (
    <section>
      <h3>
        <Trans>Enable veNFT to Spend Unclaimed Tokens</Trans>
      </h3>
      <p>
        <Trans>
          This will enable your project's veNFT contract to spend unclaimed
          tokens in addition to project ERC-20 tokens.
        </Trans>
      </p>
      <Button
        type="primary"
        size="small"
        onClick={unclaimedTokensPermission}
        loading={loading}
      >
        Enable
      </Button>
    </section>
  )
}

export default VeNftSetUnclaimedTokensPermissionSection
