import { t, Trans } from '@lingui/macro'
import { EditOutlined } from '@ant-design/icons'
import ProjectLogo from 'components/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { ProjectMetadataV4 } from 'models/project-metadata'
import Paragraph from 'components/Paragraph'
import FormattedAddress from 'components/FormattedAddress'

import { Button, Tooltip } from 'antd'

import SocialLinks from './SocialLinks'

export default function ProjectHeader({
  handle,
  metadata,
  isArchived,
  actions,
  onClickSetHandle,
  owner,
}: {
  metadata?: ProjectMetadataV4
  isArchived?: boolean
  handle?: string
  actions?: JSX.Element
  onClickSetHandle?: VoidFunction
  owner?: string
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 120

  const projectTitle = metadata?.name || t`Untitled project`

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            marginRight: '1.25rem',
            marginBottom: '1.25rem',
            height: '100%',
          }}
        >
          <ProjectLogo
            uri={metadata?.logoUri}
            name={metadata?.name}
            size={headerHeight}
          />
        </div>

        <div style={{ flex: 1, minWidth: '70%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            <h1
              style={{
                fontSize: '2.4rem',
                lineHeight: '2.8rem',
                margin: 0,
                color: metadata?.name
                  ? colors.text.primary
                  : colors.text.placeholder,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={projectTitle}
            >
              {projectTitle}
            </h1>

            {actions ? actions : null}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              paddingTop: 8,
              paddingBottom: 4,
              fontWeight: 500,
              gap: 20,
            }}
          >
            {isArchived && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: colors.text.disabled,
                  textTransform: 'uppercase',
                }}
              >
                (archived)
              </span>
            )}
            {handle ? (
              <span
                style={{
                  color: colors.text.secondary,
                  fontWeight: 600,
                }}
              >
                @{handle}
              </span>
            ) : onClickSetHandle ? (
              <Tooltip
                placement="bottom"
                title={t`A project's handle is used in its URL, and allows it to be included in search results on the projects page.`}
              >
                <Button
                  onClick={onClickSetHandle}
                  type="text"
                  style={{ padding: 0 }}
                >
                  <EditOutlined /> <Trans>Add handle</Trans>
                </Button>
              </Tooltip>
            ) : null}
            <SocialLinks
              discord={metadata?.discord}
              twitter={metadata?.twitter}
              infoUri={metadata?.infoUri}
            />
          </div>
          {metadata?.description && (
            <Paragraph
              description={metadata.description}
              characterLimit={250}
              style={{ color: colors.text.secondary }}
            />
          )}
          {owner && (
            <div style={{ color: colors.text.secondary, marginTop: '0.4rem' }}>
              <Trans>
                Owned by <FormattedAddress address={owner} />
              </Trans>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
