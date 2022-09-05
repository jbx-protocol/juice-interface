import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectOwner from 'hooks/v2/contractReader/ProjectOwner'
import { useV2HasPermissions } from 'hooks/v2/contractReader/V2HasPermissions'
import { useUnclaimedTokensPermissionTx } from 'hooks/veNft/transactor/VeNftUnclaimedTokenPermissions'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2/permissions'
import { useContext, useState } from 'react'

const VeNftSetUnclaimedTokensPermissionSection = () => {
  const { chainUnsupported, isConnected, changeNetworks, connect } = useWallet()
  const {
    projectId,
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V2ProjectContext)
  const { data: owner } = useProjectOwner(projectId)
  const [loading, setLoading] = useState(false)
  const { data: hasUnclaimedTokensPermission, loading: permissionLoading } =
    useV2HasPermissions({
      operator: veNftContractAddress,
      account: owner,
      domain: projectId,
      permissions: [V2OperatorPermission.TRANSFER],
    })

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
        disabled={permissionLoading || hasUnclaimedTokensPermission}
      >
        {hasUnclaimedTokensPermission ? (
          <Trans>Already Enabled</Trans>
        ) : (
          <Trans>Enable</Trans>
        )}
      </Button>
    </section>
  )
}

export default VeNftSetUnclaimedTokensPermissionSection
