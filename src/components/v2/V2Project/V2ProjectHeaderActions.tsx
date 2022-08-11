import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V2ProjectToolsDrawer } from 'components/v2/V2Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'

import { useContext, useState } from 'react'
import { ToolOutlined } from '@ant-design/icons'

import ProjectVersionBadge from 'components/ProjectVersionBadge'

import { featureFlagEnabled } from 'utils/featureFlags'

import { InfoCircleOutlined } from '@ant-design/icons'

import { useRouter } from 'next/router'

import V2ReconfigureFundingModalTrigger from './V2ProjectReconfigureModal/V2ReconfigureModalTrigger'
import { FEATURE_FLAGS } from 'constants/featureFlags'

export default function V2ProjectHeaderActions() {
  const router = useRouter()

  const { projectId } = useContext(V2ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [toolDrawerVisible, setToolDrawerVisible] = useState<boolean>(false)

  const canReconfigure = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const showReconfigureButton = canReconfigure
  const settingsPageEnabled = featureFlagEnabled(FEATURE_FLAGS.SETTINGS_PAGE)

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
        {showReconfigureButton && <V2ReconfigureFundingModalTrigger />}
        {settingsPageEnabled && (
          <Tooltip title={t`Open settings page`} placement="bottom">
            <Button
              onClick={() =>
                router.push(`/v2/p/${projectId}?page=settings`, undefined, {
                  shallow: true,
                })
              }
              icon={<InfoCircleOutlined />}
              type="text"
            />
          </Tooltip>
        )}
      </div>
    </div>
  )
}
