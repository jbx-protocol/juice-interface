import { t } from '@lingui/macro'
import { Space } from 'antd'
import { Tab } from 'components/Tab'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectCategory } from 'models/project-visibility'
import Link from 'next/link'
import { featureFlagEnabled } from 'utils/featureFlags'

const TAB_TYPE_NAMES: { [k in ProjectCategory]: string } = {
  all: t`All`,
  holdings: t`My holdings`,
  myprojects: t`My projects`,
  mybookmarks: t`My bookmarks`,
  trending: t`Trending`,
}

const bookmarksEnabled = featureFlagEnabled(FEATURE_FLAGS.BOOKMARKS)

const TABS: ProjectCategory[] = bookmarksEnabled
  ? ['all', 'trending', 'holdings', 'myprojects', 'mybookmarks']
  : ['all', 'trending', 'holdings', 'myprojects']

const ProjectTab = ({
  type,
  isSelected,
}: {
  type: ProjectCategory
  isSelected: boolean
}) => {
  return (
    <Link href={`/projects?tab=${type}`}>
      <a>
        <Tab name={TAB_TYPE_NAMES[type]} isSelected={isSelected} />
      </a>
    </Link>
  )
}

export default function ProjectsTabs({
  selectedTab,
}: {
  selectedTab: ProjectCategory
}) {
  return (
    <Space
      direction="horizontal"
      size="large"
      style={{ height: 40, marginTop: 15 }}
    >
      {TABS.map(type => (
        <ProjectTab type={type} key={type} isSelected={type === selectedTab} />
      ))}
    </Space>
  )
}
