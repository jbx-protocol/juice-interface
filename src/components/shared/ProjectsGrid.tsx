import { Col, ColProps, Row, Space } from 'antd'
import { BigNumber } from 'ethers'
import { Project } from 'models/subgraph-entities/project'

import ProjectCard from './ProjectCard'

export default function ProjectsGrid({
  projects,
  list,
}: {
  projects:
    | Pick<Project, 'handle' | 'uri' | 'totalPaid' | 'createdAt'>[]
    | BigNumber[]
  list?: boolean
}) {
  const gutter = 20

  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter },
  }

  return list ? (
    <Space style={{ width: '100%' }} direction="vertical">
      {projects?.map(project => {
        if (BigNumber.isBigNumber(project)) {
          return <ProjectCard id={project} key={project.toString()} />
        } else {
          return <ProjectCard project={project} key={project.handle} />
        }
      })}
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
            >
              <Col {...colProps}>
                {BigNumber.isBigNumber(project) ? (
                  <ProjectCard id={project} />
                ) : (
                  <ProjectCard project={project} />
                )}
              </Col>
              {i + 1 < projects.length && (
                <Col {...colProps}>
                  {(() => {
                    const _p = projects[i + 1]

                    return BigNumber.isBigNumber(_p) ? (
                      <ProjectCard id={_p} />
                    ) : (
                      <ProjectCard project={_p} />
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
