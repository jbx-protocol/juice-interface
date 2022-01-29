import { Col, ColProps, Row, Space } from 'antd'
import { BigNumber } from 'ethers'
import { Project } from 'models/subgraph-entities/project'

import ProjectCard from './ProjectCard'

export default function ProjectsGrid({
  projects,
  isHomePage,
  list,
}: {
  projects:
    | Pick<Project, 'handle' | 'uri' | 'totalPaid' | 'createdAt'>[]
    | BigNumber[]
  isHomePage?: boolean
  list?: boolean
}) {
  const gutter = isHomePage ? 10 : 20

  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter },
  }

  const cardSize = isHomePage ? 'sm' : 'lg'
  const cardBg = isHomePage ? 'var(--background-l0)' : ''

  return list ? (
    <Space style={{ width: '100%' }} direction="vertical">
      {projects?.map((project, i) => (
        <ProjectCard project={project} key={i} />
      ))}
    </Space>
  ) : (
    <div>
      {projects?.map(
        (project, i) =>
          i % 2 === 0 && (
            <Row
              gutter={gutter}
              key={
                BigNumber.isBigNumber(project)
                  ? project.toString()
                  : project.handle
              }
              style={{ maxWidth: isHomePage ? 750 : '' }}
            >
              <Col {...colProps}>
                <ProjectCard
                  size={cardSize}
                  project={project}
                  bg={cardBg}
                  rank={isHomePage ? i + 1 : undefined}
                  percentGain={134}
                />
              </Col>
              {i + 1 < projects.length && (
                <Col {...colProps}>
                  {(() => {
                    const _p = projects[i + 1]
                    return (
                      <ProjectCard
                        project={_p}
                        size={cardSize}
                        bg={cardBg}
                        rank={isHomePage ? i + 2 : undefined}
                        percentGain={134}
                      />
                    )
                  })()}
                </Col>
              )}
            </Row>
          ),
      )}
    </div>
  )
}
