import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Loading from 'components/Loading'
import { useUnclaimedTokensPermissionTx } from 'hooks/veNft/transactor/VeNftUnclaimedTokenPermissions'
import { useVeNftHasProjectTokenPermission } from 'hooks/veNft/VeNftHasProjectTokenPermission'
import { useWallet } from 'hooks/Wallet'
import { useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'

const VeNftSetUnclaimedTokensPermissionSection = () => {
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const [loading, setLoading] = useState(false)
  const { data: hasUnclaimedTokensPermission, loading: permissionLoading } =
    useVeNftHasProjectTokenPermission()

  const unclaimedTokensPermissionTx = useUnclaimedTokensPermissionTx()

  async function unclaimedTokensPermission() {
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    setLoading(true)

    const txSuccess = await unclaimedTokensPermissionTx(undefined, {
      onConfirmed: () => {
        setLoading(false)
        reloadWindow()
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
      {permissionLoading ? (
        <Loading />
      ) : (
        <Button
          type="primary"
          size="small"
          onClick={unclaimedTokensPermission}
          loading={loading}
          disabled={hasUnclaimedTokensPermission}
        >
          {hasUnclaimedTokensPermission ? (
            <Trans>Already Enabled</Trans>
          ) : (
            <Trans>Enable</Trans>
          )}
        </Button>
      )}
    </section>
  )
}

export default VeNftSetUnclaimedTokensPermissionSection
