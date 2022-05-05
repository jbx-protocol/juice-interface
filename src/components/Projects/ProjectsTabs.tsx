import { t } from '@lingui/macro'
import { Space } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectCategory } from 'models/project-visibility'
import { useContext } from 'react'
import { Link } from 'react-router-dom'

const TAB_TYPE_NAMES: { [k in ProjectCategory]: string } = {
  all: t`All`,
  holdings: t`Holdings`,
  myprojects: t`My Projects`,
  trending: t`Trending`,
}

export default function ProjectsTabs({
  selectedTab,
}: {
  selectedTab: ProjectCategory
}) {
  const { signingProvider } = useContext(NetworkContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const Tab = ({ type }: { type: ProjectCategory }) => {
    return (
      <Link
        to={`/projects?tab=${type}`}
        style={{
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderBottom: '2px solid transparent',
          paddingBottom: 6,
          fontWeight: 500,
          ...(type === selectedTab
            ? {
                color: colors.text.primary,
                borderColor: colors.text.primary,
              }
            : {
                color: colors.text.secondary,
                borderColor: 'transparent',
              }),
        }}
      >
        {TAB_TYPE_NAMES[type]}
      </Link>
    )
  }

  return (
    <div style={{ height: 40, marginTop: 15 }}>
      <Space direction="horizontal" size="large">
        <Tab type="trending" />
        {signingProvider ? <Tab type="holdings" /> : null}
        {signingProvider ? <Tab type="myprojects" /> : null}
        <Tab type="all" />
      </Space>
    </div>
  )
}
