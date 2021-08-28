import { Button, Select } from 'antd'
import Loading from 'components/shared/Loading'
import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { useProjects } from 'hooks/Projects'
import { useState } from 'react'

type OrderByOption = 'id' | 'totalPaid'

export default function Projects() {
  const [orderBy, setOrderBy] = useState<OrderByOption>('totalPaid')

  const projects = useProjects({
    orderBy,
    orderDirection: orderBy === 'totalPaid' ? 'desc' : 'asc',
  })

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h1>Projects on Juicebox</h1>
        <Select value={orderBy} onChange={setOrderBy} style={{ width: 160 }}>
          <Select.Option value="totalPaid">Total earned</Select.Option>
          <Select.Option value="id">Date created</Select.Option>
        </Select>
      </div>

      <div style={{ marginBottom: 40 }}>
        <a href="/#/create">
          <Button size="small">Create a project</Button>
        </a>
      </div>

      {projects ? <ProjectsGrid projects={projects} /> : <Loading />}
    </div>
  )
}
