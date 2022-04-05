import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import {
  useHasPermission,
  V2OperatorPermission,
} from 'hooks/v2/contractReader/HasPermission'
import { useContext } from 'react'

import V2ReconfigureFundingModalTrigger from './V2Project/V2ProjectReconfigureModal/V2ReconfigureModalTrigger'

export default function V2ProjectHeaderActions() {
  const { projectId, fundingCycle, isPreviewMode } =
    useContext(V2ProjectContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const canReconfigure = useHasPermission(V2OperatorPermission.RECONFIGURE)

  const showReconfigureButton = canReconfigure && !isPreviewMode

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
        {projectId && !isPreviewMode && (
          <Trans>ID: {projectId.toNumber()}</Trans>
        )}{' '}
        <Tooltip
          title={t`This project uses the V2 version of the Juicebox contracts.`}
        >
          <span
            style={{
              padding: '2px 4px',
              background: colors.background.l1,
            }}
          >
            V2
          </span>
        </Tooltip>
      </span>
      {showReconfigureButton && (
        <V2ReconfigureFundingModalTrigger
          fundingDuration={fundingCycle?.duration}
        />
      )}
    </div>
  )
}
