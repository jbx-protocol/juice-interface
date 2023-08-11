import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import TooltipIcon from 'components/TooltipIcon'
import TransactionModal from 'components/modals/TransactionModal'
import { useSetNftOperatorPermissionsTx } from 'hooks/JB721Delegate/transactor/useSetNftOperatorPermissionsTx'
import { useState } from 'react'

export function EnableNftsModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>(false)

  const setNftOperatorPermissionsTx = useSetNftOperatorPermissionsTx()

  const setPermissions = async () => {
    setLoading(true)
    await setNftOperatorPermissionsTx(undefined, {
      onConfirmed: () => {
        setLoading(false)
        onClose()
      },
      onDone() {
        setLoading(false)
      },
      onError() {
        setLoading(false)
      },
    })
  }

  return (
    <TransactionModal
      open={open}
      onCancel={onClose}
      okText={t`Grant NFT permissions`}
      title={t`Enable NFTs`}
      onOk={setPermissions}
      cancelText={t`Cancel`}
      confirmLoading={loading}
    >
      <Trans>
        To add NFTs to your cycle. You'll need to{' '}
        <strong>grant NFT permissions</strong> before launching your new cycle.
      </Trans>{' '}
      <TooltipIcon
        tip={
          <Trans>
            Allow the{' '}
            <ExternalLink
              href={`https://github.com/jbx-protocol/juice-721-delegate/blob/main/contracts/JBTiered721DelegateDeployer.sol`}
            >
              Juicebox NFT deployer contract
            </ExternalLink>{' '}
            to edit this project's cycle.
          </Trans>
        }
      />
    </TransactionModal>
  )
}
