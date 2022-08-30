import {
  HomeOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { V2ProjectToolsDrawer } from 'components/v2/V2Project/V2ProjectToolsDrawer/V2ProjectToolsDrawer'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext, useState } from 'react'

import ProjectVersionBadge from 'components/ProjectVersionBadge'

import V2ReconfigureFundingModalTrigger from 'components/v2/V2Project/V2ProjectReconfigureModal/V2ReconfigureModalTrigger'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import Link from 'next/link'
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

  const showReconfigureButton = canReconfigure

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
        {settingsPageEnabled && projectId && (
          <>
            <Link href={`/v2/p/${projectId}`}>
              <Tooltip title={t`Project Home`} placement="bottom">
                <Button icon={<HomeOutlined />} type="text" />
              </Tooltip>
            </Link>
            <Link href={`/v2/p/${projectId}/settings`}>
              <Tooltip title={t`Project Settings`} placement="bottom">
                <Button icon={<ThunderboltOutlined />} type="text" />
              </Tooltip>
            </Link>
          </>
        )}
        <Tooltip title={t`Tools`} placement="bottom">
          <Button
            onClick={() => setToolDrawerVisible(true)}
            icon={<ToolOutlined />}
            type="text"
          />
        </Tooltip>
        {showReconfigureButton && <V2ReconfigureFundingModalTrigger />}
      </div>
    </div>
  )
}
