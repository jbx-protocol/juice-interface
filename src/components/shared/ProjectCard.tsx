import { Tooltip } from 'antd'

import { BigNumber, constants } from 'ethers'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import React, { CSSProperties, useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { getTerminalVersion } from 'utils/v1/terminals'

import useSubgraphQuery from 'hooks/SubgraphQuery'

import { Link } from 'react-router-dom'

import { CURRENCY_ETH } from 'constants/currency'

import CurrencySymbol from './CurrencySymbol'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { archivedProjectIds } from '../../constants/v1/archivedProjects'

type ProjectCardProject = Pick<
  Project,
  'handle' | 'uri' | 'totalPaid' | 'createdAt' | 'terminal' | 'id'
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
          keys: ['handle', 'uri', 'totalPaid', 'createdAt', 'terminal', 'id'],
          where: {
            key: 'id',
            value: project.toString(),
          },
        }
      : null,
  ).data

  // Must use any to convert (ProjectCardProject | bigNumber) to ProjectCardProject
  const projectObj: any = project
  let _project: ProjectCardProject

  // If we were given projectId (BN) and therefore projectQuery returned something,
  // we assign _project to that. Otherwise assign it to the initial
  // project passed to this component which must be ProjectCardProject
  if (projectQuery?.length) {
    _project = projectQuery[0]
  } else {
    _project = projectObj
  }

  const { data: metadata } = useProjectMetadata(_project?.uri)
  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    _project?.totalPaid?.gt(0) && _project?.totalPaid.lt(constants.WeiPerEther)
      ? 2
      : 0

  const terminalVersion = getTerminalVersion(_project?.terminal)

  const isArchived = archivedProjectIds.includes(_project.id.toNumber())

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
      {metadata ? (
        <div style={cardStyle} className="clickable-border">
          <div style={{ marginRight: 20 }}>
            <ProjectLogo
              uri={metadata.logoUri}
              name={metadata.name}
              size={110}
            />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              fontWeight: 400,
            }}
          >
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
                <CurrencySymbol currency={CURRENCY_ETH} />
                {formatWad(_project?.totalPaid, { precision })}{' '}
              </span>

              <span style={{ color: colors.text.secondary }}>
                since{' '}
                {!!_project?.createdAt &&
                  formatDate(_project?.createdAt * 1000, 'MM-DD-YY')}
              </span>
            </div>

            {metadata.description && (
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
              ARCHIVED
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {_project?.handle} <Loading />
        </div>
      )}
    </Link>
  )
}
