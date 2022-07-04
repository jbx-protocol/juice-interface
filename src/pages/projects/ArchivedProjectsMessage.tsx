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
          <InfoCircleOutlined /> Archived projects have not been modified or
          deleted on the blockchain, and can still be interacted with directly
          through the Juicebox contracts.
        </Trans>
        <Tooltip
          title={t`A project can be archived by its owner from the tools menu on the project page.`}
        >
          <span
            style={{
              color: colors.text.action.primary,
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            {' '}
            <Trans>How do I archive a project?</Trans>
          </span>
        </Tooltip>
      </p>
    )
  }
  return null
}
