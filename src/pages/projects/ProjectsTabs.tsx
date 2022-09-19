import { t } from '@lingui/macro'
import { Space } from 'antd'
import { Tab } from 'components/Tab'
import { ProjectCategory } from 'models/project-visibility'

const TAB_TYPE_NAMES: { [k in ProjectCategory]: string } = {
  all: t`All`,
  holdings: t`Holdings`,
  myprojects: t`My projects`,
  trending: t`Trending`,
}

export default function ProjectsTabs({
  selectedTab,
}: {
  selectedTab: ProjectCategory
}) {
  const ProjectsTab = ({ type }: { type: ProjectCategory }) => {
    return (
      <Tab
        name={TAB_TYPE_NAMES[type]}
        link={`/projects?tab=${type}`}
        isSelected={type === selectedTab}
      />
    )
  }

  return (
    <div style={{ height: 40, marginTop: 15 }}>
      <Space direction="horizontal" size="large">
        <ProjectsTab type="trending" />
        <ProjectsTab type="holdings" />
        <ProjectsTab type="myprojects" />
        <ProjectsTab type="all" />
      </Space>
    </div>
  )
}
