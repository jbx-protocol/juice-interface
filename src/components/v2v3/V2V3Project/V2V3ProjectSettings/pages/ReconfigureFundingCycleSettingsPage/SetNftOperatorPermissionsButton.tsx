import { CheckCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, ButtonProps } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { useSetNftOperatorPermissionsTx } from 'hooks/JB721Delegate/transactor/SetNftOperatorPermissionsTx'
import { useState } from 'react'

export function SetNftOperatorPermissionsButton({
  onConfirmed,
  ...props
}: {
  onConfirmed: VoidFunction
} & ButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [txExecuted, setTxExecuted] = useState<boolean>(false)

  const setNftOperatorPermissionsTx = useSetNftOperatorPermissionsTx()

  const setPermissions = async () => {
    setLoading(true)
    await setNftOperatorPermissionsTx(undefined, {
      onConfirmed: () => {
        setTxExecuted(true)
        setLoading(false)
        onConfirmed()
      },
    })
  }

  return (
    <div>
      <Button
        loading={loading}
        onClick={setPermissions}
        type="primary"
        disabled={txExecuted}
        {...props}
      >
        <span>
          <Trans>Set NFT operator permissions</Trans>
        </span>
        {txExecuted ? <CheckCircleOutlined /> : null}
      </Button>
      <div className="mt-1 text-xs text-grey-500 dark:text-grey-300">
        <Trans>
          Allow the{' '}
          <ExternalLink
            href={`https://github.com/jbx-protocol/juice-721-delegate/blob/main/contracts/JBTiered721DelegateDeployer.sol`}
          >
            Juicebox NFT deployer contract
          </ExternalLink>{' '}
          to edit this project's cycle.
        </Trans>
      </div>
    </div>
  )
}
