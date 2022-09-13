import { SettingOutlined, SmileOutlined, ToolOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import { V2ProjectToolsDrawer } from 'components/v3/V3Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useV3ConnectedWalletHasPermission } from 'hooks/v3/contractReader/V3ConnectedWalletHasPermission'
import { V3OperatorPermission } from 'models/v3/permissions'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { settingsPagePath, veNftPagePath } from 'utils/routes'

export default function V2ProjectHeaderActions() {
  const {
    projectId,
    handle,
    veNft: { contractAddress: veNftContractAddress },
  } = useContext(V3ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useV3ConnectedWalletHasPermission(
    V3OperatorPermission.RECONFIGURE,
  )
  const veNftEnabled = veNftContractAddress ? true : false

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          color: colors.text.tertiary,
          paddingRight: 10,
        }}
      >
        {projectId && <Trans>ID: {projectId}</Trans>}{' '}
        <Tooltip
          title={t`This project uses the V2 version of the Juicebox contracts.`}
        >
          <ProjectVersionBadge versionText="V2" />
        </Tooltip>
      </span>
      <V2ProjectToolsDrawer
        visible={toolDrawerVisible}
        onClose={() => setToolDrawerVisible(false)}
      />
      <div style={{ display: 'flex' }}>
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
    </div>
  )
}
