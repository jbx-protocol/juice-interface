import { SettingOutlined } from '@ant-design/icons'
import { WrenchIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Divider, Tooltip } from 'antd'
import { SubscribeButton } from 'components/SubscribeButton'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'

export function V2V3ProjectHeaderActions() {
  const wallet = useWallet()
  const { handle } = useContext(V2V3ProjectContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  const { projectId } = useContext(ProjectMetadataContext)

  // If the user is not connected to a wallet, or the wallet is on an unsupported chain, don't show the button
  const showSubscribeButton = wallet.isConnected && !wallet.chainUnsupported

  if (projectId === undefined) return null

  return (
    <>
      <div className="flex items-center gap-x-4">
        {showSubscribeButton && (
          <>
            <SubscribeButton projectId={projectId} tooltipPlacement="bottom" />
            <Divider className="h-8" type="vertical" />
          </>
        )}
        <Tooltip title={t`Project tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<WrenchIcon className="inline h-5 w-5" />}
            type="text"
          />
        </Tooltip>
        {canReconfigure && (
          <Link href={settingsPagePath('general', { handle, projectId })}>
            <Button icon={<SettingOutlined />}>
              <span>
                <Trans>Settings</Trans>
              </span>
            </Button>
          </Link>
        )}
      </div>

      <V2V3ProjectToolsDrawer
        open={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
    </>
  )
}
