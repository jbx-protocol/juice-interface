import { SettingOutlined, ToolOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import ProjectVersionBadge from 'components/ProjectVersionBadge'
import V2ReconfigureFundingModalTrigger from 'components/v2/V2Project/V2ProjectReconfigureModal/V2ReconfigureModalTrigger'
import { V2ProjectToolsDrawer } from 'components/v2/V2Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

export default function V2ProjectHeaderActions() {
  const { projectId } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)
  const settingsPageEnabled = featureFlagEnabled(FEATURE_FLAGS.SETTINGS_PAGE)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const SettingsPageButton = settingsPageEnabled ? (
    <Tooltip title={t`Project Settings`} placement="bottom">
      <a
        href={`/v2/p/${projectId}/settings`}
        className="ant-btn ant-btn-text ant-btn-icon-only"
      >
        <SettingOutlined />
      </a>
    </Tooltip>
  ) : (
    <V2ReconfigureFundingModalTrigger />
  )

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

        {canReconfigure && SettingsPageButton}
      </div>
    </div>
  )
}
