import { t } from '@lingui/macro'
import { Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectCategory } from 'models/project-visibility'
import Link from 'next/link'
import { useContext } from 'react'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const Tab = ({ type }: { type: ProjectCategory }) => {
    return (
      <Link href={`/projects?tab=${type}`}>
        <a
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
        </a>
      </Link>
    )
  }

  return (
    <div style={{ height: 40, marginTop: 15 }}>
      <Space direction="horizontal" size="large">
        <Tab type="trending" />
        <Tab type="holdings" />
        <Tab type="myprojects" />
        <Tab type="all" />
      </Space>
    </div>
  )
}
