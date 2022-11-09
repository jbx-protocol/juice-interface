import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Skeleton, Tooltip } from 'antd'
import { PV_V1, PV_V1_1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectHandleText } from 'hooks/ProjectHandleText'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { CSSProperties, useContext } from 'react'
import { formatDate } from 'utils/format/formatDate'
import { v2v3ProjectRoute } from 'utils/routes'
import { getTerminalVersion } from 'utils/v1/terminals'
import ETHAmount from './currency/ETHAmount'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { ProjectVersionBadge } from './ProjectVersionBadge'

export type ProjectCardProject = Pick<
  Project,
  | 'id'
  | 'handle'
  | 'metadataUri'
  | 'totalPaid'
  | 'createdAt'
  | 'terminal'
  | 'projectId'
  | 'pv'
>

const cardStyle: CSSProperties = {
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  whiteSpace: 'pre',
  overflow: 'hidden',
  padding: '25px 20px',
}

function ArchivedBadge() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '2px 4px',
        background: colors.background.l1,
        fontSize: '0.75rem',
        color: colors.text.tertiary,
        fontWeight: 500,
      }}
    >
      <Trans>ARCHIVED</Trans>
    </div>
  )
}

function useProjectCardData(project?: ProjectCardProject | BigNumber) {
  // Get ProjectCardProject object if this component was passed a projectId (bigNumber)
  const projectResponse: ProjectCardProject[] | undefined = useSubgraphQuery(
    BigNumber.isBigNumber(project)
      ? {
          entity: 'project',
          keys: [
            'id',
            'handle',
            'metadataUri',
            'totalPaid',
            'createdAt',
            'terminal',
            'projectId',
            'pv',
          ],
          where: {
            key: 'projectId',
            value: project.toString(),
          },
        }
      : null,
  ).data

  // If we were given projectId (BigNumber) and therefore projectResponse returned something,
  // return the first item in the array.
  if (projectResponse?.[0]) {
    return projectResponse[0]
  }

  // Otherwise, return the given [project] argument,  which must have type ProjectCardProject.
  return project as ProjectCardProject | undefined
}

export default function ProjectCard({
  project,
}: {
  project?: ProjectCardProject | BigNumber
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const projectCardData = useProjectCardData(project)
  const { data: metadata } = useProjectMetadata(projectCardData?.metadataUri)
  const { handleText } = useProjectHandleText({
    handle: projectCardData?.handle,
    projectId: projectCardData?.projectId,
  })
  const terminalVersion = getTerminalVersion(projectCardData?.terminal)

  if (!projectCardData) return null

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    projectCardData.totalPaid?.gt(0) &&
    projectCardData.totalPaid.lt(constants.WeiPerEther)
      ? 2
      : 0

  /**
   * We need to set the `as` prop for V2V3 projects
   * so that NextJs's prefetching works.
   *
   * The `href` prop will always be the project ID route,
   * but if there is a handle, we use that as the `as` prop
   * for pretty URLs.
   *
   * https://web.dev/route-prefetching-in-nextjs/
   */
  const projectCardHref =
    projectCardData.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: projectCardData.projectId,
        })
      : `/p/${projectCardData.handle}`

  const projectCardUrl =
    projectCardData.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: projectCardData.projectId,
          handle: projectCardData.handle,
        })
      : projectCardHref

  const isArchived =
    ((projectCardData.pv === PV_V1 || projectCardData.pv === PV_V1_1) &&
      V1ArchivedProjectIds.includes(projectCardData.projectId)) ||
    (projectCardData.pv === PV_V2 &&
      V2ArchivedProjectIds.includes(projectCardData.projectId)) ||
    metadata?.archived

  return (
    <Link href={projectCardHref} as={projectCardUrl}>
      <a>
        <div
          style={{
            borderRadius: radii.lg,
            cursor: 'pointer',
            overflow: 'hidden',

            ...cardStyle,
          }}
          className="clickable-border"
        >
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata?.logoUri}
              name={metadata?.name}
              size={110}
              projectId={projectCardData.projectId}
            />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              fontWeight: 400,
            }}
          >
            {metadata ? (
              <h2
                style={{
                  color: colors.text.primary,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: 21,
                }}
              >
                {metadata.name}
              </h2>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}

            <div>
              <span style={{ color: colors.text.primary, fontWeight: 500 }}>
                {handleText}
              </span>{' '}
              <ProjectVersionBadge
                size="small"
                versionText={`V${terminalVersion ?? projectCardData.pv}`}
              />
            </div>

            <div>
              <span style={{ color: colors.text.primary, fontWeight: 500 }}>
                <ETHAmount
                  amount={projectCardData.totalPaid}
                  precision={precision}
                />{' '}
              </span>

              <span style={{ color: colors.text.secondary }}>
                since{' '}
                {!!projectCardData.createdAt &&
                  formatDate(projectCardData.createdAt * 1000, 'yyyy-MM-DD')}
              </span>
            </div>

            {metadata?.description && (
              <Tooltip title={metadata.description} placement="bottom">
                <div
                  style={{
                    maxHeight: 20,
                    color: colors.text.tertiary,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {metadata.description}
                </div>
              </Tooltip>
            )}
          </div>

          {isArchived && <ArchivedBadge />}
          {!metadata && <Loading />}
        </div>
      </a>
    </Link>
  )
}
