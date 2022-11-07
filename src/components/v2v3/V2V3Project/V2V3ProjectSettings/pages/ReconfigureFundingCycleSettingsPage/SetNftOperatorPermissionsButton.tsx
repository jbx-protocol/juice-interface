import { CheckCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { useSetNftOperatorPermissionsTx } from 'hooks/v2v3/transactor/SetNftOperatorPermissionsTx'
import { useContext, useState } from 'react'

export function SetNftOperatorPermissionsButton({
  onConfirmed,
}: {
  onConfirmed: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      >
        <span>
          <Trans>Set NFT operator permissions</Trans>
        </span>
        {txExecuted ? <CheckCircleOutlined /> : null}
      </Button>
      <div
        style={{
          color: colors.text.secondary,
          marginTop: 5,
          fontSize: '0.7rem',
        }}
      >
        <Trans>
          Allow the{' '}
          <ExternalLink
            href={`https://github.com/jbx-protocol/juice-721-delegate/blob/main/contracts/JBTiered721DelegateDeployer.sol`}
          >
            Juicebox NFT deployer contract
          </ExternalLink>{' '}
          to reconfigure this project's funding cycle.
        </Trans>
      </div>
    </div>
  )
}
