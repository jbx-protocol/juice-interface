import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { useGnosisSafe } from 'hooks/GnosisSafe'
import useMobile from 'hooks/Mobile'
import { useContext } from 'react'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'

const headerHeight = 120

export function ProjectHeader({
  handle,
  actions,
  canEditProjectHandle,
  projectOwnerAddress,
}: {
  handle: string | undefined
  actions: JSX.Element | undefined
  projectOwnerAddress: string | undefined
  canEditProjectHandle?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { projectMetadata, projectId, isArchived } = useContext(
    ProjectMetadataContext,
  )

  const isMobile = useMobile()
  const { data: gnosisSafe, isLoading: gnosisSafeLoading } =
    useGnosisSafe(projectOwnerAddress)

  const projectTitle = projectMetadata?.name || t`Untitled project`

  return (
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
          uri={projectMetadata?.logoUri}
          name={projectMetadata?.name}
          size={headerHeight}
          projectId={projectId}
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
          <div
            style={{
              maxWidth: isMobile ? '100%' : '75%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '2.4rem',
                lineHeight: '2.8rem',
                margin: 0,
                color: projectMetadata?.name
                  ? colors.text.primary
                  : colors.text.placeholder,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={projectTitle}
            >
              {projectTitle}
            </h1>
            {isArchived && (
              <Badge
                variant="warning"
                style={{
                  textTransform: 'uppercase',
                  marginLeft: '1rem',
                }}
              >
                <Trans>Archived</Trans>
              </Badge>
            )}
          </div>

          {actions ?? null}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            paddingTop: 8,
            paddingBottom: 4,
            fontWeight: 500,
            columnGap: 20,
          }}
        >
          <span
            style={{
              color: colors.text.secondary,
              fontWeight: 600,
            }}
          >
            {handle ? (
              <Tooltip title={t`Project ID: ${projectId}`}>
                <span>@{handle}</span>
              </Tooltip>
            ) : (
              <Trans>Project #{projectId}</Trans>
            )}
          </span>

          {!handle && canEditProjectHandle && projectId ? (
            <EditProjectHandleButton />
          ) : null}

          <SocialLinks
            discord={projectMetadata?.discord}
            twitter={projectMetadata?.twitter}
            infoUri={projectMetadata?.infoUri}
          />
        </div>

        {projectMetadata?.description && (
          <Paragraph
            description={projectMetadata.description}
            characterLimit={250}
            style={{ color: colors.text.secondary }}
          />
        )}

        {projectOwnerAddress && (
          <div
            style={{
              color: colors.text.secondary,
              marginTop: '0.4rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '0.4rem' }}>
              <Trans>
                Owned by <FormattedAddress address={projectOwnerAddress} />
              </Trans>
            </span>
            {!gnosisSafeLoading && gnosisSafe && <GnosisSafeBadge />}
          </div>
        )}
      </div>
    </div>
  )
}
