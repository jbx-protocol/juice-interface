import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Badge } from 'components/Badge'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import { GnosisSafeBadge } from 'components/Project/ProjectHeader/GnosisSafeBadge'
import ProjectLogo from 'components/ProjectLogo'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useGnosisSafe } from 'hooks/safe/GnosisSafe'
import { useContext } from 'react'
import { EditProjectHandleButton } from './EditProjectHandleButton'
import SocialLinks from './SocialLinks'

const headerHeight = 120

export function ProjectHeader({
  handle,
  actions,
  canEditProjectHandle,
  projectOwnerAddress,
  hideDescription,
}: {
  handle: string | undefined
  actions: JSX.Element | undefined
  projectOwnerAddress: string | undefined
  canEditProjectHandle?: boolean
  hideDescription?: boolean
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
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          marginRight: '1.25rem',
          marginBottom: '1.25rem',
          flexDirection: 'column',
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

      <div
        style={{
          flex: 1,
          minWidth: '70%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              maxWidth: isMobile ? '100%' : '75%',
              display: 'flex',
              flex: 1,
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
          {!isMobile && (
            <SocialLinks
              discord={projectMetadata?.discord}
              twitter={projectMetadata?.twitter}
              infoUri={projectMetadata?.infoUri}
            />
          )}
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
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
            }}
          >
            <span>
              <Tooltip title={t`Project ID: ${projectId}`}>
                <span>@{handle}dddd</span>
              </Tooltip>
            </span>
            |
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
                {!gnosisSafeLoading && gnosisSafe && (
                  <GnosisSafeBadge
                    safe={gnosisSafe}
                    href={`${window.location.href}/safe`}
                  />
                )}

                {!handle && canEditProjectHandle && projectId ? (
                  <EditProjectHandleButton />
                ) : null}
              </div>
            )}
          </span>
        </div>
        {isMobile && (
          <SocialLinks
            discord={projectMetadata?.discord}
            twitter={projectMetadata?.twitter}
            infoUri={projectMetadata?.infoUri}
          />
        )}
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          {projectMetadata?.description && !hideDescription && (
            <Paragraph
              description={projectMetadata.description}
              characterLimit={250}
              style={{ color: colors.text.secondary }}
            />
          )}
        </span>
      </div>
    </header>
  )
}
