import { Cog6ToothIcon, WrenchIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Button, Divider, Tooltip } from 'antd'
import BookmarkButton from 'components/buttons/BookmarkButton/BookmarkButton'
import { SubscribeButton } from 'components/buttons/SubscribeButton/SubscribeButton'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath } from 'utils/routes'

export function V2V3ProjectHeaderActions() {
  const wallet = useWallet()
  const { handle } = useContext(V2V3ProjectContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const canReconfigure = useV2V3WalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  const { projectId } = useContext(ProjectMetadataContext)

  // If the user is not connected to a wallet, or the wallet is on an unsupported chain, don't show the buttons
  const showWalletButtons = wallet.isConnected && !wallet.chainUnsupported

  if (projectId === undefined) return null

  return (
    <>
      <div className="flex items-center gap-x-4">
        {showWalletButtons && (
          <>
            <SubscribeButton projectId={projectId} tooltipPlacement="bottom" />
            <BookmarkButton
              projectId={projectId}
              pv={PV_V2}
              tooltipPlacement="bottom"
            />
            <Divider className="h-8" type="vertical" />
          </>
        )}
        <Tooltip title={t`Project tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<WrenchIcon className="inline h-6 w-6" />}
            type="text"
          />
        </Tooltip>
        {canReconfigure && (
          <Link
            href={settingsPagePath(undefined, { handle, projectId })}
            legacyBehavior
          >
            <Button size="small">
              <span>
                <Cog6ToothIcon className="mr-2 inline h-4 w-4" />
                <Trans>Manage project</Trans>
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
