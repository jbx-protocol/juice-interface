import { t } from '@lingui/macro'
import { Tab } from 'components/Tab'
import { ProjectCategory } from 'models/projectVisibility'
import Link from 'next/link'

const TAB_TYPE_NAMES = (): { [k in ProjectCategory]: string } => ({
  all: t`All`,
  new: t`New`,
  trending: t`Trending`,
})

const TABS: ProjectCategory[] = ['all', 'trending', 'new']

const ProjectTab = ({
  type,
  isSelected,
}: {
  type: ProjectCategory
  isSelected: boolean
}) => {
  return (
    <Link href={`/projects?tab=${type}`}>
      <Tab name={TAB_TYPE_NAMES()[type]} isSelected={isSelected} />
    </Link>
  )
}

export default function ProjectsTabs({
  selectedTab,
}: {
  selectedTab: ProjectCategory
}) {
  return (
    <div className="flex flex-wrap gap-y-4 gap-x-6">
      {TABS.map(type => (
        <ProjectTab type={type} key={type} isSelected={type === selectedTab} />
      ))}
    </div>
  )
}
