import { SettingOutlined, SmileOutlined, ToolOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { VeNftContext } from 'contexts/VeNft/VeNftContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath, veNftPagePath } from 'utils/routes'
import { ContractVersionSelect } from './ContractVersionSelect'

export function V2V3ProjectHeaderActions() {
  const { handle } = useContext(V2V3ProjectContext)
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )
  const veNftEnabled = Boolean(veNftContractAddress)

  const { projectId } = useContext(ProjectMetadataContext)

  return (
    <>
      <div className="flex items-center">
        <div className="flex items-center gap-x-4">
          <ContractVersionSelect />
          <Tooltip title={t`Project tools`} placement="bottom">
            <Button
              onClick={() => setToolDrawerVisible(true)}
              icon={<ToolOutlined />}
              type="text"
            />
          </Tooltip>

          {canReconfigure && (
            <Tooltip title={t`Project Settings`} placement="bottom">
              <div>
                <Link href={settingsPagePath('general', { handle, projectId })}>
                  <Button icon={<SettingOutlined />}>
                    <span>
                      <Trans>Settings</Trans>
                    </span>
                  </Button>
                </Link>
              </div>
            </Tooltip>
          )}

          {veNftEnabled && (
            <Tooltip title={t`veNFT`} placement="bottom">
              <div>
                <Link href={veNftPagePath('mint', { handle, projectId })}>
                  <Button type="text" icon={<SmileOutlined />} />
                </Link>
              </div>
            </Tooltip>
          )}
        </div>
      </div>

      <V2V3ProjectToolsDrawer
        open={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
    </>
  )
}
