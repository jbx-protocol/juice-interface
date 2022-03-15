import { Skeleton, Tooltip } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import { CSSProperties, useContext } from 'react'
import { formatDate } from 'utils/formatDate'

import { getTerminalVersion } from 'utils/v1/terminals'

import useSubgraphQuery from 'hooks/SubgraphQuery'
import { Trans } from '@lingui/macro'

import { Link } from 'react-router-dom'

import ProjectLogo from './ProjectLogo'
import ETHAmount from './currency/ETHAmount'
import { archivedProjectIds } from '../../constants/v1/archivedProjects'
import Loading from './Loading'

type ProjectCardProject = Pick<
  Project,
  | 'handle'
  | 'metadataUri'
  | 'totalPaid'
  | 'createdAt'
  | 'terminal'
  | 'projectId'
>

export default function ProjectCard({
  project,
}: {
  project?: ProjectCardProject | BigNumber
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const cardStyle: CSSProperties = {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    whiteSpace: 'pre',
    overflow: 'hidden',
    padding: '25px 20px',
  }

  // Get ProjectCardProject object if this component was passed a projectId (bigNumber)
  const projectQuery: ProjectCardProject[] | undefined = useSubgraphQuery(
    BigNumber.isBigNumber(project)
      ? {
          entity: 'project',
          keys: [
            'handle',
            'metadataUri',
            'totalPaid',
            'createdAt',
            'terminal',
            'projectId',
          ],
          where: {
            key: 'projectId',
            value: project.toString(),
          },
        }
      : null,
  ).data

  // Must use any to convert (ProjectCardProject | bigNumber) to ProjectCardProject
  const projectObj: any = project // eslint-disable-line @typescript-eslint/no-explicit-any
  let _project: ProjectCardProject

  // If we were given projectId (BN) and therefore projectQuery returned something,
  // we assign _project to that. Otherwise assign it to the initial
  // project passed to this component which must be ProjectCardProject
  if (projectQuery?.length) {
    _project = projectQuery[0]
  } else {
    _project = projectObj
  }

  const { data: metadata } = useProjectMetadata(_project?.metadataUri)
  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    _project?.totalPaid?.gt(0) && _project?.totalPaid.lt(constants.WeiPerEther)
      ? 2
      : 0

  const terminalVersion = getTerminalVersion(_project?.terminal)

  const isArchived =
    archivedProjectIds.includes(_project.projectId) || metadata?.archived

  return (
    <Link
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      key={_project?.handle}
      to={`/p/${_project?.handle}`}
    >
      <div style={cardStyle} className="clickable-border">
        <div style={{ marginRight: 20 }}>
          {metadata ? (
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={110}
            />
          ) : (
            <ProjectLogo uri={undefined} name={undefined} size={110} />
          )}
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
            <Skeleton paragraph={false} title={{ width: 120 }} />
          )}

          <div>
            <span style={{ color: colors.text.primary, fontWeight: 500 }}>
              @{_project?.handle}
            </span>
            <span
              style={{
                marginLeft: 10,
                color: colors.text.tertiary,
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              V{terminalVersion}
            </span>
          </div>

          <div>
            <span style={{ color: colors.text.primary, fontWeight: 500 }}>
              <ETHAmount amount={_project?.totalPaid} precision={precision} />{' '}
            </span>

            <span style={{ color: colors.text.secondary }}>
              since{' '}
              {!!_project?.createdAt &&
                formatDate(_project?.createdAt * 1000, 'yyyy-MM-DD')}
            </span>
          </div>

          {metadata && metadata.description && (
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

        {isArchived && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '2px 4px',
              background: colors.background.l1,
              fontSize: '0.7rem',
              color: colors.text.tertiary,
              fontWeight: 500,
            }}
          >
            <Trans>ARCHIVED</Trans>
          </div>
        )}

        {!metadata && <Loading />}
      </div>
    </Link>
  )
}
