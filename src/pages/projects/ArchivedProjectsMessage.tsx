import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function ArchivedProjectsMessage({
  hidden,
}: {
  hidden: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!hidden) {
    return (
      <p style={{ marginBottom: 40, marginTop: 20, maxWidth: 800 }}>
        <Trans>
          <InfoCircleOutlined /> Archived projects haven't been modified or
          deleted on-chain. They can still be interacted with directly through
          the Juicebox contracts.
        </Trans>{' '}
        <Tooltip
          title={t`Project owners can archive their Juicebox projects in their project's settings page.`}
        >
          <span
            style={{
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: colors.stroke.primary,
              textUnderlineOffset: '2px',
              cursor: 'default',
            }}
          >
            <Trans>How do I archive a project?</Trans>
          </span>
        </Tooltip>
      </p>
    )
  }
  return null
}
