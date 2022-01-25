import { Tooltip } from 'antd'

import { BigNumber } from 'ethers'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/project'
import { useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad } from 'utils/formatNumber'

import { getTerminalVersion } from 'utils/v1/terminals'

import useSubgraphQuery from 'hooks/SubgraphQuery'

import { CURRENCY_ETH } from 'constants/currency'

import CurrencySymbol from './CurrencySymbol'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'

type ProjectCardProject = Pick<
  Project,
  'handle' | 'uri' | 'totalPaid' | 'createdAt' | 'terminal' | 'id'
>

export default function ProjectCard({
  id,
  project,
}: {
  id?: BigNumber
  project?: ProjectCardProject
}) {
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const projectsQuery = useSubgraphQuery(
    id
      ? {
          entity: 'project',
          keys: ['handle', 'uri', 'totalPaid', 'createdAt', 'terminal', 'id'],
          where: {
            key: 'id',
            value: id.toString(),
          },
        }
      : null,
  ).data

  const _project = projectsQuery?.length ? projectsQuery[0] : project

  const { data: metadata } = useProjectMetadata(_project?.uri)
  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    _project?.totalPaid?.gt(0) &&
    _project?.totalPaid.lt(BigNumber.from('10000000000000000000'))
      ? 2
      : 0

  const terminalVersion = getTerminalVersion(_project?.terminal)

  return (
    <a
      style={{
        borderRadius: radii.lg,
        cursor: 'pointer',
        overflow: 'hidden',
      }}
      key={_project?.handle}
      href={`/#/p/${_project?.handle}`}
    >
      {metadata ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre',
            overflow: 'hidden',
            padding: 20,
          }}
          className="clickable-border"
        >
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
              }}
            >
              {metadata.name}
            </h2>

            <div>
              <span style={{ color: colors.text.primary, fontWeight: 500 }}>
                {_project?.id?.toString()} - @{_project?.handle}
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

            <div style={{ color: colors.text.secondary }}>
              <span>
                <CurrencySymbol currency={CURRENCY_ETH} />
                {formatWad(_project?.totalPaid, { precision })}{' '}
              </span>
              since{' '}
              {!!_project?.createdAt &&
                formatDate(_project?.createdAt * 1000, 'MM-DD-YY')}
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
    </a>
  )
}
