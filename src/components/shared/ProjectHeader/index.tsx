import { t } from '@lingui/macro'

import ProjectLogo from 'components/shared/ProjectLogo'
import { ThemeContext } from 'contexts/themeContext'

import { useContext } from 'react'

import { BigNumber } from 'ethers'

import { ProjectMetadataV3 } from 'models/project-metadata'

import Paragraph from 'components/shared/Paragraph'

import SocialLinks from './SocialLinks'

export default function ProjectHeader({
  projectId,
  handle,
  metadata,
  isArchived,
  actions,
}: {
  projectId: BigNumber
  metadata?: ProjectMetadataV3
  isArchived?: boolean
  handle?: string
  actions?: JSX.Element
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const headerHeight = 120
  const spacing = 20

  if (!projectId) return null

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
              }}
            >
              {metadata?.name || t`Untitled project`}
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
            }}
          >
            {isArchived && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: colors.text.disabled,
                  textTransform: 'uppercase',
                  marginRight: spacing,
                }}
              >
                (archived)
              </span>
            )}
            {handle && (
              <span
                style={{
                  color: colors.text.secondary,
                  marginRight: spacing,
                  fontWeight: 600,
                }}
              >
                @{handle}
              </span>
            )}
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
            />
          )}
        </div>
      </div>
    </div>
  )
}
