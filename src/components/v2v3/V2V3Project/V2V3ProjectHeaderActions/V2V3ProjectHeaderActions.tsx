import { SettingOutlined, SmileOutlined, ToolOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button, Space, Tooltip } from 'antd'
import { V2V3ProjectToolsDrawer } from 'components/v2v3/V2V3Project/V2V3ProjectToolsDrawer/V2V3ProjectToolsDrawer'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { VeNftContext } from 'contexts/veNftContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath, veNftPagePath } from 'utils/routes'
import { ContractVersionSelect } from './ContractVersionSelect'

export function V2V3ProjectHeaderActions() {
  const { handle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contractAddress: veNftContractAddress } = useContext(VeNftContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )
  const veNftEnabled = Boolean(veNftContractAddress)

  return (
    <>
      <Space className="flex items-center">
        <ContractVersionSelect />

        <div className="flex items-center">
          <Tooltip title={t`Tools`} placement="bottom">
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
                  <Button type="text" icon={<SettingOutlined />} />
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
      </Space>

      <V2V3ProjectToolsDrawer
        open={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
    </>
  )
}
